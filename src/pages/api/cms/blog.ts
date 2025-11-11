import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { logger } from '../../../lib/logger';
import { sanitizeString, sanitizeSlug, sanitizeStringArray, sanitizeMarkdown } from '../../../lib/sanitize';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Check authentication
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
    
    // Sanitize inputs
    const title = sanitizeString(body.title, 200);
    const slug = sanitizeSlug(body.slug);
    const summary = sanitizeString(body.summary, 500);
    const content = sanitizeMarkdown(body.body);
    const tags = sanitizeStringArray(body.tags || [], 20);
    const featured = Boolean(body.featured);
    const status = body.status === 'published' ? 'published' : 'draft';

    // Validate required fields
    if (!title || !slug || !summary || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create blog post
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        summary,
        body_md: content,
        tags,
        featured,
        published: status === 'published',
        published_at: status === 'published' ? new Date().toISOString() : null,
        author: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating blog post:', error);
      return new Response(JSON.stringify({ error: 'Failed to create blog post' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data,
      message: 'Blog post created successfully' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    logger.error('Blog post creation error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


