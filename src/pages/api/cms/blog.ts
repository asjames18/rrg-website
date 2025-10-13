import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';

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
    const { title, slug, summary, body: content, tags, featured, status } = body;

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
        tags: tags || [],
        featured: featured || false,
        published: status === 'published',
        published_at: status === 'published' ? new Date().toISOString() : null,
        author: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
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
    console.error('Blog post creation error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


