import type { APIRoute } from 'astro';
import { supabaseServerReadOnly } from '../../../lib/supabase-server';

/**
 * Get all push notification subscriptions
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

    // TODO: Query push_subscriptions table when it's created
    // For now, return empty array
    let subscriptions: any[] = [];

    try {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('id, user_id, endpoint, created_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Enrich with user emails if possible
        const userIds = [...new Set(data.map(s => s.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);

        subscriptions = data.map(sub => ({
          ...sub,
          user_email: profiles?.find(p => p.id === sub.user_id)?.email
        }));
      }
    } catch (error) {
      // Table doesn't exist yet
      console.log('[Push Subscriptions] push_subscriptions table not found');
    }

    return new Response(JSON.stringify({ subscriptions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[Push Subscriptions] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch subscriptions',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

