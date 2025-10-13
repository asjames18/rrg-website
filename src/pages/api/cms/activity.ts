import type { APIRoute } from 'astro';
import { SupabaseCMSAPI } from '../../../lib/cms/supabase-cms-api';

export const GET: APIRoute = async ({ url }) => {
  try {
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    // Get activities from Supabase
    const activities = await SupabaseCMSAPI.getActivities(limit);

    return new Response(JSON.stringify(activities), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch activities',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};