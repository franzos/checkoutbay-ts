import { useLanguageAwareRouting } from '@gofranz/common-components';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRustyState } from '../../state';
import { AccountLayout } from './Account';
import { PublicNavigation } from './PublicNavigation';

export interface GeneralLayoutProps {
  children: React.ReactNode;
}

export function GeneralLayout({ children }: GeneralLayoutProps) {
  const isLoggedIn = useRustyState((state) => state.api?.auth?.getSession().isLoggedIn || false);
  const location = useLocation();
  const { createLanguageURL } = useLanguageAwareRouting();

  useEffect(() => {
    if (!isLoggedIn && location.pathname.startsWith('/account')) {
      window.location.replace(createLanguageURL("/"));
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn && location.pathname.startsWith('/account')) {
      window.location.replace(createLanguageURL("/"));
    }
  }, [isLoggedIn, location]);

  return (
    <>
      {isLoggedIn ? (
        <AccountLayout isLoggedIn>{children}</AccountLayout>
      ) : (
        <>
          <PublicNavigation />
          {children}
        </>
      )}
    </>
  );
}
