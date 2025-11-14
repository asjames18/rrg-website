/**
 * Bulk Operations Workflow
 * Handles bulk content operations with automatic retries and observability
 */

import { updateContentStatus } from './steps';
import { logger } from '../logger';

export async function bulkContentOperation(
  items: string[],
  action: string,
  updates?: any
) {
  "use workflow";
  
  logger.info(`[BulkWorkflow] Starting bulk ${action} for ${items.length} items`);
  
  const results = [];
  const errors = [];
  
  // Process each item with automatic retries
  for (const itemId of items) {
    try {
      const result = await updateContentStatus(itemId, action, updates);
      results.push(result);
      logger.info(`[BulkWorkflow] Successfully processed ${action} for ${itemId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({
        id: itemId,
        action,
        status: 'error',
        message: errorMessage
      });
      logger.error(`[BulkWorkflow] Failed to process ${action} for ${itemId}:`, errorMessage);
    }
  }
  
  const summary = {
    total: items.length,
    successful: results.length,
    failed: errors.length,
    action,
    completedAt: new Date().toISOString()
  };
  
  logger.info(`[BulkWorkflow] Completed bulk ${action}:`, summary);
  
  return {
    success: errors.length === 0,
    message: `Bulk ${action} completed: ${results.length} successful, ${errors.length} failed`,
    results,
    errors,
    summary
  };
}

