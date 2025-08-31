import { AxiosInstance } from "axios";
import {
  Balance,
  CommonQueryParams,
  ListResponse,
  Deposits,
  AccountMovement,
  NewDepositHttp,
  NewDepositResponse
} from "./types";
import { makeAuthHeaders } from "./index";

export interface RustyDepositApiProps {
  client: AxiosInstance;
}

export interface RustyDepositSpec {
  getAccountBalance(
    accessToken: string
  ): Promise<Balance[]>;
  getAccountMovements(
    query: CommonQueryParams,
    accessToken: string
  ): Promise<ListResponse<AccountMovement>>;
  getDeposits(
    query: CommonQueryParams,
    accessToken: string
  ): Promise<ListResponse<Deposits>>;
  getDeposit(
    id: string,
    accessToken: string
  ): Promise<Deposits>;
  newDeposit(
    deposit: NewDepositHttp,
    accessToken: string
  ): Promise<NewDepositResponse>;
}

export class RustyDeposit implements RustyDepositSpec {
  private client: AxiosInstance;

  constructor({ client }: RustyDepositApiProps) {
    this.client = client;
  }

  async getAccountMovements(
    query: CommonQueryParams,
    accessToken: string
  ): Promise<ListResponse<AccountMovement>> {
    let url = `/a/movements`;
    if (query) {
      url += `?${new URLSearchParams(query as Record<string, string>)}`;
    }
    const result = await this.client.get<
      ListResponse<AccountMovement>
    >(url, { headers: makeAuthHeaders(accessToken) });
    return result.data;
  }

  async getAccountBalance(
    accessToken: string
  ): Promise<Balance[]> {
    // return Get(this.makeUrl('/a/balance'), accessToken);
    const result = await this.client.get<Balance[]>(
      "/a/balance",
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async getDeposits(
    query: CommonQueryParams,
    accessToken: string
  ): Promise<ListResponse<Deposits>> {
    let url = `/a/deposits`;
    if (query) {
      url += `?${new URLSearchParams(query as Record<string, string>)}`;
    }
    const result = await this.client.get<
      ListResponse<Deposits>
    >(url, { headers: makeAuthHeaders(accessToken) });
    return result.data;
  }

  async getDeposit(
    id: string,
    accessToken: string
  ): Promise<Deposits> {
    const result = await this.client.get<Deposits>(
      `/a/deposits/${id}`,
      { headers: makeAuthHeaders(accessToken) }
    );
    return result.data;
  }

  async newDeposit(
    deposit: NewDepositHttp,
    accessToken: string
  ): Promise<NewDepositResponse> {
    const result = await this.client.post<
      NewDepositResponse
    >("/a/deposits", deposit, { headers: makeAuthHeaders(accessToken) });
    
    return result.data;
  }
}
