import {
  clearLsShop,
  getLsShop,
  RustyShopAPI,
  setLsShop,
  Shop,
} from "@gofranz/checkoutbay-common";
import {
  Currency,
  getErrorTitle,
  LOGIN_METHOD,
  LoginChallenge,
  LoginChallengeUserResponse,
  LoginSuccess,
  RustyAuth,
  Session,
} from "@gofranz/common";
import { showApiErrorNotification } from "@gofranz/common-components";
import { notifications } from "@mantine/notifications";
import * as Sentry from '@sentry/react';
import { create } from "zustand";
import { API_BASE_URL, LOCAL_STORAGE_KEY } from "./constants";
import type { AxiosError } from "axios";

// Helper function to handle API errors generically
const handleApiError = (error: AxiosError) => {
  // Don't show notifications for aborted requests or network timeouts during development
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return;
  }

  const title = getErrorTitle(error);
  showApiErrorNotification(error, notifications, title);
};

// Helper function to update Sentry user context
const updateSentryUserContext = (session: Session | undefined) => {
  if (session?.isLoggedIn) {
    Sentry.setUser({
      id: session.userId,
      // Partially mask the public key for privacy
      username: session.publicKey ? `${session.publicKey.slice(0, 8)}...${session.publicKey.slice(-8)}` : undefined,
      email: undefined, // Don't set email for privacy
    });
    
    // Set additional context
    Sentry.setTag('login_method', session.method || 'unknown');
    Sentry.setTag('user_authenticated', 'true');
  } else {
    Sentry.setUser(null);
    Sentry.setTag('user_authenticated', 'false');
  }
};

interface State {
  init: () => void;
  getSession: () => Session | undefined;
  login: (identifier: string, loginMethod: LOGIN_METHOD) => Promise<LoginChallenge>;
  loginChallenge(loginResponse: LoginChallengeUserResponse): Promise<LoginSuccess>;
  // generateNewAccount: () => Promise<void>;
  logout: () => Promise<void>;
  api: RustyShopAPI;
  shops: Shop[];
  loadShops: () => Promise<void>;
  shopId: undefined | string;
  setShopId: (shopId?: string | null) => void;
  getShopId: () => string;
  shopCurrency: () => Currency;
}

const api = new RustyShopAPI({
  baseUrl: API_BASE_URL,
  auth: new RustyAuth({ baseUrl: API_BASE_URL, useLocalStore: true, localStorageKey: LOCAL_STORAGE_KEY }),
  errorHandler: handleApiError,
});

export const useRustyState = create<State>((set, get) => ({
  init: () => {
    const shop = getLsShop();
    if (shop) {
      set({ shopId: shop.id });
    }
    
    // Update Sentry context with current session on init
    const session = get().getSession();
    updateSentryUserContext(session);
  },
  getSession: (): Session | undefined => {
    console.log('state: getSession()');
    if (api.auth) {
      return api.auth.getSession();
    }
    console.warn('No auth instance available to get session');
  },
  login: async (identifier: string, loginMethod: LOGIN_METHOD) => {
    if (!api.auth) {
      throw new Error('No auth');
    }

    api.auth.setSession({
      isLoggedIn: false,
      publicKey: identifier,
      method: loginMethod,
    });

    if (loginMethod === LOGIN_METHOD.NOSTR) {
      return await api.auth.login({
        type: 'NOSTR',
        content: {
          public_key: identifier,
        }
      });
    } else if (loginMethod === LOGIN_METHOD.EMAIL_MAGIC_LINK) {
      return api.auth.login({
        type: 'EmailMagicLink',
        content: {
          email: identifier,
        },
      });
    } else if (loginMethod === LOGIN_METHOD.GOOGLE) {
      return api.auth.login({
        type: 'Google',
        content: {
        },
      });
    }

    throw new Error('Unsupported login method');
  },
  /**
   *
   * @param loginResponse
   * @param method
   *    MANUAL: manual login (supply signature)
   *    NOSTR: login with nostr extentions
   * @param signedResponse
   * @returns
   */
  loginChallenge: async (loginResponse: LoginChallengeUserResponse) => {
    if (!api.auth) {
      throw new Error('No auth');
    }

    if (loginResponse.type === 'EmailMagicLink') {
      const response = await api.auth.loginChallenge({
        type: 'EmailMagicLink',
        content: {
          id: loginResponse.content.id,
          challenge: loginResponse.content.challenge,
        }
      });

      // Update Sentry context after successful login
      const session = get().getSession();
      updateSentryUserContext(session);

      return response;
    } else if (
      loginResponse.type === 'NOSTR'
    ) {
      const response = await api.auth.loginChallenge(loginResponse);

      // Update Sentry context after successful login
      const session = get().getSession();
      updateSentryUserContext(session);

      return response;
    }
    throw new Error('Unsupported challenge response');
  },
  // generateNewAccount: async () => {
  //   const keypair = await loadOrCreateKeypair();
  //   console.log(`Generated new account with public key: ${keypair.publicKey}`);
  //   get().api?.auth?.setSession({
  //     isLoggedIn: false,
  //     publicKey: keypair.publicKey,
  //   });
  //   setLsPrivateKey(keypair.privateKey, LOCAL_STORAGE_KEY);
  //   setLsPublicKey(keypair.publicKey, LOCAL_STORAGE_KEY);
  //   const loginChallenge = await get().login(keypair.publicKey, LOGIN_METHOD.NOSTR);

  //   if (loginChallenge.type === 'NOSTR') {
  //     const { content } = loginChallenge;
  //     // Create the signed nostr event
  //     const event = new NEvent({
  //       pubkey: keypair.publicKey,
  //       kind: NEVENT_KIND.CLIENT_AUTHENTICATION,
  //       tags: [
  //         ['relay', API_BASE_URL],
  //         ['challenge', content.challenge],
  //       ],
  //       content: '',
  //     });

  //     await get().loginChallenge({
  //       type: 'NOSTR',
  //       content: {
  //         id: content.id,
  //         response: event.ToObj(),
  //       },
  //     });

  //     // Update Sentry context after successful account generation and login
  //     const session = get().getSession();
  //     updateSentryUserContext(session);
  //   }
  // },
  logout: async () => {
    if (api.auth) {
      await api.auth.logout();
    } else {
      console.warn('No auth instance available to logout');
    }
    
    // Clear Sentry user context after logout
    updateSentryUserContext(undefined);
  },
  api,
  shops: [],
  loadShops: async () => {
    try {
      const { data } = await api.getShops();
      console.log("Loaded shops", data);
      set({ shops: data });
    } catch (e) {
      console.error("Failed to load shops", e);
    }
  },
  shopId: undefined,
  setShopId: (shopId?: string | null) => {
    if (shopId == null) {
      clearLsShop();
      set({ shopId: undefined });
      return;
    }
    const shop = get().shops.find((shop) => shop.id === shopId);
    if (shop) {
      setLsShop(shop);
    }
    set({ shopId });
  },
  getShopId() {
    const shopId = get().shopId;
    if (!shopId) {
      throw new Error("No shop id");
    }
    return shopId;
  },
  shopCurrency() {
    const shopId = get().getShopId();
    const shop = get().shops.find((shop) => shop.id === shopId);
    if (!shop) {
      console.error(`Default currency: No shop found for id ${shopId}`);
      return Currency.EUR;
    }
    return shop.default_currency;
  },
}));
