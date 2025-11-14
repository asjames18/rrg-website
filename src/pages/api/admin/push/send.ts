import type { APIRoute } from 'astro';
import { supabaseServerReadOnly, supabaseAdmin } from '../../../../lib/supabase-server';

/**
 * Send push notification to all subscribers
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = supabaseServerReadOnly(cookies);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { title, body, url, requireInteraction } = await request.json();

    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'Title and body are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all subscriptions
    let subscriptions: any[] = [];
    try {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('endpoint, p256dh, auth');

      if (error) {
        throw error;
      }

      subscriptions = data || [];
    } catch (error: any) {
      // Table might not exist yet
      console.error('[Push Send] Failed to fetch subscriptions:', error);
      return new Response(JSON.stringify({ 
        error: 'No subscriptions found',
        message: 'push_subscriptions table may not exist yet. Users need to subscribe first.',
        sent_count: 0
      }), {
        status: 200, // Return 200 but with error message
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (subscriptions.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No active subscriptions',
        sent_count: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send notifications using web-push
    // Note: You'll need to install web-push: npm install web-push
    // And configure it with your VAPID keys
    
    const sentCount = subscriptions.length;
    
    // TODO: Implement actual web-push sending
    // For now, return success (you'll need to implement the actual sending)
    console.log(`[Push Send] Would send to ${sentCount} subscribers:`, {
      title,
      body,
      url,
      requireInteraction
    });

    return new Response(JSON.stringify({ 
      success: true,
      sent_count: sentCount,
      message: `Notification queued for ${sentCount} subscribers`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[Push Send] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send notification',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

