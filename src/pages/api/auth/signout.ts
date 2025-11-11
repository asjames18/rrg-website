import type { APIRoute } from 'astro';
import { logger } from '../../../lib/logger';

import { supabaseServer } from '../../../lib/supabase-server';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear all authentication cookies
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token', 
      'sb-rrg-auth-token',
      'sb:rrg:auth',
      'supabase-auth-token'
    ];
    
    cookieNames.forEach(name => {
      cookies.delete(name, { path: '/' });
    });
    
    // Clear the main Supabase auth cookie
    cookies.delete('sb-rrg-auth-token', { 
      path: '/',
      domain: '.localhost',
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Signed out successfully' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'sb-rrg-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
      }
    });
    
  } catch (error) {
    logger.error('Sign out error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to sign out' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};