import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      telemetry: false,
      url: process.env.SENTRY_BASE_URL,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT || 'checkoutbay',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: './dist/**',
      },
    }),
  ],
  worker: {
    format: 'es',
    plugins: () => [],
  },
  build: {
    commonjsOptions: {
      include: [/@rusty\/common/, /node_modules/],
    },
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['@gofranz/common', '@gofranz/common-components', '@gofranz/checkoutbay-common'],
  },
})
