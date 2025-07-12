/**
 * API Error Response format
 */
export interface ApiErrorResponse {
  error: string;
  action: string | null;
  message: string;
}

/**
 * Parsed error result
 */
export interface ParsedApiError {
  title: string;
  message: string;
  error?: string;
  action?: string | null;
}

/**
 * Parse API error from various formats:
 * - Legacy: string error message
 * - New: JSON with {error, action, message} format
 * - Axios error with response.data
 * - Generic Error object
 */
export function parseApiError(error: any): ParsedApiError {
  // Handle null/undefined
  if (!error) {
    return {
      title: 'Unknown Error',
      message: 'An unknown error occurred. Please try again.',
    };
  }

  // Handle string errors (legacy format)
  if (typeof error === 'string') {
    return {
      title: 'Error',
      message: error,
    };
  }

  // Handle Axios errors with response.data
  if (error.response?.data) {
    return parseApiErrorData(error.response.data);
  }

  // Handle direct API error response objects
  if (error.error && error.message) {
    return parseApiErrorData(error);
  }

  // Handle standard Error objects
  if (error.message) {
    return {
      title: 'Error',
      message: error.message,
    };
  }

  // Fallback for any other format
  return {
    title: 'Error',
    message: 'An unexpected error occurred. Please try again.',
  };
}

/**
 * Parse the API error response data object
 */
function parseApiErrorData(data: any): ParsedApiError {
  if (typeof data === 'string') {
    return {
      title: 'Error',
      message: data,
    };
  }

  if (data.error && data.message) {
    // New JSON format: {error, action, message}
    return {
      title: getErrorTitle(data.error),
      message: data.message,
      error: data.error,
      action: data.action,
    };
  }

  // Try to extract any message-like property
  const message = data.message || data.error || data.detail || 'An error occurred';
  
  return {
    title: 'Error',
    message: typeof message === 'string' ? message : 'An error occurred',
  };
}

/**
 * Convert error code to user-friendly title
 */
function getErrorTitle(errorCode: string): string {
  const errorTitles: Record<string, string> = {
    'validation_error': 'Validation Error',
    'authentication_error': 'Authentication Error',
    'authorization_error': 'Permission Denied',
    'subscription_error': 'Subscription Error',
    'payment_error': 'Payment Error',
    'rate_limit_error': 'Rate Limit Exceeded',
    'server_error': 'Server Error',
    'not_found': 'Not Found',
    'conflict': 'Conflict',
    'bad_request': 'Bad Request',
  };

  return errorTitles[errorCode] || 'Error';
}

/**
 * Show error notification using Mantine notifications
 * Requires @mantine/notifications to be imported where used
 */
export function showApiErrorNotification(error: any, notifications: any, defaultTitle = 'Error') {
  const parsed = parseApiError(error);
  
  notifications.show({
    title: parsed.title || defaultTitle,
    message: parsed.message,
    color: 'red',
    autoClose: 8000, // 8 seconds for errors - longer so users can read them
    withCloseButton: true,
    position: 'top-center',
    radius: 'xs',
  });
}

/**
 * Show success notification with enhanced prominence
 */
export function showSuccessNotification(title: string, message: string, notifications: any) {
  notifications.show({
    title,
    message,
    color: 'green',
    autoClose: 5000, // 5 seconds for success messages
    withCloseButton: true,
    withBorder: true,
    radius: 'md',
    style: {
      borderLeftWidth: '4px',
      borderLeftColor: 'var(--mantine-color-green-6)',
    },
  });
}

/**
 * Show info notification with enhanced prominence
 */
export function showInfoNotification(title: string, message: string, notifications: any) {
  notifications.show({
    title,
    message,
    color: 'blue',
    autoClose: 6000, // 6 seconds for info messages
    withCloseButton: true,
    withBorder: true,
    radius: 'md',
    style: {
      borderLeftWidth: '4px',
      borderLeftColor: 'var(--mantine-color-blue-6)',
    },
  });
}

/**
 * Show warning notification with enhanced prominence
 */
export function showWarningNotification(title: string, message: string, notifications: any) {
  notifications.show({
    title,
    message,
    color: 'orange',
    autoClose: 7000, // 7 seconds for warnings - longer so users notice them
    withCloseButton: true,
    withBorder: true,
    radius: 'md',
    style: {
      borderLeftWidth: '4px',
      borderLeftColor: 'var(--mantine-color-orange-6)',
    },
  });
}