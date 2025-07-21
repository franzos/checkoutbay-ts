import '@mantine/charts/styles.css';
import { DirectionProvider, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.layer.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/tiptap/styles.css';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { detectAndSetLanguage } from '../../common-components/src/lib/languageDetection';
import './assets/layout.css';
import { GeneralLayout } from './components/Layout/General';
import { LanguageRoutes } from './components/Layout/LanguageRoutes';
import { SEOHead } from './components/SEO/SEOHead';
import './i18n';
import { theme } from './theme';

export default function App() {
  const { i18n } = useTranslation();

  // Determine if current language is RTL
  const isRTL = i18n.language.startsWith('ar');

  // Initialize language detection and URL sync
  React.useEffect(() => {
    detectAndSetLanguage();
  }, []);

  // Set document direction and lang attribute
  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  return (
    <HelmetProvider>
      <DirectionProvider>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <SEOHead />
          <HashRouter>
            <GeneralLayout>
              <Notifications 
                position="top-right" 
                zIndex={1000}
                autoClose={6000}
                style={{
                  marginTop: '20px',
                  marginRight: '20px',
                }}
              />
              <Routes>
                {/* Default English routes (no language prefix) */}
                <Route path="/*" element={<LanguageRoutes />} />

                {/* Language-specific routes */}
                <Route path="/de/*" element={<LanguageRoutes languagePrefix="de" />} />
                <Route path="/fr/*" element={<LanguageRoutes languagePrefix="fr" />} />
                <Route path="/es/*" element={<LanguageRoutes languagePrefix="es" />} />
                <Route path="/pt/*" element={<LanguageRoutes languagePrefix="pt" />} />
                <Route path="/zh/*" element={<LanguageRoutes languagePrefix="zh" />} />
                <Route path="/th/*" element={<LanguageRoutes languagePrefix="th" />} />
                <Route path="/ar/*" element={<LanguageRoutes languagePrefix="ar" />} />
              </Routes>
            </GeneralLayout>
          </HashRouter>
        </MantineProvider>
      </DirectionProvider>
    </HelmetProvider>
  );
}
