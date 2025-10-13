import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase-admin';

export const GET: APIRoute = async () => {
  try {
    console.log('Testing database connection...');
    
    // Check environment variables first
    const envCheck = {
      PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
      hasPublicUrl: !!(process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL),
      hasServiceKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY)
    };
    
    console.log('Environment check:', envCheck);
    
    if (!envCheck.hasPublicUrl || !envCheck.hasServiceKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing environment variables',
        envCheck
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const supabase = supabaseAdmin();
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('content')
      .select('id, title')
      .limit(1);
    
    if (testError) {
      console.error('Database test error:', testError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: testError.message,
        details: testError
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Test content count
    const { count, error: countError } = await supabase
      .from('content')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count error:', countError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: countError.message,
        details: countError
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Database connection successful',
      contentCount: count,
      sampleData: testData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
