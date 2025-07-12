/**
 * Email validation utilities
 */

// Basic email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// More comprehensive email regex pattern
const EMAIL_REGEX_COMPREHENSIVE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/**
 * Validates email format using basic regex
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const trimmed = email.trim()
  if (trimmed.length === 0) {
    return false
  }
  
  return EMAIL_REGEX.test(trimmed)
}

/**
 * Validates email format using comprehensive regex
 */
export function isValidEmailComprehensive(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const trimmed = email.trim()
  if (trimmed.length === 0) {
    return false
  }
  
  return EMAIL_REGEX_COMPREHENSIVE.test(trimmed)
}

/**
 * Email validation rule for NaiveUI forms
 */
export function createEmailValidationRule(message: string = 'Please enter a valid email address') {
  return {
    required: true,
    validator: (rule: any, value: string) => {
      if (!value) {
        return new Error('Email is required')
      }
      if (!isValidEmail(value)) {
        return new Error(message)
      }
      return true
    },
    trigger: ['blur', 'input']
  }
}

/**
 * Validates required field
 */
export function createRequiredRule(fieldName: string) {
  return {
    required: true,
    message: `${fieldName} is required`,
    trigger: ['blur', 'input']
  }
}

/**
 * Validates address fields
 */
export function createAddressValidationRules() {
  return {
    recipient_name: createRequiredRule('Full name'),
    street: createRequiredRule('Street address'),
    city: createRequiredRule('City'),
    state: createRequiredRule('State/Province'),
    zip: createRequiredRule('ZIP/Postal code'),
    country: createRequiredRule('Country')
  }
}