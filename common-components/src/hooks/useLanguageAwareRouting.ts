import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es', 'pt', 'zh', 'th', 'ar'];

/**
 * Hook for creating language-aware URLs in hash-based routing
 * Works with routes like /#/en/, /#/de/account, /#/fr/pricing
 */
export function useLanguageAwareRouting() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  /**
   * Get current language from the route
   */
  const getCurrentLanguage = (): string => {
    const path = location.pathname;
    const match = path.match(/^\/([a-z]{2})(?:\/|$)/);
    
    if (match && SUPPORTED_LANGUAGES.includes(match[1])) {
      return match[1];
    }
    
    // Fallback to i18n language, then English
    if (i18n.language && SUPPORTED_LANGUAGES.includes(i18n.language)) {
      return i18n.language;
    }
    
    return 'en'; // Default to English
  };
  
  /**
   * Create a language-aware URL
   * @param path - The path without language prefix (e.g., '/news', '/account')
   * @param language - Optional language override
   */
  const createLanguageURL = (path: string, language?: string): string => {
    const lang = language || getCurrentLanguage();
    
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Remove any existing language prefix from the path to avoid double prefixes
    const cleanPath = path.replace(/^\/([a-z]{2})(\/|$)/, '$2');
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
    
    // For English (default), no prefix needed
    if (lang === 'en') {
      return normalizedPath;
    }
    
    // For other languages, add language prefix
    return `/${lang}${normalizedPath}`;
  };
  
  /**
   * Check if a path is currently active (considering language prefix)
   * @param path - The path to check (without language prefix)
   */
  const isActive = (path: string): boolean => {
    const currentLang = getCurrentLanguage();
    const expectedPath = createLanguageURL(path, currentLang);
    return location.pathname === expectedPath;
  };
  
  /**
   * Navigate to a path with language awareness
   * @param path - The path to navigate to (without language prefix)
   * @param language - Optional language override
   */
  const navigateWithLanguage = (path: string, language?: string) => {
    navigate(createLanguageURL(path, language));
  };
  
  /**
   * Get stored language preference from localStorage
   */
  const getStoredLanguage = (): string => {
    try {
      const stored = localStorage.getItem('checkoutbay-language') || localStorage.getItem('formshive-language');
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to read language from localStorage:', error);
    }
    
    // Fallback to browser language
    const browserLang = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en';
  };

  /**
   * Check if current URL is a base URL and redirect to language-aware hash URL
   * Should be called on app initialization
   */
  const redirectFromBaseURL = () => {
    const currentHash = window.location.hash;
    
    // Check if we're on a base URL (no hash or empty hash)
    if (!currentHash || currentHash === '#' || currentHash === '#/') {
      // Get preferred language from storage or browser, fallback to i18n current language
      const preferredLanguage = getStoredLanguage() || i18n.language || 'en';
      
      // Create appropriate hash URL
      let newHash;
      if (preferredLanguage === 'en') {
        newHash = '#/';
      } else {
        newHash = `#/${preferredLanguage}/`;
      }
      
      // Redirect to language-aware hash URL
      window.location.replace(window.location.origin + window.location.pathname + newHash);
      return true; // Indicates that a redirect occurred
    }
    
    return false; // No redirect needed
  };
  
  /**
   * Get the current language from i18n
   */
  const currentLanguage = getCurrentLanguage();
  
  return {
    createLanguageURL,
    isActive,
    currentLanguage,
    getCurrentLanguage,
    navigateWithLanguage,
    redirectFromBaseURL,
    getStoredLanguage,
  };
}