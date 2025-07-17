import { decodeSessionTokens } from '../auth';
import { LOCAL_STORAGE_KEY } from '../constants';
import { Session } from '../types';

export function getLsPrivateKey(storageKey: string = LOCAL_STORAGE_KEY) {
  console.debug('getLsPrivateKey');
  return localStorage.getItem(`${storageKey}.privateKey`);
}

export function setLsPrivateKey(privateKey: string, storageKey: string = LOCAL_STORAGE_KEY) {
  console.debug('setLsPrivateKey');
  localStorage.setItem(`${storageKey}.privateKey`, privateKey);
}

export function getLsPublicKey(storageKey: string = LOCAL_STORAGE_KEY) {
  console.debug('getLsPublicKey');
  return localStorage.getItem(`${storageKey}.publicKey`);
}

export function setLsPublicKey(publicKey: string, storageKey: string = LOCAL_STORAGE_KEY) {
  console.debug('setLsPublicKey');
  localStorage.setItem(`${storageKey}.publicKey`, publicKey);
}

export function hasFutureExpiry(expiresAt: number, threshold: number) {
  const now = Math.round(Date.now() / 1000);
  return expiresAt > (now + threshold)
}

export function getLsSession(storageKey: string = LOCAL_STORAGE_KEY): Session | null {
  console.debug('getLsSession');
  const sessionJson = localStorage.getItem(`${storageKey}.data`);
  if (sessionJson) {
    let session = JSON.parse(sessionJson);
    if (session.accessTokenExpiresAt && typeof session.accessTokenExpiresAt === 'string') {
      // Convert accessTokenExpiresAt to number if it's a string
      session.accessTokenExpiresAt = parseInt(session.accessTokenExpiresAt, 10);
    }
    if (session.refreshTokenExpiresAt && typeof session.refreshTokenExpiresAt === 'string') {
      // Convert refreshTokenExpiresAt to number if it's a string
      session.refreshTokenExpiresAt = parseInt(session.refreshTokenExpiresAt, 10);
    }
    if (session.expiresAt && typeof session.expiresAt === 'string') {
      // Convert expiresAt to number if it's a string
      session.expiresAt = parseInt(session.expiresAt, 10);
    }

    // Validate fields, and if necessary, try to re-extract them
    if (!session.accessTokenExpiresAt || !session.refreshTokenExpiresAt || !session.expiresAt) {
      console.warn('Session data is incomplete, clearing local storage');
      if (session.accessToken && session.refreshToken) {
        try {
          const decoded = decodeSessionTokens({
            access_token: session.accessToken,
            refresh_token: session.refreshToken,
          })
          session.accessTokenExpiresAt = decoded.accessTokenExpiresAt
          session.refreshTokenExpiresAt = decoded.refreshTokenExpiresAt

          // Save the updated session back to localStorage
          setLsSession(session);
        } catch (error) {
          console.error('Failed to decode session tokens:', error);
          clearLsSession();
          return null;
        }
      } else {
        console.error('Session tokens are missing, clearing local storage');
        clearLsSession();
        return null;
      }
    }

    if (!session.isLoggedIn || !hasFutureExpiry(session.expiresAt, 300)) {
      console.warn('Session is not valid, clearing local storage');
      clearLsSession();
      return null;
    }

    return session as Session;
  }
  return null;
}

export function setLsSession(session: Session, storageKey: string = LOCAL_STORAGE_KEY) {
  console.debug('setLsSession', session);
  localStorage.setItem(`${storageKey}.data`, JSON.stringify(session));
}

export function clearLsSession(storageKey: string = LOCAL_STORAGE_KEY) {
  console.debug('clearLsSession');
  localStorage.removeItem(`${storageKey}.data`);
}