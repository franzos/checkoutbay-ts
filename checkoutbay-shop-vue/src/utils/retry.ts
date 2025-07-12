/**
 * Retry utilities for failed API calls
 */

export interface RetryOptions {
  maxAttempts?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
}

/**
 * Executes a function with exponential backoff retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2
  } = options

  let lastError: Error
  let delay = initialDelay

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Don't retry on certain errors
      if (shouldNotRetry(lastError)) {
        throw lastError
      }

      // If this was the last attempt, throw the error
      if (attempt === maxAttempts) {
        throw lastError
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
      delay = Math.min(delay * backoffFactor, maxDelay)
    }
  }

  throw lastError!
}

/**
 * Determines if an error should not be retried
 */
function shouldNotRetry(error: Error): boolean {
  const message = error.message.toLowerCase()
  
  // Don't retry client errors (4xx)
  if (message.includes('400') || message.includes('401') || 
      message.includes('403') || message.includes('404') ||
      message.includes('validation') || message.includes('unauthorized')) {
    return true
  }
  
  return false
}

/**
 * Creates a retry function with pre-configured options
 */
export function createRetryFunction(options: RetryOptions = {}) {
  return <T>(fn: () => Promise<T>) => withRetry(fn, options)
}