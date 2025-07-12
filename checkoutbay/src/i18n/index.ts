import { initCommonI18n } from '@gofranz/common-components';

// Import checkoutbay-specific translation files
import enUnique from './locales/en-unique.json';
import enDocs from './locales/en-docs.json';
import deUnique from './locales/de-unique.json';
import deDocs from './locales/de-docs.json';
import esUnique from './locales/es-unique.json';
import esDocs from './locales/es-docs.json';
import frUnique from './locales/fr-unique.json';
import frDocs from './locales/fr-docs.json';
import ptUnique from './locales/pt-unique.json';
import ptDocs from './locales/pt-docs.json';
import zhUnique from './locales/zh-unique.json';
import zhDocs from './locales/zh-docs.json';
import thUnique from './locales/th-unique.json';
import thDocs from './locales/th-docs.json';
import arUnique from './locales/ar-unique.json';
import arDocs from './locales/ar-docs.json';

const shopWebsiteResources = {
  en: {
    translation: {
      ...enUnique,
      ...enDocs,
    },
  },
  de: {
    translation: {
      ...deUnique,
      ...deDocs,
    },
  },
  es: {
    translation: {
      ...esUnique,
      ...esDocs,
    },
  },
  fr: {
    translation: {
      ...frUnique,
      ...frDocs,
    },
  },
  pt: {
    translation: {
      ...ptUnique,
      ...ptDocs,
    },
  },
  zh: {
    translation: {
      ...zhUnique,
      ...zhDocs,
    },
  },
  th: {
    translation: {
      ...thUnique,
      ...thDocs,
    },
  },
  ar: {
    translation: {
      ...arUnique,
      ...arDocs,
    },
  },
};

// Initialize i18n and wait for it to be ready
const i18n = initCommonI18n(shopWebsiteResources);

// Export the i18n instance
export default i18n;