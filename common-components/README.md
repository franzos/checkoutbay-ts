# @gofranz/common-components

Shared React components and translations for https://checkoutbay.com/, https://formshive.com/, and other services by https://gofranz.com/.

## Features

- Common React components with Mantine UI
- Authentication flows (login, register, verify)
- Account management pages
- Multi-language support (i18n)
- Custom hooks for authentication and state

## Installation

```bash
pnpm add @gofranz/common-components
```

## Key Exports

### Components
- `LoadingIndicator` - Full-page loading spinner
- `TitlePage` - Page with configurable title
- `EmailBadge` - Email verification status badge
- `AccountMovementRow` - Transaction display component
- `BalanceIndicator` - Account balance display
- `FilesList` - File attachment viewer

### Pages
- `LoginPage` - Complete login flow with Nostr/email/Google
- `RegisterPage` - User registration
- `VerifyPage` - Email verification
- `AccountPage` - User account management
- `VerifiedEmailsPage` - Email address management
- `SubscriptionPage` - Subscription management
- `ReferralPage` - Referral program interface

### Hooks
- `useAuth` - Authentication state and methods
- `useBalance` - Account balance management
- `useSubscription` - Subscription state

### i18n
- `initCommonI18n()` - Initialize translations
- `commonI18nOptions` - Base i18n configuration
- Supported languages: en, es, de, fr, it, ja, zh, ar

## Usage

```tsx
import { initCommonI18n, LoginPage, useAuth } from '@gofranz/common-components';
import { initReactI18next } from 'react-i18next';

// Initialize i18n
i18n.use(initReactI18next).init({
  ...initCommonI18n(),
  // Add app-specific translations
});

// Use components
function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}
```

## Peer Dependencies

- React 18+
- Mantine 7+
- react-i18next
- @gofranz/common