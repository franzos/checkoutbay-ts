import { AxiosError } from "axios";
import { RustyAuthSpec } from "../auth";

export interface ApiProps {
  baseUrl?: string;
  timeout?: number;
  auth?: RustyAuthSpec;
  errorHandler?: (error: AxiosError) => void;
}

export function makeUrl<T extends object>(
  url: string,
  params?: T
): string {
  if (params) {
    const entries = Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]) as [string, string][];
    const search = new URLSearchParams(entries).toString();
    return search ? `${url}?${search}` : url;
  }
  return url;
}