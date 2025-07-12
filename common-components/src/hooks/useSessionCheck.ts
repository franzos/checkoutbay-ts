import { useEffect, useRef } from 'react';
import { useLanguageAwareRouting } from './useLanguageAwareRouting';

interface UseSessionCheckProps {
  auth: any; // RustyAuth instance
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  checkInterval?: number; // milliseconds, default 10000 (10 seconds)
}

export function useSessionCheck({ 
  auth, 
  isLoggedIn, 
  logout, 
  checkInterval = 10000 
}: UseSessionCheckProps) {
  const { createLanguageURL } = useLanguageAwareRouting();
  const consecutiveFailures = useRef(0);
  const maxConsecutiveFailures = 3;
  const isCheckingRef = useRef(false);

  const checkSession = async () => {
    if (!isLoggedIn || isCheckingRef.current) {
      return;
    }

    // Prevent concurrent session checks
    isCheckingRef.current = true;

    try {
      console.debug('Checking session...');

      // First check if the refresh token is still valid
      if (!auth?.hasValidSession()) {
        console.warn('Refresh token expired. Logging out.');
        consecutiveFailures.current = 0; // Reset counter
        await logout();
        window.location.replace(createLanguageURL('/'));
        return;
      }

      // Check if access token needs refresh
      if (!auth?.hasValidAccessToken()) {
        // If we've had too many consecutive failures, don't attempt refresh
        if (consecutiveFailures.current >= maxConsecutiveFailures) {
          console.warn(`Too many consecutive refresh failures (${consecutiveFailures.current}), logging out`);
          await logout();
          window.location.replace(createLanguageURL('/'));
          return;
        }

        console.info('Access token expired. Refreshing...');
        try {
          await auth?.refresh();
          consecutiveFailures.current = 0; // Reset on successful refresh
          console.debug('Token refresh successful');
        } catch (error: any) {
          consecutiveFailures.current++;
          console.warn(`Token refresh failed (attempt ${consecutiveFailures.current}/${maxConsecutiveFailures}):`, error);
          
          // If this was an authentication error or we've exceeded max attempts, logout immediately
          if (error.message?.includes('Authentication failed') || 
              error.message?.includes('Maximum refresh attempts exceeded') ||
              consecutiveFailures.current >= maxConsecutiveFailures) {
            console.warn('Session invalidated, logging out');
            await logout();
            window.location.replace(createLanguageURL('/'));
          }
          // Otherwise, we'll try again on the next interval
        }
      } else {
        // Access token is valid, reset failure counter
        consecutiveFailures.current = 0;
      }
    } finally {
      isCheckingRef.current = false;
    }
  };

  useEffect(() => {
    // Initial session check
    checkSession();

    // Set up periodic session checks
    const intervalId = setInterval(checkSession, checkInterval);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [isLoggedIn, checkInterval]);

  // Return the checkSession function in case components need to trigger manual checks
  return { checkSession };
}