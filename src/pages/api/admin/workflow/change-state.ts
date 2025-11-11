/**
 * API Route: Change Workflow State
 * POST /api/admin/workflow/change-state - Change content workflow state
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const POST: APIRoute = async ({ cookies, request }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Check if user is authenticated
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
    const { content_id, content_type, new_state, comment } = body;

    if (!content_id || !content_type || !new_state) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validStates = ['draft', 'review', 'published', 'archived'];
    if (!validStates.includes(new_state)) {
      return new Response(JSON.stringify({ error: 'Invalid workflow state' }), {
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

    // Get current state
    const { data: currentContent } = await supabase
      .from(tableName)
      .select('workflow_state')
      .eq('id', content_id)
      .single();

    const oldState = currentContent?.workflow_state || 'draft';

    // Update workflow state
    const updateData: any = { workflow_state: new_state };

    if (new_state === 'review') {
      // Content submitted for review
      updateData.reviewed_by = null;
      updateData.reviewed_at = null;
    } else if (new_state === 'published') {
      // Content approved and published
      updateData.reviewed_by = user.id;
      updateData.reviewed_at = new Date().toISOString();
      updateData.published_by = user.id;
      updateData.published_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', content_id);

    if (updateError) {
      logger.error('Workflow state update error:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update workflow state' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log workflow history
    const { error: historyError } = await supabase
      .from('workflow_history')
      .insert({
        content_id,
        content_type,
        from_state: oldState,
        to_state: new_state,
        changed_by: user.id,
        comment: comment || null
      });

    if (historyError) {
      logger.error('Workflow history error:', historyError);
    }

    // Log activity
    await supabase
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: 'workflow_changed',
        description: `Changed ${content_type} workflow from ${oldState} to ${new_state}`,
        metadata: { content_id, content_type, old_state: oldState, new_state, comment }
      });

    return new Response(JSON.stringify({ 
      success: true,
      old_state: oldState,
      new_state
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Workflow change API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

