import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email } = await request.json();
  const supabase = supabaseServer(cookies);
  const redirectTo = `${import.meta.env.PUBLIC_APP_URL}/auth/reset`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
