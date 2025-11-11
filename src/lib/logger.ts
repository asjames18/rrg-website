/**
 * Environment-based logger utility
 * Logs only in development, silent in production
 */

const isDev = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  
  error: (...args: unknown[]) => {
    // Always log errors, but in production send to error tracking
    if (isDev) {
      console.error(...args);
    } else {
      // In production, errors should be sent to error tracking service
      // For now, we'll still log to console but this is where Sentry/etc would go
      console.error(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
  
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },
};

