import type { APIRoute } from 'astro';
import { logger } from '../../../lib/logger';
import { bulkContentOperation } from '../../../lib/workflows/bulk-operations';
import { workflow } from 'workflow';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, items, updates } = body;

    if (!action || !items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Action and items array are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validActions = ['publish', 'unpublish', 'delete', 'feature', 'unfeature', 'update'];
    if (!validActions.includes(action)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid action. Must be one of: ' + validActions.join(', ') 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    logger.info(`[Bulk API] Starting bulk ${action} workflow for ${items.length} items`);

    // Execute the workflow - this provides automatic retries, observability, and durability
    const result = await workflow(bulkContentOperation)(items, action, updates);

    logger.info(`[Bulk API] Bulk ${action} workflow completed:`, result.summary);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 207, // 207 Multi-Status for partial success
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    logger.error('Error processing bulk operation:', error);
    return new Response(JSON.stringify({ 
      error: 'Bulk operation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
