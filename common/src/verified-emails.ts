import { AxiosInstance } from "axios";
import { HttpNewVerifiedEmail, ListResponse, VerifiedEmail } from "./types";

export interface RustyVerifiedEmailsApiProps {
  client: AxiosInstance;
}

export interface RustyVerifiedEmailsSpec {
    newVerifiedEmail(data: HttpNewVerifiedEmail, accessToken: string): Promise<void>;
    verifyVerifiedEmail(id: string, accessToken: string): Promise<void>;
    deleteVerifiedEmail(id: string, accessToken: string): Promise<void>;
  getVerifiedEmails(accessToken: string): Promise<ListResponse<VerifiedEmail>>;
}

export class RustyVerifiedEmails implements RustyVerifiedEmailsSpec {
  private client: AxiosInstance;

  constructor({ client }: RustyVerifiedEmailsApiProps) {
    this.client = client;
  }

    async newVerifiedEmail(data: HttpNewVerifiedEmail, accessToken: string): Promise<void> {
        await this.client.post(
        '/a/emails/verify',
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    }

    async verifyVerifiedEmail(id: string, accessToken: string): Promise<void> {
        await this.client.post(
        '/a/emails/verify/retry',
        { verified_email_id: id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    }

    async deleteVerifiedEmail(id: string, accessToken: string): Promise<void> {
        await this.client.delete(
        `/a/emails/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    }

  async getVerifiedEmails(accessToken: string): Promise<ListResponse<VerifiedEmail>> {
    const response = await this.client.get<ListResponse<VerifiedEmail>>(
        '/a/emails',
        { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response.data;
    }
}