import type { AxiosError, AxiosResponse } from "axios";
import { getErrorTitle, CustomAxiosRequestConfig } from "@gofranz/common";
import { showApiErrorNotification, showSuccessNotification } from "./notifications";

export interface NotificationHandlerOptions {
  /**
   * Mantine notifications instance
   */
  notifications: any;

  /**
   * Optional callback for handling errors (e.g., Sentry logging)
   */
  onError?: (error: AxiosError) => void;

  /**
   * Optional callback for handling successful responses
   */
  onSuccess?: (response: AxiosResponse) => void;

  /**
   * URL paths to ignore for success notifications
   */
  ignoredPaths?: string[];
}

/**
 * Creates a standardized error handler for axios interceptors
 */
export function createErrorHandler(options: NotificationHandlerOptions) {
  const { notifications, onError } = options;

  return (error: AxiosError) => {
    // Don't show notifications for aborted requests or network timeouts during development
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      return;
    }

    // Call optional error callback (for Sentry, logging, etc.)
    if (onError) {
      onError(error);
    }

    // Check if custom error notification is provided in the request config
    const config = error.config as CustomAxiosRequestConfig;
    const customNotification = config?.notification;

    if (customNotification && 'onError' in customNotification && customNotification.onError) {
      // Use custom error notification if provided
      showApiErrorNotification(error, notifications, customNotification.onError.title || getErrorTitle(error));
    } else {
      // Use default error notification
      const title = getErrorTitle(error);
      showApiErrorNotification(error, notifications, title);
    }
  };
}

/**
 * Creates a standardized success handler for axios interceptors
 */
export function createSuccessHandler(options: NotificationHandlerOptions) {
  const { notifications, onSuccess, ignoredPaths = [] } = options;

  return (response: AxiosResponse) => {
    const accepted = ['post', 'put', 'patch'];
    if (!accepted.includes(response.config.method || '')) {
      return;
    }

    // Check if this path should be ignored
    if (ignoredPaths.some((path) => response.config.url?.includes(path))) {
      return;
    }

    // Call optional success callback
    if (onSuccess) {
      onSuccess(response);
    }

    // Check if custom notification is provided in the request config
    const config = response.config as CustomAxiosRequestConfig;
    const customNotification = config?.notification;

    if (customNotification) {
      if ('onSuccess' in customNotification) {
        // Structured notification config
        if (customNotification.onSuccess !== false && customNotification.onSuccess) {
          const successNotif = customNotification.onSuccess;
          showSuccessNotification(
            successNotif.title,
            successNotif.message,
            notifications
          );
        }
        // If onSuccess is false, don't show any notification
      } else {
        // Simple notification config (backward compatibility)
        const simpleNotif = customNotification as { title: string; message: string };
        showSuccessNotification(
          simpleNotif.title,
          simpleNotif.message,
          notifications
        );
      }
    } else {
      // Show default notification
      showSuccessNotification(
        `Request Successful`,
        `Your ${response.config.method?.toUpperCase()} request to ${response.config.url} was successful.`,
        notifications
      );
    }
  };
}