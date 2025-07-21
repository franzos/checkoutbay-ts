import { LOGIN_METHOD } from "./login";
import { LoginChallenge, LoginChallengeUserResponse, LoginSuccess, VerifiedEmail, SubscriptionPlanConfig, SubscriptionResponse, UsageResponse, ReferralCodeResponse, ReferralStatsResponse, NewSubscriptionResponse, CustomerPortalResponse, CommonQueryParams, AccountMovementsResponse, ReferralHistoryResponse } from "./rusty-common/generated";
import { Session } from "./session";

export interface StateBase<API> {
  init: () => void;
  getSession: () => Session | undefined;
  login: (identifier: string, loginMethod: LOGIN_METHOD) => Promise<LoginChallenge>;
  loginChallenge(loginResponse: LoginChallengeUserResponse): Promise<LoginSuccess>;
  logout: () => Promise<void>;
  api: API;
  verifiedEmails: VerifiedEmail[];
}

export interface StateBaseWithSubscription<API> extends StateBase<API> {
  // Subscription state
  subscriptionPlans: SubscriptionPlanConfig[] | null;
  currentSubscription: SubscriptionResponse | null;
  subscriptionUsage: UsageResponse | null;

  // Referral state
  referralCode: ReferralCodeResponse | null;
  referralStats: ReferralStatsResponse | null;

  // Subscription methods
  getAndSetSubscriptionPlans: () => Promise<SubscriptionPlanConfig[]>;
  getAndSetCurrentSubscription: () => Promise<SubscriptionResponse | null>;
  getAndSetSubscriptionUsage: () => Promise<UsageResponse | null>;
  subscribeToplan: (planId: string) => Promise<NewSubscriptionResponse | undefined>;
  cancelSubscription: () => Promise<any>;
  createCustomerPortalSession: () => Promise<CustomerPortalResponse>;

  // Account methods
  getAccountMovements: (query?: CommonQueryParams) => Promise<AccountMovementsResponse>;

  // Referral methods
  getAndSetReferralCode: () => Promise<ReferralCodeResponse>;
  getAndSetReferralStats: () => Promise<ReferralStatsResponse>;
  getReferralHistory: () => Promise<ReferralHistoryResponse>;
}