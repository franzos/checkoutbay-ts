import i18n from 'i18next';

const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es', 'pt', 'zh', 'th', 'ar'];
const LANGUAGE_STORAGE_KEY = 'saved-language';

/**
 * Get language from hash-based routes (/#/de/, /#/es/, etc.)
 */
function getLanguageFromHash(): string | null {
  const hash = window.location.hash;
  // Match patterns like /#/de/ or /#/de/path or /#/de
  const match = hash.match(/^#\/([a-z]{2})(?:\/|$)/);
  
  if (match && SUPPORTED_LANGUAGES.includes(match[1])) {
    return match[1];
  }
  
  return null;
}

/**
 * Get language from URL parameters (?lang=de) - kept as fallback
 */
function getLanguageFromURL(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  
  if (langParam && SUPPORTED_LANGUAGES.includes(langParam)) {
    return langParam;
  }
  
  return null;
}

/**
 * Get stored language preference
 */
function getStoredLanguage(): string | null {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error);
  }
  
  return null;
}

/**
 * Store language preference
 */
export function storeLanguage(language: string): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Failed to store language in localStorage:', error);
  }
}

/**
 * Get browser's preferred language
 */
function getBrowserLanguage(): string {
  const browserLang = navigator.language.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en';
}

/**
 * Check if current URL is a base URL without hash and redirect to language-aware hash URL
 */
function redirectFromBaseURL(): void {
  const currentHash = window.location.hash;
  
  // Check if we're on a base URL (no hash or empty hash)
  if (!currentHash || currentHash === '#' || currentHash === '#/') {
    // Get preferred language from storage or browser
    const preferredLanguage = 
      getStoredLanguage() ||
      getBrowserLanguage();
    
    // Create appropriate hash URL
    let newHash;
    if (preferredLanguage === 'en') {
      newHash = '#/';
    } else {
      newHash = `#/${preferredLanguage}/`;
    }
    
    // Redirect to language-aware hash URL
    window.location.replace(window.location.origin + window.location.pathname + newHash);
    return;
  }
}

/**
 * Detect and set the appropriate language based on hash routes, storage, and browser preferences
 */
export function detectAndSetLanguage(): void {
  // First, check if we need to redirect from base URL
  redirectFromBaseURL();
  
  // Priority order: Hash route > URL param > Stored preference > Browser language
  const detectedLanguage = 
    getLanguageFromHash() ||
    getLanguageFromURL() ||
    getStoredLanguage() ||
    getBrowserLanguage();
  
  // Change language if it's different from current
  if (i18n.language !== detectedLanguage) {
    i18n.changeLanguage(detectedLanguage);
  }
  
  // Store the detected language
  storeLanguage(detectedLanguage);
}

/**
 * Update hash route with language prefix
 */
export function updateHashWithLanguage(language: string, currentPath?: string): void {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return;
  }
  
  // Get current path without language prefix
  let path = currentPath || window.location.hash.slice(1); // Remove #
  
  // Remove existing language prefix if present
  const langMatch = path.match(/^\/([a-z]{2})(?:\/|$)/);
  if (langMatch && SUPPORTED_LANGUAGES.includes(langMatch[1])) {
    path = path.replace(/^\/[a-z]{2}/, '');
  }
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // Create new hash with language prefix
  let newHash;
  if (language === 'en') {
    // No prefix for English (default)
    newHash = '#' + path;
  } else {
    newHash = `#/${language}${path}`;
  }
  
  // Update hash without page reload
  window.history.replaceState(null, '', newHash);
  
  // Store language preference
  storeLanguage(language);
}