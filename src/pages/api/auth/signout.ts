import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';

export const POST: APIRoute = async ({ cookies }) => {
  const supabase = supabaseServer(cookies);
  await supabase.auth.signOut();
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
