import { AxiosInstance } from "axios";
import { CustomerPortalResponse, NewSubscriptionResponse, SubscriptionPlanConfig, SubscriptionResponse, UsageResponse } from "./types";
import { makeAuthHeaders } from "./index";

export interface RustySubscriptionApiProps {
  client: AxiosInstance;
}

export interface RustySubscriptionSpec {
  getSubscriptionPlans(): Promise<SubscriptionPlanConfig[]>;
  getCurrentSubscription(accessToken: string): Promise<SubscriptionResponse | null>;
  subscribeToplan(planId: string, accessToken: string): Promise<NewSubscriptionResponse>;
  cancelSubscription(accessToken: string): Promise<any>;
  getSubscriptionUsage(accessToken: string): Promise<UsageResponse>;
  createCustomerPortalSession(accessToken: string): Promise<CustomerPortalResponse>;
}

export class RustySubscription implements RustySubscriptionSpec {
  private client: AxiosInstance;

  constructor({ client }: RustySubscriptionApiProps) {
    this.client = client;
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlanConfig[]> {
    const result = await this.client.get<SubscriptionPlanConfig[]>(
      "/subscriptions/plans"
    );
    return result.data;
  }

  async getCurrentSubscription(
    accessToken: string
  ): Promise<SubscriptionResponse | null> {
    try {
      const result = await this.client.get<SubscriptionResponse>(
        "/a/subscriptions/current",
        { headers: makeAuthHeaders(accessToken) }
      );
      return result.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No active subscription
      }
      throw error;
    }
  }

  async subscribeToplan(
    planId: string,
    accessToken: string
  ): Promise<NewSubscriptionResponse> {
    const result = await this.client.post(
      `/a/subscriptions/${planId}`,
      {},
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async cancelSubscription(accessToken: string): Promise<any> {
    const result = await this.client.delete(
      "/a/subscriptions",
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async getSubscriptionUsage(accessToken: string): Promise<UsageResponse> {
    const result = await this.client.get<UsageResponse>(
      "/a/subscriptions/usage",
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async createCustomerPortalSession(accessToken: string): Promise<CustomerPortalResponse> {
    const result = await this.client.post<CustomerPortalResponse>(
      "/a/subscriptions/portal",
      {},
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }
}