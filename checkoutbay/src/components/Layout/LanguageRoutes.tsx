import { Session } from '@gofranz/common';
import {
  LoginCallbackPage,
  LoginPage,
  MagicLinkLoginPage,
  NewsPage,
  PrivacyPage,
  SignupPage,
  SupportPage,
  TermsPage,
} from '@gofranz/common-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { AccountHomePage } from '../../pages/Account/Home.page';
import { AccountIntegrationPage } from '../../pages/Account/Integration.page';
import { AccountProfilePage } from '../../pages/Account/Profile.page';
import { DocsPage } from '../../pages/Docs.page';
import { HomePage } from '../../pages/Home.page';
import { PricingPage } from '../../pages/Pricing.page';
import { useRustyState } from '../../state';
import classes from '../Common/Title.module.css';
import {
  AccountAddressCreatePage,
  AccountDiscountCreatePage,
  AccountPaymentMethodCreatePage,
  AccountProductCreatePage,
  AccountShippingRateTemplateCreatePage,
  AccountStockMovementCreatePage,
  AccountWarehouseCreatePage,
} from '../CreatePageAll';
import {
  AccountAddressStartPage,
  AccountDiscountStartPage,
  AccountOrderStartPage,
  AccountPaymentMethodStartPage,
  AccountProductStartPage,
  AccountStockMovementStartPage,
  AccountWarehouseStartPage,
  ShippingRateTemplateStartPage,
} from '../StartPageAll';
import {
  AccountAddressViewPage,
  AccountDiscountViewPage,
  AccountOrderViewPage,
  AccountPaymentMethodViewPage,
  AccountProductViewPage,
  AccountShippingRateTemplateViewPage,
  AccountStockMovementViewPage,
  AccountWarehouseViewPage,
  ShopViewPage,
} from '../ViewPageAll';
import { Footer } from './Footer';

interface LanguageRoutesProps {
  languagePrefix?: string;
}

export function LanguageRoutes({ languagePrefix }: LanguageRoutesProps) {
  const { i18n } = useTranslation();
  
  // Update language when language prefix changes
  React.useEffect(() => {
    if (languagePrefix && languagePrefix !== i18n.language) {
      i18n.changeLanguage(languagePrefix);
    } else if (!languagePrefix && i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [languagePrefix, i18n]);

  const setSession = (session: Session) => {
    useRustyState.getState().api.auth?.setSession(session);
  }

  // For nested routes, React Router automatically strips the parent path
  // So when we match `/pt/*`, the nested routes should start from `/`
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <LoginPage
            login={async (loginRequest) => {
              const state = useRustyState.getState();
              if (loginRequest.type === 'NOSTR') {
                return await state.api.auth!.login(loginRequest);
              } else if (loginRequest.type === 'EmailMagicLink') {
                return await state.api.auth!.login(loginRequest);
              } else if (loginRequest.type === 'Google') {
                return await state.api.auth!.login(loginRequest);
              }
              throw new Error('Unsupported login method');
            }}
            loginChallenge={useRustyState.getState().loginChallenge}
            titleClassName={classes.title}
          />
        }
      />
      <Route
        path="/login/callback"
        element={
          <LoginCallbackPage
            setSession={setSession}
            titleClassName={classes.title}
          />
        }
      />
      <Route
        path="/login/magic-link"
        element={
          <MagicLinkLoginPage
            loginChallenge={useRustyState.getState().loginChallenge}
            titleClassName={classes.title}
          />
        }
      />
      <Route path="/privacy" element={<PrivacyPage supportEmail="support@checkoutbay.com" footer={<Footer />} />} />
      <Route path="/terms" element={<TermsPage supportEmail="support@checkoutbay.com" footer={<Footer />} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/news" element={<NewsPage blogBaseUrl="https://blog.checkoutbay.com" footer={<Footer />} />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/account" element={<AccountHomePage />} />
      <Route path="/account/integration" element={<AccountIntegrationPage />} />
      <Route path="/account/products" element={<AccountProductStartPage />} />
      <Route path="/account/products/create" element={<AccountProductCreatePage />} />
      <Route path="/account/products/:uuid" element={<AccountProductViewPage />} />
      <Route path="/account/warehouses" element={<AccountWarehouseStartPage />} />
      <Route path="/account/warehouses/create" element={<AccountWarehouseCreatePage />} />
      <Route path="/account/warehouses/:uuid" element={<AccountWarehouseViewPage />} />
      <Route path="/account/addresses" element={<AccountAddressStartPage />} />
      <Route path="/account/addresses/create" element={<AccountAddressCreatePage />} />
      <Route path="/account/addresses/:uuid" element={<AccountAddressViewPage />} />
      <Route path="/account/stock-movements" element={<AccountStockMovementStartPage />} />
      <Route path="/account/stock-movements/create" element={<AccountStockMovementCreatePage />} />
      <Route path="/account/stock-movements/:uuid" element={<AccountStockMovementViewPage />} />
      <Route path="/account/payment-gateways" element={<AccountPaymentMethodStartPage />} />
      <Route
        path="/account/payment-gateways/create"
        element={<AccountPaymentMethodCreatePage />}
      />
      <Route path="/account/payment-gateways/:uuid" element={<AccountPaymentMethodViewPage />} />
      <Route path="/account/shipping-rate-templates" element={<ShippingRateTemplateStartPage />} />
      <Route
        path="/account/shipping-rate-templates/create"
        element={<AccountShippingRateTemplateCreatePage />}
      />
      <Route
        path="/account/shipping-rate-templates/:uuid"
        element={<AccountShippingRateTemplateViewPage />}
      />
      <Route path="/account/orders" element={<AccountOrderStartPage />} />
      <Route path="/account/orders/:uuid" element={<AccountOrderViewPage />} />
      <Route path="/account/discounts" element={<AccountDiscountStartPage />} />
      <Route path="/account/discounts/create" element={<AccountDiscountCreatePage />} />
      <Route path="/account/discounts/:uuid" element={<AccountDiscountViewPage />} />
      <Route
        path="/account/profile"
        element={
          <AccountProfilePage
            serviceDomain="checkoutbay.com"
            serviceEmail="hello@checkoutbay.com"
          />
        }
      />
      <Route path="/account/shop" element={<ShopViewPage />} />
      <Route
        path="/account/support"
        element={<SupportPage session={useRustyState.getState().api?.auth?.getSession()} />}
      />
    </Routes>
  );
}