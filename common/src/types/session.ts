import { LOGIN_METHOD } from "./login";

export interface UserSession {
  isLoggedIn: boolean;
  publicKey?: string;
  userId?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  // Session expiry
  expiresAt?: number;
  // Should expire, before session expires
  accessTokenExpiresAt?: number;
  // Should expire, when session expires
  refreshTokenExpiresAt?: number;
  method?: LOGIN_METHOD;
}

export interface LoggedOutUserSession extends UserSession {
  isLoggedIn: false;
}

export interface LoggedInUserSessionBase extends UserSession {
  isLoggedIn: true;
  userId: string;
  accessToken: string;
  refreshToken: string;
  // Session expiry
  expiresAt: number;
  // Should expire, before session expires
  accessTokenExpiresAt: number;
  // Should expire, when session expires
  refreshTokenExpiresAt: number;
  method: LOGIN_METHOD;
}

export interface LoggedInUserSessionNostr extends LoggedInUserSessionBase {
  publicKey: string;
  method: LOGIN_METHOD.MANUAL | LOGIN_METHOD.NOSTR;
}

export interface LoggedInUserSessionMagicLinkEmail
  extends LoggedInUserSessionBase {
  email?: string;
  method: LOGIN_METHOD.EMAIL_MAGIC_LINK;
}

export interface LoggedInUserSessionGoogle extends LoggedInUserSessionBase {
  method: LOGIN_METHOD.GOOGLE;
}

export type LoggedInUserSession =
  | LoggedInUserSessionNostr
  | LoggedInUserSessionMagicLinkEmail
  | LoggedInUserSessionGoogle;

export type Session = LoggedOutUserSession | LoggedInUserSession;
