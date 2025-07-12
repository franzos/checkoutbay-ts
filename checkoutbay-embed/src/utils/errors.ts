/**
 * Error handling utilities for user-friendly error messages and error categorization
 */

/**
 * Error categories for different types of errors
 */
export const ErrorCategory = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
} as const;

type ErrorCategoryType = typeof ErrorCategory[keyof typeof ErrorCategory];

interface ErrorWithDetails extends Error {
  status?: number;
  isNetworkError?: boolean;
  details?: {
    user_message?: string;
  };
}

interface ErrorDisplay {
  message: string;
  action: string;
  category: ErrorCategoryType;
  isRetryable: boolean;
  originalError: string;
  status: number | null;
  timestamp: string;
}

/**
 * Categorize an error based on its properties
 */
export function categorizeError(error: ErrorWithDetails): ErrorCategoryType {
  if (!error) return ErrorCategory.UNKNOWN;
  
  // Network errors
  if (error.isNetworkError || error.name === 'TypeError' || error.name === 'AbortError') {
    return ErrorCategory.NETWORK;
  }
  
  // HTTP status-based categorization
  if (error.status) {
    if (error.status >= 400 && error.status < 500) {
      return ErrorCategory.CLIENT;
    }
    if (error.status >= 500) {
      return ErrorCategory.SERVER;
    }
  }
  
  // Validation errors (common patterns)
  const message = error.message?.toLowerCase() || '';
  if (message.includes('validation') || 
      message.includes('required') || 
      message.includes('invalid') ||
      message.includes('missing')) {
    return ErrorCategory.VALIDATION;
  }
  
  return ErrorCategory.UNKNOWN;
}

/**
 * Get user-friendly error message based on error category and context
 */
export function getUserFriendlyErrorMessage(error: ErrorWithDetails, context: string = ''): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  const category = categorizeError(error);
  const originalMessage = error.message || 'Unknown error';
  
  // If error already has a user-friendly message, use it
  if (error.details && error.details.user_message) {
    return error.details.user_message;
  }
  
  // Context-specific error messages
  switch (context) {
    case 'checkout':
      return getCheckoutErrorMessage(error, category, originalMessage);
    case 'cart':
      return getCartErrorMessage(error, category, originalMessage);
    case 'products':
      return getProductsErrorMessage(error, category, originalMessage);
    case 'shipping':
      return getShippingErrorMessage(error, category, originalMessage);
    default:
      return getGenericErrorMessage(error, category, originalMessage);
  }
}

/**
 * Get checkout-specific error messages
 */
function getCheckoutErrorMessage(error: ErrorWithDetails, category: ErrorCategoryType, originalMessage: string): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Unable to process your order due to a connection issue. Please check your internet connection and try again.';
    case ErrorCategory.VALIDATION:
      if (originalMessage.includes('email')) {
        return 'Please enter a valid email address.';
      }
      if (originalMessage.includes('address')) {
        return 'Please check your shipping address information.';
      }
      if (originalMessage.includes('country')) {
        return 'Please select a valid shipping country.';
      }
      return 'Please check your order information and try again.';
    case ErrorCategory.CLIENT:
      if (error.status === 400) {
        return 'There\'s an issue with your order information. Please review and try again.';
      }
      if (error.status === 404) {
        return 'This product or shop is no longer available.';
      }
      return 'Unable to process your order. Please review your information and try again.';
    case ErrorCategory.SERVER:
      return 'Our payment system is temporarily unavailable. Please try again in a few minutes.';
    default:
      return 'Unable to complete your order. Please try again or contact support if the problem continues.';
  }
}

/**
 * Get cart-specific error messages
 */
function getCartErrorMessage(error: ErrorWithDetails, category: ErrorCategoryType, originalMessage: string): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Unable to update your cart. Please check your connection and try again.';
    case ErrorCategory.VALIDATION:
      if (originalMessage.includes('quantity')) {
        return 'Invalid quantity. Please select a valid amount.';
      }
      if (originalMessage.includes('stock')) {
        return 'Sorry, this item is no longer in stock.';
      }
      return 'Unable to add item to cart. Please try again.';
    case ErrorCategory.CLIENT:
      if (error.status === 404) {
        return 'This product is no longer available.';
      }
      return 'Unable to update your cart. Please try again.';
    case ErrorCategory.SERVER:
      return 'Cart service is temporarily unavailable. Please try again in a few minutes.';
    default:
      return 'Unable to update your cart. Please try again.';
  }
}

/**
 * Get products-specific error messages
 */
function getProductsErrorMessage(error: ErrorWithDetails, category: ErrorCategoryType, originalMessage: string): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Unable to load products. Please check your connection and refresh the page.';
    case ErrorCategory.CLIENT:
      if (error.status === 404) {
        return 'Shop not found or no products available.';
      }
      return 'Unable to load products. Please try again.';
    case ErrorCategory.SERVER:
      return 'Product catalog is temporarily unavailable. Please try again later.';
    default:
      return 'Unable to load products. Please refresh the page.';
  }
}

/**
 * Get shipping-specific error messages
 */
function getShippingErrorMessage(error: ErrorWithDetails, category: ErrorCategoryType, originalMessage: string): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Unable to load shipping information. Please check your connection.';
    case ErrorCategory.CLIENT:
      if (error.status === 404) {
        return 'No shipping options available for this location.';
      }
      return 'Unable to calculate shipping. Please try again.';
    case ErrorCategory.SERVER:
      return 'Shipping service is temporarily unavailable. Please try again later.';
    default:
      return 'Unable to load shipping options. Please try again.';
  }
}

/**
 * Get generic error messages
 */
function getGenericErrorMessage(error: ErrorWithDetails, category: ErrorCategoryType, originalMessage: string): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Connection problem. Please check your internet connection and try again.';
    case ErrorCategory.VALIDATION:
      return 'Please check your information and try again.';
    case ErrorCategory.CLIENT:
      return 'Request failed. Please try again.';
    case ErrorCategory.SERVER:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: ErrorWithDetails): boolean {
  if (!error) return false;
  
  const category = categorizeError(error);
  
  // Network errors are usually retryable
  if (category === ErrorCategory.NETWORK) {
    return true;
  }
  
  // Some server errors are retryable
  if (category === ErrorCategory.SERVER) {
    return error.status === 500 || error.status === 502 || error.status === 503 || error.status === 504;
  }
  
  // Client errors are generally not retryable
  return false;
}

/**
 * Get suggested action for an error
 */
export function getErrorAction(error: ErrorWithDetails, context: string = ''): string {
  if (!error) return '';
  
  if (isRetryableError(error)) {
    return 'Try again';
  }
  
  const category = categorizeError(error);
  
  switch (category) {
    case ErrorCategory.VALIDATION:
      return 'Check information';
    case ErrorCategory.CLIENT:
      if (error.status === 404) {
        return 'Go back';
      }
      return 'Review and retry';
    case ErrorCategory.SERVER:
      return 'Try again later';
    default:
      return 'Refresh page';
  }
}

/**
 * Create a standardized error display object
 */
export function createErrorDisplay(error: ErrorWithDetails, context: string = ''): ErrorDisplay {
  return {
    message: getUserFriendlyErrorMessage(error, context),
    action: getErrorAction(error, context),
    category: categorizeError(error),
    isRetryable: isRetryableError(error),
    originalError: error.message,
    status: error.status || null,
    timestamp: new Date().toISOString()
  };
}