/**
 * Environment variable validation
 * Validates required environment variables on startup
 */

interface EnvConfig {
  PUBLIC_SUPABASE_URL: string;
  PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

const requiredEnvVars = [
  'PUBLIC_SUPABASE_URL',
  'PUBLIC_SUPABASE_ANON_KEY',
] as const;

const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

export function validateEnv(): EnvConfig {
  const missing: string[] = [];
  const config: Partial<EnvConfig> = {};

  // Check required variables
  for (const varName of requiredEnvVars) {
    const value = import.meta.env[varName];
    if (!value || value.trim() === '') {
      missing.push(varName);
    } else {
      config[varName] = value;
    }
  }

  // Check optional variables
  for (const varName of optionalEnvVars) {
    const value = import.meta.env[varName];
    if (value && value.trim() !== '') {
      config[varName as keyof EnvConfig] = value;
    }
  }

  if (missing.length > 0) {
    const errorMessage = `
❌ Missing required environment variables:

${missing.map(v => `  - ${v}`).join('\n')}

Please set these in your .env file or environment.
See docs/ENVIRONMENT_SETUP.md for instructions.
    `.trim();

    throw new Error(errorMessage);
  }

  return config as EnvConfig;
}

// Validate on import (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    // Log error but don't crash in development
    if (import.meta.env.DEV) {
      console.error(error);
    } else {
      throw error;
    }
  }
}

