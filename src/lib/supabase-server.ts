/**
 * Supabase Server Client
 * 
 * Server-side client with elevated permissions for:
 * - Admin operations
 * - Bypassing RLS for build-time queries
 * - Service role operations
 * 
 * NEVER expose this client to the browser!
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase service role key. Required for server-side operations.'
  );
}

/**
 * Server client with service role key
 * Can bypass Row Level Security (RLS)
 * Use ONLY in server-side code
 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

