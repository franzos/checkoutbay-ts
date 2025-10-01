import { AxiosInstance } from "axios";
import {
  ApiKeyCreateRequest,
  ApiKeyResponse,
  ApiKeyUpdateRequest,
  ApiKeyUsageResponse,
} from "./types";
import { makeAuthHeaders } from "./index";

export interface RustyApiKeysProps {
  client: AxiosInstance;
}

export interface RustyApiKeysSpec {
  createApiKey(
    request: ApiKeyCreateRequest,
    accessToken: string
  ): Promise<ApiKeyResponse>;
  listApiKeys(accessToken: string): Promise<ApiKeyResponse[]>;
  updateApiKey(
    id: string,
    request: ApiKeyUpdateRequest,
    accessToken: string
  ): Promise<{ success: boolean }>;
  deleteApiKey(
    id: string,
    accessToken: string
  ): Promise<{ success: boolean }>;
  getApiKeyUsage(
    id: string,
    accessToken: string
  ): Promise<ApiKeyUsageResponse>;
}

export class RustyApiKeys implements RustyApiKeysSpec {
  private client: AxiosInstance;

  constructor({ client }: RustyApiKeysProps) {
    this.client = client;
  }

  async createApiKey(
    request: ApiKeyCreateRequest,
    accessToken: string
  ): Promise<ApiKeyResponse> {
    const result = await this.client.post<ApiKeyResponse>(
      "/a/api-keys",
      request,
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async listApiKeys(accessToken: string): Promise<ApiKeyResponse[]> {
    const result = await this.client.get<ApiKeyResponse[]>(
      "/a/api-keys",
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async updateApiKey(
    id: string,
    request: ApiKeyUpdateRequest,
    accessToken: string
  ): Promise<{ success: boolean }> {
    const result = await this.client.put<{ success: boolean }>(
      `/a/api-keys/${id}`,
      request,
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async deleteApiKey(
    id: string,
    accessToken: string
  ): Promise<{ success: boolean }> {
    const result = await this.client.delete<{ success: boolean }>(
      `/a/api-keys/${id}`,
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async getApiKeyUsage(
    id: string,
    accessToken: string
  ): Promise<ApiKeyUsageResponse> {
    const result = await this.client.get<ApiKeyUsageResponse>(
      `/a/api-keys/${id}/usage`,
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }
}