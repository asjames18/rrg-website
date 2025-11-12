import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
  throw new Error('Supabase PUBLIC envs not configured');
}

declare global {
  interface Window {
    __supabaseClient?: SupabaseClient;
  }
}

// Canonical, idempotent browser client
export function getSupabase(): SupabaseClient {
  if (typeof window === 'undefined') throw new Error('getSupabase() called on server');
  if (!window.__supabaseClient) {
    window.__supabaseClient = createClient(url!, anon!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb:rrg:auth',
        flowType: 'pkce',
      },
    });

    // Handle auth errors gracefully
    window.__supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('[Supabase] Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        console.log('[Supabase] User signed out');
      }
    });
  }
  return window.__supabaseClient;
}

// Back-compat export (avoid breaking existing imports)
export const supabaseBrowser = getSupabase;
