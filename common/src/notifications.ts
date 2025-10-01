import type { InternalAxiosRequestConfig } from "axios";

/**
 * Custom notification configuration for API requests
 */
export interface NotificationConfig {
  onSuccess?: false | {
    title: string;
    message: string;
  };
  onError?: {
    title?: string;
    message?: string;
  };
}

/**
 * Extend AxiosRequestConfig to include our custom notification field
 */
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  notification?: NotificationConfig | {
    title: string;
    message: string;
  };
}