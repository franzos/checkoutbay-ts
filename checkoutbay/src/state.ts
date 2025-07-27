import {
  CheckoutbayApi,
  clearLsShop,
  getLsShop,
  setLsShop,
  Shop,
} from "@gofranz/checkoutbay-common";
import {
  Currency,
  getErrorTitle,
  LOGIN_METHOD,
  LoginChallengeUserResponse,
  RustyAuth,
  Session,
  StateBase,
} from "@gofranz/common";
import { showApiErrorNotification, showSuccessNotification } from "@gofranz/common-components";
import { notifications } from "@mantine/notifications";
import * as Sentry from '@sentry/react';
import type { AxiosError, AxiosResponse } from "axios";
import { create } from "zustand";
import { API_BASE_URL, LOCAL_STORAGE_KEY } from "./constants";

const errorHandler = (error: AxiosError) => {
  // Don't show notifications for aborted requests or network timeouts during development
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return;
  }

  Sentry.captureException(error, {
    extra: {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    },
  });

  const title = getErrorTitle(error);
  showApiErrorNotification(error, notifications, title);
};

const successHandler = (response: AxiosResponse) => {
  const accepted = ['post', 'put', 'patch']
  if (!accepted.includes(response.config.method || '')) {
    return;
  }

  const ignored = ['/stock-movements/by-products']
  if (ignored.some((path) => response.config.url?.includes(path))) {
    return;
  }

  showSuccessNotification(
    `Request Successful`,
    `Your ${response.config.method?.toUpperCase()} request to ${response.config.url} was successful.`,
    notifications
  );
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

interface State extends StateBase<CheckoutbayApi> {
  shops: Shop[];
  loadShops: () => Promise<void>;
  shopId: undefined | string;
  setShopId: (shopId?: string | null) => void;
  getShopId: () => string;
  shopCurrency: () => Currency;
}

const api = new CheckoutbayApi({
  baseUrl: API_BASE_URL,
  auth: new RustyAuth({ baseUrl: API_BASE_URL, useLocalStore: true, localStorageKey: LOCAL_STORAGE_KEY }),
  errorHandler,
  successHandler,
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
    if (api.auth) {
      return api.auth.getSession();
    }
    console.warn('No auth instance available to get session');
  },
  login: async (identifier: string, loginMethod: LOGIN_METHOD) => {
    if (!api.auth) {
      throw new Error('No auth');
    }

    switch (loginMethod) {
      case LOGIN_METHOD.NOSTR:
    // Nostr login uses the public key as the identifier
      return await api.auth.login({
        type: LOGIN_METHOD.NOSTR,
        content: {
          public_key: identifier,
        },
      });
      case LOGIN_METHOD.EMAIL_MAGIC_LINK:
        // Use the identifier as the email for magic link login
        return await api.auth.login({
          type: LOGIN_METHOD.EMAIL_MAGIC_LINK,
          content: {
          email: identifier,
        },
      });
      case LOGIN_METHOD.GOOGLE:
        return await api.auth.login({
          type: LOGIN_METHOD.GOOGLE,
          content: {},
      });
      case LOGIN_METHOD.GITHUB:
        return await api.auth.login({
          type: LOGIN_METHOD.GITHUB,
          content: {},
        });
      default:
        throw new Error(`Unsupported login method: ${loginMethod}`);
    }
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

    if (loginResponse.type === LOGIN_METHOD.EMAIL_MAGIC_LINK) {
      const response = await api.auth.loginChallenge({
        type: LOGIN_METHOD.EMAIL_MAGIC_LINK,
        content: {
          id: loginResponse.content.id,
          challenge: loginResponse.content.challenge,
        }
      });

      // Update Sentry context after successful login
      updateSentryUserContext(get().getSession());

      return response;
    } else if (
      loginResponse.type === LOGIN_METHOD.NOSTR
    ) {
      const response = await api.auth.loginChallenge(loginResponse);

      // Update Sentry context after successful login
      updateSentryUserContext(get().getSession());

      return response;
    }
    throw new Error('Unsupported challenge response');
  },
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
  verifiedEmails: [],
  shops: [],
  loadShops: async () => {
    try {
      const { data } = await api.getShops();
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
