import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { sanitizeEmail, sanitizeString } from '../../../lib/sanitize';
import { isPasswordValid } from '../../../lib/password-validator';
import { logger } from '../../../lib/logger';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    
    // Validate and sanitize input
    const email = sanitizeEmail(body.email);
    const password = body.password; // Don't sanitize password, but validate it
    const displayName = body.displayName ? sanitizeString(body.displayName) : null;
    
    console.log('[Signup API] Signup attempt for:', email);
    
    // Validate email format
    if (!email || !email.includes('@')) {
      logger.warn('[Signup API] Invalid email format:', email);
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate password
    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check password strength
    if (!isPasswordValid(password, 8)) {
      return new Response(
        JSON.stringify({ 
          error: 'Password is too weak. Please include a mix of uppercase, lowercase, numbers, and special characters' 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Attempt to sign up the user
    const supabase = supabaseServer(cookies);
    
    // Determine the correct redirect URL
    const appUrl = import.meta.env.PUBLIC_APP_URL || 
                   import.meta.env.PUBLIC_SITE_URL || 
                   'http://localhost:4321';
    
    const { data, error } = await supabase.auth.signUp({
      email, 
      password,
      options: { 
        emailRedirectTo: `${appUrl}/auth/callback`,
        data: {
          display_name: displayName || email.split('@')[0]
        }
      }
    });
    
    if (error) {
      logger.error('[Signup API] Signup error:', error.message);
      
      // Provide user-friendly error messages
      if (error.message.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'An account with this email already exists. Try signing in instead.' }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('[Signup API] User created:', data.user?.id);
    
    // Create user profile in profiles table
    if (data.user) {
      try {
        const adminClient = supabaseAdmin();
        const { error: profileError } = await adminClient
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email,
            display_name: displayName || email.split('@')[0],
            role: 'user', // Default role
            status: 'active',
            created_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });
        
        if (profileError) {
          logger.error('[Signup API] Profile creation error:', profileError);
        } else {
          console.log('[Signup API] Profile created for:', email);
        }
        
        // Log signup activity
        await adminClient
          .from('user_activity')
          .insert({
            user_id: data.user.id,
            activity_type: 'user_signup',
            description: 'New user registered',
            metadata: { email, source: 'web' }
          })
          .then(({ error: activityError }) => {
            if (activityError) {
              logger.error('[Signup API] Activity log error:', activityError);
            }
          });
        
        // Trigger welcome email workflow (non-blocking)
        // This will automatically retry if it fails and can resume if interrupted
        try {
          const { workflow } = await import('workflow');
          const { welcomeNewUser } = await import('../../../lib/workflows/welcome-email');
          
          // Execute workflow asynchronously - don't block the signup response
          workflow(welcomeNewUser)(data.user.id, email).catch((workflowError) => {
            logger.error('[Signup API] Welcome email workflow failed (non-critical):', workflowError);
            // Don't fail signup if welcome email fails
          });
          
          logger.info('[Signup API] Welcome email workflow triggered for:', email);
        } catch (workflowImportError) {
          logger.warn('[Signup API] Could not trigger welcome email workflow:', workflowImportError);
          // Continue - welcome email is non-critical
        }
        
      } catch (profileErr) {
        logger.error('[Signup API] Profile creation exception:', profileErr);
        // Don't fail the signup if profile creation fails
      }
    }
    
    logger.info('[Signup API] Signup successful for:', email);
    
    return new Response(
      JSON.stringify({ 
        ok: true,
        message: 'Account created successfully! Please check your email to verify your account.'
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    logger.error('[Signup API] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
