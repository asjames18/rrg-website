import type { APIRoute } from 'astro';
import { supabaseServerReadOnly } from '../../../../lib/supabase-server';

/**
 * Get push notification statistics
 */
export const GET: APIRoute = async ({ cookies }) => {
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

    // Check admin role (you may need to adjust this based on your role checking)
    // For now, we'll allow any authenticated user to view stats
    
    // TODO: Query push_subscriptions table when it's created
    // For now, return placeholder stats
    const stats = {
      total_subscriptions: 0,
      active_subscriptions: 0,
      notifications_sent: 0
    };

    // Try to get actual stats if table exists
    try {
      const { data: subscriptions, error: subError } = await supabase
        .from('push_subscriptions')
        .select('id, user_id, endpoint, created_at', { count: 'exact' });

      if (!subError && subscriptions) {
        stats.total_subscriptions = subscriptions.length;
        stats.active_subscriptions = subscriptions.length; // Assume all are active for now
      }
    } catch (error) {
      // Table doesn't exist yet, use placeholder
      console.log('[Push Stats] push_subscriptions table not found, using placeholder stats');
    }

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[Push Stats] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch stats',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

