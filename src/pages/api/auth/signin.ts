import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();
  const supabase = supabaseServer(cookies);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
