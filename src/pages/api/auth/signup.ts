import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();
  const supabase = supabaseServer(cookies);
  const { error } = await supabase.auth.signUp({
    email, 
    password,
    options: { emailRedirectTo: `${import.meta.env.PUBLIC_APP_URL}/auth/callback` }
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
