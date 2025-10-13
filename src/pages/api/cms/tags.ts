import type { APIRoute } from 'astro';
import { SupabaseCMSAPI } from '../../../lib/cms/supabase-cms-api';

export const GET: APIRoute = async () => {
  try {
    const tags = await SupabaseCMSAPI.getTags();
    
    return new Response(JSON.stringify({ tags }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch tags',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
