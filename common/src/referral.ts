import { AxiosInstance } from "axios";
import {
  ListResponse,
  ReferralCodeResponse,
  ReferralHistoryItem,
  ReferralStatsResponse,
} from "./types";
import { makeAuthHeaders } from "./index";

export interface RustyReferralApiProps {
  client: AxiosInstance;
}

export interface RustyReferralSpec {
  getReferralCode(accessToken: string): Promise<ReferralCodeResponse>;
  getReferralStats(accessToken: string): Promise<ReferralStatsResponse>;
  getReferralHistory(accessToken: string): Promise<ListResponse<ReferralHistoryItem>>;
}

export class RustyReferral implements RustyReferralSpec {
  private client: AxiosInstance;

  constructor({ client }: RustyReferralApiProps) {
    this.client = client;
  }

  async getReferralCode(accessToken: string): Promise<ReferralCodeResponse> {
    const result = await this.client.get<ReferralCodeResponse>(
      "/a/referrals/code",
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async getReferralStats(accessToken: string): Promise<ReferralStatsResponse> {
    const result = await this.client.get<ReferralStatsResponse>(
      "/a/referrals/stats",
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async getReferralHistory(accessToken: string): Promise<ListResponse<ReferralHistoryItem>> {
    const result = await this.client.get(
      "/a/referrals/history",
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }
}