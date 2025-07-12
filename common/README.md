# @gofranz/common

Shared authentication and billing library for https://checkoutbay.com/, https://formshive.com/, and other services by https://gofranz.com/.

## Setup

_Note: "Rusty" is the legacy name (Rusty Forms, Rusty Shops, Rusty Marketing, ...) and will be deprecated soon._

```ts
import axios from 'axios';
import { RustyAuth, RustyDeposit, RustySubscription, RustyReferral, RustyVerifiedEmails } from '@gofranz/common';

// Create auth instance
const auth = new RustyAuth({ 
  baseUrl: 'https://api.formshive.com/v1',
  useLocalStore: true 
});

// Create axios client
const client = axios.create({
  baseURL: 'https://api.formshive.com/v1',
  timeout: 5000
});

// Create service instances with shared client
const deposit = new RustyDeposit({ client });
const subscription = new RustySubscription({ client });
const referral = new RustyReferral({ client });
const emails = new RustyVerifiedEmails({ client });
```

## Features

### Authentication (`src/auth.ts`)
Nostr-based authentication with email/magic link/Google OAuth support. Handles login challenges, token refresh, and session management.

```ts
const auth = new RustyAuth({ baseUrl: 'https://api.checkoutbay.com/v1' });
const challenge = await auth.login({ NOSTR: { public_key: 'npub1...' } });
const success = await auth.loginChallenge({ type: 'NOSTR', content: { signature: '...' } });
```

### Verified Emails (`src/verified-emails.ts`)
Manage verified email addresses for user accounts. Add, verify, and remove email addresses.

```ts
const emails = new RustyVerifiedEmails({ client });
await emails.newVerifiedEmail({ email: 'user@example.com', name: 'Primary' }, accessToken);
const emailList = await emails.getVerifiedEmails(accessToken);
```

### Deposits (`src/deposit.ts`)
Pay-as-you-go billing with account balance tracking. View movements, make deposits via Stripe.

```ts
const deposit = new RustyDeposit({ client });
const balance = await deposit.getAccountBalance(accessToken);
const stripe = await deposit.newDeposit({ amount: 10, currency: 'USD' }, accessToken);
```

### Subscriptions (`src/subscription.ts`)
Monthly subscription plans with usage tracking. Subscribe, cancel, and manage via Stripe customer portal.

```ts
const subscription = new RustySubscription({ client });
const plans = await subscription.getSubscriptionPlans();
const result = await subscription.subscribeToplan('plan_123', accessToken);
```

### Referrals (`src/referral.ts`)
Referral system for user acquisition. Get referral codes, track stats, and view referral history.

```ts
const referral = new RustyReferral({ client });
const code = await referral.getReferralCode(accessToken);
const stats = await referral.getReferralStats(accessToken);
```