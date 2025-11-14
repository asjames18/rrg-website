/**
 * API Route: System Health Check
 * GET /api/admin/dashboard/health - Get system health status
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../../lib/supabase-server';
import { logger } from '../../../../lib/logger';

export const GET: APIRoute = async ({ locals, cookies }) => {
  try {
    // Use authenticated user from middleware
    const user = locals.user;
    const isAdmin = locals.isAdmin;
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = supabaseServer(cookies);
    const health: {
      database: { status: string; message: string; healthy: boolean };
      storage: { status: string; message: string; healthy: boolean };
      api: { status: string; message: string; healthy: boolean };
      errors24h: { count: number; healthy: boolean };
    } = {
      database: { status: 'Offline', message: 'Unknown', healthy: false },
      storage: { status: 'Unavailable', message: 'Unknown', healthy: false },
      api: { status: 'Unknown', message: 'Unknown', healthy: false },
      errors24h: { count: 0, healthy: true }
    };

    // Check Database Health
    try {
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('content')
        .select('id')
        .limit(1);
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        health.database = {
          status: 'Error',
          message: error.message || 'Connection failed',
          healthy: false
        };
      } else {
        health.database = {
          status: 'Online',
          message: responseTime < 500 ? 'Fast' : responseTime < 1000 ? 'Normal' : 'Slow',
          healthy: true
        };
      }
    } catch (error) {
      logger.error('Database health check failed:', error);
      health.database = {
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        healthy: false
      };
    }

    // Check Storage Health (Supabase Storage)
    try {
      const { data: buckets, error: storageError } = await supabase
        .storage
        .listBuckets();
      
      if (storageError) {
        health.storage = {
          status: 'Error',
          message: storageError.message || 'Access failed',
          healthy: false
        };
      } else {
        health.storage = {
          status: 'Available',
          message: `${buckets?.length || 0} buckets`,
          healthy: true
        };
      }
    } catch (error) {
      logger.error('Storage health check failed:', error);
      health.storage = {
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        healthy: false
      };
    }

    // Check API Health (test database connection as API health indicator)
    try {
      const apiStartTime = Date.now();
      // Test a simple query to verify API is working
      const { error: apiTestError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      const apiResponseTime = Date.now() - apiStartTime;
      
      if (apiTestError) {
        health.api = {
          status: 'Degraded',
          message: apiTestError.message || 'Connection issue',
          healthy: false
        };
      } else {
        health.api = {
          status: 'Normal',
          message: apiResponseTime < 200 ? 'Fast' : apiResponseTime < 500 ? 'Normal' : 'Slow',
          healthy: true
        };
      }
    } catch (error) {
      logger.error('API health check failed:', error);
      health.api = {
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        healthy: false
      };
    }

    // Check Errors in last 24 hours
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      // Check for error-level activity logs
      const { count: errorCount } = await supabase
        .from('user_activity')
        .select('id', { count: 'exact', head: true })
        .eq('activity_type', 'error')
        .gte('created_at', twentyFourHoursAgo);
      
      health.errors24h = {
        count: errorCount || 0,
        healthy: (errorCount || 0) === 0
      };
    } catch (error) {
      logger.error('Error count check failed:', error);
      health.errors24h = {
        count: 0,
        healthy: true // Assume healthy if we can't check
      };
    }

    return new Response(JSON.stringify({ 
      health,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=30' // Cache for 30 seconds
      }
    });

  } catch (error) {
    logger.error('System health check API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      health: {
        database: { status: 'Unknown', message: 'Check failed', healthy: false },
        storage: { status: 'Unknown', message: 'Check failed', healthy: false },
        api: { status: 'Unknown', message: 'Check failed', healthy: false },
        errors24h: { count: 0, healthy: true }
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

