import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useRustyState } from './state';

// Initialize Sentry
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
const sentryEnvironment = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development';

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnvironment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: sentryEnvironment === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: sentryEnvironment === 'production' ? 0.01 : 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const init = () => {
  useRustyState.getState().init();
};

init();

const AppWithSentry = sentryDsn ? Sentry.withErrorBoundary(App, {
  fallback: ({ error }) => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p>We've been notified about this error and will fix it soon.</p>
      <details style={{ marginTop: '10px' }}>
        <summary>Error details</summary>
        <pre style={{ textAlign: 'left', overflow: 'auto' }}>{String(error)}</pre>
      </details>
    </div>
  ),
}) : App;

ReactDOM.createRoot(document.getElementById('root')!).render(<AppWithSentry />);
