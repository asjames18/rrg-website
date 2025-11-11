import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import { validateEnv } from './env';

export function supabaseServer(cookies: AstroCookies) {
  const env = validateEnv();
  return createServerClient(
    env.PUBLIC_SUPABASE_URL,
    env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (k) => cookies.get(k)?.value,
        set: (k, v, o) => cookies.set(k, v, { ...o, path: '/' }),
        remove: (k, o) => cookies.delete(k, { ...o, path: '/' }),
      },
    }
  );
}

// Read-only variant for layouts/partials where cookies cannot be modified
export function supabaseServerReadOnly(cookies: AstroCookies) {
  const env = validateEnv();
  return createServerClient(
    env.PUBLIC_SUPABASE_URL,
    env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (k) => cookies.get(k)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
}