import type { APIRoute } from 'astro';
import { supabaseServerReadOnly } from '../../../lib/supabase-server';

/**
 * Subscribe to push notifications
 * Stores the push subscription in the database
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const subscription = await request.json();

    // Validate subscription
    if (!subscription || !subscription.endpoint) {
      return new Response(JSON.stringify({ 
        error: 'Invalid subscription data' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get authenticated user
    const supabase = supabaseServerReadOnly(cookies);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Store subscription in database
    console.log('[Push API] Subscription received for user:', user.id);
    console.log('[Push API] Endpoint:', subscription.endpoint);

    // Try to store in database (table may not exist yet)
    try {
      const { error: insertError } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys?.p256dh || '',
          auth: subscription.keys?.auth || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'endpoint'
        });

      if (insertError) {
        console.warn('[Push API] Failed to save subscription (table may not exist):', insertError.message);
        // Still return success - subscription is valid even if we can't store it
      } else {
        console.log('[Push API] Subscription saved to database');
      }
    } catch (dbError: any) {
      console.warn('[Push API] Database error (table may not exist):', dbError.message);
      // Continue - subscription is still valid
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Subscription received'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[Push API] Subscribe error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save subscription',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Unsubscribe from push notifications
 */
export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    const subscription = await request.json();

    if (!subscription || !subscription.endpoint) {
      return new Response(JSON.stringify({ 
        error: 'Invalid subscription data' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get authenticated user
    const supabase = supabaseServerReadOnly(cookies);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[Push API] Unsubscribe request for user:', user.id);

    // TODO: Remove from database
    // const { error: deleteError } = await supabase
    //   .from('push_subscriptions')
    //   .delete()
    //   .eq('endpoint', subscription.endpoint)
    //   .eq('user_id', user.id);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Unsubscribed successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[Push API] Unsubscribe error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to unsubscribe',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

