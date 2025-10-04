import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();
  const admin = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: u, error: e1 } = await admin.auth.admin.getUserByEmail(email);
  if (e1 || !u?.user) return new Response('User not found', { status: 404 });

  const { error: e2 } = await admin.from('user_roles')
    .insert({ user_id: u.user.id, role: 'admin' });
  if (e2) return new Response(e2.message, { status: 400 });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
