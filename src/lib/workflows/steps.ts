/**
 * Workflow Steps
 * Individual steps that can be used in workflows
 */

import { supabaseAdmin } from '../supabase-admin';
import { logger } from '../logger';

/**
 * Step: Update content status
 */
export async function updateContentStatus(contentId: string, action: string, updates?: any) {
  "use step";
  
  const supabase = supabaseAdmin();
  
  try {
    let updateData: any = {};
    
    switch (action) {
      case 'publish':
        updateData = {
          status: 'published',
          published_at: new Date().toISOString()
        };
        break;
      case 'unpublish':
        updateData = {
          status: 'draft',
          published_at: null
        };
        break;
      case 'feature':
        updateData = { featured: true };
        break;
      case 'unfeature':
        updateData = { featured: false };
        break;
      case 'update':
        updateData = updates || {};
        break;
      case 'delete':
        // Handle delete separately
        const { error: deleteError } = await supabase
          .from('content')
          .delete()
          .eq('id', contentId);
        
        if (deleteError) {
          logger.error(`[Workflow] Error deleting content ${contentId}:`, deleteError);
          throw new Error(`Failed to delete content: ${deleteError.message}`);
        }
        
        return { id: contentId, action: 'deleted', status: 'success' };
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    const { data, error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', contentId)
      .select()
      .single();
    
    if (error) {
      logger.error(`[Workflow] Error updating content ${contentId}:`, error);
      throw new Error(`Failed to update content: ${error.message}`);
    }
    
    return {
      id: contentId,
      action,
      status: 'success',
      data
    };
  } catch (error) {
    logger.error(`[Workflow] Step failed for content ${contentId}:`, error);
    throw error;
  }
}

/**
 * Step: Get user information
 */
export async function getUserInfo(userId: string) {
  "use step";
  
  const supabase = supabaseAdmin();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    logger.error(`[Workflow] Error fetching user ${userId}:`, error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
  
  if (!data) {
    throw new Error(`User ${userId} not found`);
  }
  
  return data;
}

/**
 * Step: Send welcome email
 * Note: This is a placeholder - you'll need to integrate with your email service
 * (e.g., Resend, SendGrid, AWS SES, etc.)
 */
export async function sendWelcomeEmail(email: string, displayName: string) {
  "use step";
  
  const { generateWelcomeEmailHTML, generateWelcomeEmailText } = await import('./email-templates');
  
  // TODO: Replace with your actual email service integration
  // Example with Resend:
  // import { Resend } from 'resend';
  // import { FatalError } from 'workflow';
  // 
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // const { data, error } = await resend.emails.send({
  //   from: 'Real & Raw Gospel <welcome@rrg.com>',
  //   to: [email],
  //   subject: 'Welcome to Real & Raw Gospel!',
  //   html: generateWelcomeEmailHTML(displayName),
  //   text: generateWelcomeEmailText(displayName),
  // });
  // 
  // if (error) {
  //   throw new FatalError(`Failed to send email: ${error.message}`);
  // }
  
  // For now, we'll log it and simulate success
  logger.info(`[Workflow] Sending welcome email to ${email} for ${displayName}`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // In production, uncomment and use actual email service above
  
  return {
    email,
    status: 'sent',
    sentAt: new Date().toISOString()
  };
}

/**
 * Step: Log user activity
 */
export async function logUserActivity(userId: string, activityType: string, description: string, metadata?: any) {
  "use step";
  
  const supabase = supabaseAdmin();
  
  const { error } = await supabase
    .from('user_activity')
    .insert({
      user_id: userId,
      activity_type: activityType,
      description,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    });
  
  if (error) {
    logger.error(`[Workflow] Error logging activity for user ${userId}:`, error);
    // Don't throw - activity logging is non-critical
  }
  
  return { logged: true };
}

