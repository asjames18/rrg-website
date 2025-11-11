/**
 * API Route: Bulk Content Actions
 * POST /api/admin/content/bulk-action - Perform bulk actions on content
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const POST: APIRoute = async ({ cookies, request }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check admin/editor role
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
    const { action, content_ids, content_type, value } = body;

    if (!action || !content_ids || !Array.isArray(content_ids) || content_ids.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Determine table name
    const tableMap: Record<string, string> = {
      blog: 'posts',
      video: 'videos',
      book: 'books',
      music: 'music'
    };

    const tableName = tableMap[content_type];
    if (!tableName) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let results = { success: 0, failed: 0 };

    switch (action) {
      case 'change_workflow': {
        if (!value || !['draft', 'review', 'published', 'archived'].includes(value)) {
          return new Response(JSON.stringify({ error: 'Invalid workflow state' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        for (const contentId of content_ids) {
          const { error } = await supabase
            .from(tableName)
            .update({ workflow_state: value })
            .eq('id', contentId);

          if (error) {
            results.failed++;
            logger.error(`Bulk workflow change error for ${contentId}:`, error);
          } else {
            results.success++;
          }
        }
        break;
      }

      case 'add_tag': {
        if (!value) {
          return new Response(JSON.stringify({ error: 'Tag value required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        for (const contentId of content_ids) {
          // Get current tags
          const { data: current } = await supabase
            .from(tableName)
            .select('tags')
            .eq('id', contentId)
            .single();

          if (current) {
            const currentTags = current.tags || [];
            if (!currentTags.includes(value)) {
              const { error } = await supabase
                .from(tableName)
                .update({ tags: [...currentTags, value] })
                .eq('id', contentId);

              if (error) {
                results.failed++;
                logger.error(`Bulk add tag error for ${contentId}:`, error);
              } else {
                results.success++;
              }
            } else {
              results.success++; // Already has tag
            }
          }
        }
        break;
      }

      case 'remove_tag': {
        if (!value) {
          return new Response(JSON.stringify({ error: 'Tag value required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        for (const contentId of content_ids) {
          // Get current tags
          const { data: current } = await supabase
            .from(tableName)
            .select('tags')
            .eq('id', contentId)
            .single();

          if (current && current.tags) {
            const newTags = current.tags.filter((tag: string) => tag !== value);
            const { error } = await supabase
              .from(tableName)
              .update({ tags: newTags })
              .eq('id', contentId);

            if (error) {
              results.failed++;
              logger.error(`Bulk remove tag error for ${contentId}:`, error);
            } else {
              results.success++;
            }
          }
        }
        break;
      }

      case 'delete': {
        for (const contentId of content_ids) {
          const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', contentId);

          if (error) {
            results.failed++;
            logger.error(`Bulk delete error for ${contentId}:`, error);
          } else {
            results.success++;
          }
        }
        break;
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Log activity
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'bulk_action',
        description: `Performed bulk ${action} on ${results.success} ${content_type} items`,
        metadata: { action, content_type, count: results.success, failed: results.failed }
      });

    return new Response(JSON.stringify({ 
      success: true,
      results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Bulk action API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

