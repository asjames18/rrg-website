import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { logger } from '../../../lib/logger';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = supabaseServer(cookies);
    
    // Use APP_URL with fallback
    const appUrl = import.meta.env.PUBLIC_APP_URL || 
                   import.meta.env.PUBLIC_SITE_URL || 
                   'http://localhost:4321';
    
    const redirectTo = `${appUrl}/auth/reset`;
    
    logger.info('[Reset Password] Sending reset email to:', email, 'Redirect:', redirectTo);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    
    if (error) {
      logger.error('[Reset Password] Error:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    logger.info('[Reset Password] Email sent successfully to:', email);
    return new Response(JSON.stringify({ ok: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    logger.error('[Reset Password] Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send reset email' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
