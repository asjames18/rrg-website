/**
 * Welcome Email Workflow
 * Sends welcome email to new users with automatic retries
 */

import { getUserInfo, sendWelcomeEmail, logUserActivity } from './steps';
import { logger } from '../logger';

export async function welcomeNewUser(userId: string, email: string) {
  "use workflow";
  
  logger.info(`[WelcomeWorkflow] Starting welcome workflow for user ${userId}`);
  
  try {
    // Step 1: Get user information
    const user = await getUserInfo(userId);
    const displayName = user.display_name || user.email?.split('@')[0] || 'Friend';
    
    logger.info(`[WelcomeWorkflow] Fetched user info for ${email}`);
    
    // Step 2: Send welcome email (with automatic retries)
    const emailResult = await sendWelcomeEmail(email, displayName);
    
    logger.info(`[WelcomeWorkflow] Welcome email sent to ${email}`);
    
    // Step 3: Log the welcome email activity
    await logUserActivity(
      userId,
      'welcome_email_sent',
      'Welcome email sent to new user',
      { email, sentAt: emailResult.sentAt }
    );
    
    logger.info(`[WelcomeWorkflow] Welcome workflow completed for ${email}`);
    
    return {
      success: true,
      userId,
      email,
      displayName,
      emailSent: true,
      sentAt: emailResult.sentAt
    };
  } catch (error) {
    logger.error(`[WelcomeWorkflow] Error in welcome workflow for ${userId}:`, error);
    
    // Log the failure
    try {
      await logUserActivity(
        userId,
        'welcome_email_failed',
        'Welcome email failed to send',
        { email, error: error instanceof Error ? error.message : 'Unknown error' }
      );
    } catch (logError) {
      logger.error(`[WelcomeWorkflow] Failed to log error:`, logError);
    }
    
    throw error;
  }
}

