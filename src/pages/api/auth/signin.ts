import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { sanitizeEmail } from '../../../lib/sanitize';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const email = sanitizeEmail(body.email);
    const password = body.password; // Password should not be sanitized, but validated
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const supabase = supabaseServer(cookies);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ ok: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
