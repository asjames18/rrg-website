/**
 * Error tracking integration
 * Placeholder for Sentry/LogRocket integration
 * 
 * To enable:
 * 1. Install: npm install @sentry/astro
 * 2. Configure in astro.config.mjs
 * 3. Set SENTRY_DSN environment variable
 */

const isProduction = import.meta.env.PROD;
const sentryDsn = import.meta.env.SENTRY_DSN;

export function initErrorTracking() {
  if (!isProduction || !sentryDsn) {
    return;
  }

  // Sentry initialization would go here
  // See: https://docs.sentry.io/platforms/javascript/guides/astro/
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  if (!isProduction || !sentryDsn) {
    return;
  }

  // Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (!isProduction || !sentryDsn) {
    return;
  }

  // Sentry.captureMessage(message, level);
}

