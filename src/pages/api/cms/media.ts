import type { APIRoute } from 'astro';
import { SupabaseCMSAPI } from '../../../lib/cms/supabase-cms-api';

export const GET: APIRoute = async ({ url }) => {
  try {
    const type = url.searchParams.get('type');
    const folder = url.searchParams.get('folder');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const filters = {
      type,
      folder,
      search,
      limit,
      offset
    };

    const result = await SupabaseCMSAPI.getMedia(filters);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch media',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // In a real implementation, you would delete the file from storage
    // and remove the database record
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate deletion

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Media deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete media',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
