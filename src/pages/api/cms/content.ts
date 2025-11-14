import type { APIRoute } from 'astro';
import { SupabaseCMSAPI } from '../../../lib/cms/supabase-cms-api';
import { logger } from '../../../lib/logger';
import { supabaseServer } from '../../../lib/supabase-server';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const type = url.searchParams.get('type') || 'all';
    const status = url.searchParams.get('status') || 'all';
    const featured = url.searchParams.get('featured');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const sortBy = url.searchParams.get('sortBy') || 'updated_at';
    const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const filters = {
      type: type !== 'all' ? type : undefined,
      status: status !== 'all' ? status : undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      search,
      limit,
      offset,
      sortBy,
      sortOrder
    };

    const result = await SupabaseCMSAPI.getContent(filters);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    logger.error('Error fetching content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check authentication
    const supabase = supabaseServer(cookies);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user has editor or admin role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isEditor = userRoles && userRoles.some(role => ['admin', 'editor'].includes(role.role));
    if (!isEditor) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    
    logger.info('[Content API] POST request received:', {
      title: body.title,
      content_type: body.content_type,
      status: body.status,
      hasMetadata: !!body.metadata,
      userId: user.id
    });

    // Set author_id if not provided
    if (!body.author_id) {
      body.author_id = user.id;
    }

    const content = await SupabaseCMSAPI.createContent(body);

    return new Response(JSON.stringify(content), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    logger.error('[Content API] Error creating content:', {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to create content',
      message: error?.message || 'Unknown error',
      details: error?.details,
      hint: error?.hint,
      code: error?.code
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const content = await SupabaseCMSAPI.updateContent(id, body);

    return new Response(JSON.stringify(content), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    logger.error('Error updating content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update content',
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

    await SupabaseCMSAPI.deleteContent(id);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Content deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    logger.error('Error deleting content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};