import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import common translation files
import enCommon from './locales/en.json';
import deCommon from './locales/de.json';
import esCommon from './locales/es.json';
import frCommon from './locales/fr.json';
import ptCommon from './locales/pt.json';
import zhCommon from './locales/zh.json';
import thCommon from './locales/th.json';
import arCommon from './locales/ar.json';

export const commonResources: Record<string, { translation: Record<string, any> }> = {
  en: { 
    translation: enCommon
  },
  de: { 
    translation: deCommon
  },
  es: { 
    translation: esCommon
  },
  fr: { 
    translation: frCommon
  },
  pt: { 
    translation: ptCommon
  },
  zh: { 
    translation: zhCommon
  },
  th: { 
    translation: thCommon
  },
  ar: { 
    translation: arCommon
  },
};

// Initialize i18n with common translations only
// Applications can extend this with their specific translations
export const initCommonI18n = (additionalResources: Record<string, { translation?: Record<string, any> }> = {}) => {
  const mergedResources: Record<string, { translation: Record<string, any> }> = {};
  
  // Merge both common resources and additional resources
  const allLanguages = [...new Set([...Object.keys(commonResources), ...Object.keys(additionalResources)])];
  
  allLanguages.forEach(lang => {
    mergedResources[lang] = {
      translation: {
        ...(commonResources[lang]?.translation || {}),
        ...(additionalResources[lang]?.translation || {})
      }
    };
  });

  return i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: mergedResources,
      fallbackLng: 'en',
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
    });
};

export default i18n;