import axios, { AxiosInstance } from "axios";
import { decodeJwt } from "jose";
import {
  LoginSuccess,
  LoginRequest,
  LoginChallenge,
  RenewalRequest,
  NostrLoginRequest,
  MagicLinkLoginReqest,
  GoogleLoginRequest,
  LoginChallengeUserResponse,
} from "./types";
import { Session } from "./types/session";
import {
  clearLsSession,
  getLsSession,
  hasFutureExpiry,
  makeAuthHeaders,
  setLsPrivateKey,
  setLsSession,
} from "./utils";

export interface RustyAuthApiProps {
  baseUrl?: string;
  timeout?: number;
  useLocalStore?: boolean;
  localStorageKey?: string;
}

export const decodeSessionTokens = (cr: {
  access_token: string;
  refresh_token: string;
}): {
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
} => {
  const accessTokenDecoded = decodeJwt(cr.access_token);
  const refreshTokenDecoded = decodeJwt(cr.refresh_token);
  if (!accessTokenDecoded.exp || !refreshTokenDecoded.exp) {
    throw new Error("Invalid token");
  }

  return {
    accessTokenExpiresAt: accessTokenDecoded.exp,
    refreshTokenExpiresAt: refreshTokenDecoded.exp,
  };
};

export interface RustyAuthSpec {
  /** Initiate login process with email, NOSTR, or other methods */
  login(loginRequest: LoginRequest): Promise<LoginChallenge>;
  /** Complete login challenge with signature or magic link verification */
  loginChallenge(props: LoginChallengeUserResponse): Promise<LoginSuccess>;
  /** 
   * Refresh expired access token using refresh token 
   * Returns undefined, if refresh failed, but session is still valid
   */
  refresh(): Promise<LoginSuccess | undefined>;
  /** Log out user and invalidate session */
  logout(): Promise<void>;
  /** Get current session data */
  getSession(): Session;
  /** Set/update session data */
  setSession(session: Session): void;
  /** Clear session data */
  clearSession(): void;
  /** Check if session and refresh token are valid */
  hasValidSession(threshold?: number): boolean;
  // /** Check if access token is valid and not expired */
  hasValidAccessToken(threshold?: number): boolean;
  /** Check if access token needs refresh (session valid but access token expired) */
  needsRefresh(): boolean;
  /** Get access token (may be expired) */
  getAccessToken(): string;
}

export class RustyAuth implements RustyAuthSpec {
  private baseUrl: string;
  private timeout: number;
  private useLocalStore: boolean = false;
  private localStorageKey: string;
  private client: AxiosInstance;

  private session: Session;
  private refreshAttempts: number = 0;
  private maxRefreshAttempts: number = 3;
  private lastRefreshAttempt: number = 0;

  constructor({ baseUrl, timeout, useLocalStore, localStorageKey }: RustyAuthApiProps) {
    this.baseUrl = baseUrl || "https://api.checkoutbay.com/v1";
    this.timeout = timeout || 5000;
    this.useLocalStore = useLocalStore || false;
    if (localStorageKey) {
      this.localStorageKey = localStorageKey;
    } else {
      throw new Error("localStorageKey is required");
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.session = {
      isLoggedIn: false,
    };

    console.info(`[api] => baseUrl: ${this.baseUrl}`);

    if (this.useLocalStore) {
      console.info("[api] => Using local storage for session management");
      const storedSession = getLsSession(this.localStorageKey);
      if (storedSession) {
        this.session = storedSession;
        console.debug("[api] => Loaded session from local storage", this.session);
      } else {
        console.debug("[api] => No session found in local storage");
      }
    }
  }

  getSession(): Session {
    return this.session;
  }

  setSession(session: Session): void {
    this.session = session;
    // Reset refresh attempts on successful session update
    this.refreshAttempts = 0;
    this.lastRefreshAttempt = 0;
    if (this.useLocalStore) {
      setLsSession(session, this.localStorageKey);
    }
  }

  clearSession(): void {
    if (this.useLocalStore) {
      clearLsSession(this.localStorageKey);
    }
    this.session = { isLoggedIn: false };
    // Reset refresh tracking on session clear
    this.refreshAttempts = 0;
    this.lastRefreshAttempt = 0;
  }

  hasValidSession(threshold: number = 300): boolean {
    // Check if session is logged in and refresh token is still valid
    if (!this.session.isLoggedIn || !this.session.refreshTokenExpiresAt) {
      return false;
    }
    return hasFutureExpiry(this.session.refreshTokenExpiresAt, threshold);
  }

  hasValidAccessToken(threshold: number = 300): boolean {
    if (!this.session.isLoggedIn) {
      console.warn('AUTH: Session is not logged in');
      return false;
    }

    if (this.session.accessTokenExpiresAt === undefined) {
      console.warn('AUTH: Access token expiration time is not defined');
      return false;
    }

    if (!hasFutureExpiry(this.session.accessTokenExpiresAt, threshold)) {
      console.warn(`AUTH: Access token is not valid, expires at ${this.session.accessTokenExpiresAt}`);
      return false;
    }

    return true;
  }

  needsRefresh(threshold: number = 300): boolean {
    return this.hasValidSession(threshold) && !this.hasValidAccessToken(threshold);
  }

  getUserId(): string {
    if (!this.session.userId) {
      throw new Error("No user id");
    }
    return this.session.userId;
  }

  getAccessToken(): string {
    if (!this.hasValidAccessToken()) {
      throw new Error("No access token");
    }
    return this.session.accessToken as string;
  }

  getRefreshToken(): string {
    if (!this.hasValidSession(30)) {
      throw new Error("AUTH: Session is invalid or expired, cannot get refresh token");
    }
    return this.session.refreshToken as string;
  }

  async login(loginRequest: LoginRequest): Promise<LoginChallenge> {
    // Get referral code from localStorage if available
    const referralCode = localStorage.getItem('pendingReferralCode');
    
    // Add referral code to the request if it exists
    if (referralCode) {
      if ('NOSTR' in loginRequest) {
        (loginRequest.NOSTR as NostrLoginRequest).referral_code = referralCode;
      } else if ('EmailMagicLink' in loginRequest) {
        (loginRequest.EmailMagicLink as MagicLinkLoginReqest).referral_code = referralCode;
      } else if ('Google' in loginRequest) {
        (loginRequest.Google as GoogleLoginRequest).referral_code = referralCode;
      }
    }

    const { data } = await this.client.post<LoginChallenge>(
      "/login",
      loginRequest
    );
    return data;
  }

  async loginChallenge(props: LoginChallengeUserResponse): Promise<LoginSuccess> {
    const { data } = await this.client.post<LoginSuccess>(
      "/login/challenge",
      props
    );
    let newSession = {
      isLoggedIn: true,
      userId: data.user_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
      ...decodeSessionTokens(data),
      method: props.type,
    } as Session;
    if (props.type === "NOSTR") {
      // TODO: TYPES!
      newSession.publicKey = (props.content as any)?.public_key;
    }
    this.setSession(newSession);
    return data;
  }

  async refresh(): Promise<LoginSuccess | undefined> {
    // Check if we've exceeded maximum refresh attempts
    if (this.refreshAttempts >= this.maxRefreshAttempts) {
      console.warn(`AUTH: Maximum refresh attempts (${this.maxRefreshAttempts}) exceeded, clearing session`);
      this.clearSession();
      throw new Error("AUTH: Maximum refresh attempts exceeded, session cleared");
    }

    // Implement exponential backoff between attempts
    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastRefreshAttempt;
    const backoffDelay = Math.pow(2, this.refreshAttempts) * 1000; // 1s, 2s, 4s
    
    if (timeSinceLastAttempt < backoffDelay) {
      const remainingDelay = backoffDelay - timeSinceLastAttempt;
      console.debug(`AUTH: Backoff active, waiting ${remainingDelay}ms before retry`);
      await new Promise(resolve => setTimeout(resolve, remainingDelay));
    }

    this.refreshAttempts++;
    this.lastRefreshAttempt = Date.now();

    try {
      const { data } = await this.client.post<LoginSuccess>(
        "/login/refresh",
        {
          access_token: this.session.accessToken,
          refresh_token: this.getRefreshToken(),
        } as RenewalRequest
      );
      
      let newSession = {
        isLoggedIn: true,
        userId: data.user_id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
        ...decodeSessionTokens(data),
        method: this.session.method,
      } as Session;
      if (this.session.publicKey) {
        newSession.publicKey = this.session.publicKey;
      }
      this.setSession(newSession);
      console.info("AUTH: Token refresh successful");
      return data;
    } catch (error: any) {
      console.warn(`AUTH: Refresh attempt ${this.refreshAttempts}/${this.maxRefreshAttempts} failed`, error);
      
      // Check if this is an authentication error (user deleted, invalid refresh token, etc.)
      const isAuthError = error?.response?.status === 401 || 
                         error?.response?.status === 403 || 
                         error?.response?.status === 404;
      
      if (isAuthError) {
        console.warn("AUTH: Authentication error detected, clearing session immediately");
        this.clearSession();
        throw new Error("AUTH: Authentication failed, session cleared");
      }
      
      // For server errors (5xx) or network issues, check if session is still valid
      if (this.hasValidSession(300)) {
        console.debug("AUTH: Refresh failed but session still valid, will retry later");
        return undefined; // Session is still valid, but access token refresh failed
      }
      
      // If session is no longer valid, clear it
      console.warn("AUTH: Session no longer valid, clearing");
      this.clearSession();
      throw new Error("AUTH: Session expired, cleared");
    }
  }

  async logout(): Promise<void> {
    if (this.hasValidAccessToken()) {
      try {
        await this.client.post<null>(
          "/a/logout",
          {},
          {
            headers: makeAuthHeaders(this.getAccessToken()),
          }
        );
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
    this.clearSession();
  }
}
