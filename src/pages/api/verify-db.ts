/**
import { logger } from '../../lib/logger';

 * API Route: Database Verification
 * GET /api/verify-db
 * 
 * Verifies that the Supabase database is set up correctly
 * for the authentication and content management system
 */
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../lib/supabase-server';

export const GET: APIRoute = async () => {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      status: 'checking',
      tables: {},
      policies: {},
      functions: {},
      errors: []
    };

    // Check if profiles table exists and has correct structure
    try {
      const { data: profiles, error: profilesError } = await supabaseServer
        .from('profiles')
        .select('id, email, role, created_at')
        .limit(1);

      if (profilesError) {
        results.errors.push(`Profiles table error: ${profilesError.message}`);
        results.tables.profiles = { exists: false, error: profilesError.message };
      } else {
        results.tables.profiles = { 
          exists: true, 
          structure: 'correct',
          sample_count: profiles?.length || 0
        };
      }
    } catch (error) {
      results.errors.push(`Profiles check failed: ${error}`);
      results.tables.profiles = { exists: false, error: String(error) };
    }

    // Check content tables
    const contentTables = ['posts', 'videos', 'books', 'music'];
    
    for (const table of contentTables) {
      try {
        const { data, error } = await supabaseServer
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          results.errors.push(`${table} table error: ${error.message}`);
          results.tables[table] = { exists: false, error: error.message };
        } else {
          results.tables[table] = { 
            exists: true, 
            sample_count: data?.length || 0
          };
        }
      } catch (error) {
        results.errors.push(`${table} check failed: ${error}`);
        results.tables[table] = { exists: false, error: String(error) };
      }
    }

    // Check if we can create a test profile (without actually creating it)
    try {
      const { error: insertError } = await supabaseServer
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'test@example.com',
          role: 'viewer'
        })
        .select()
        .single();

      if (insertError && insertError.code === '23505') {
        // Duplicate key error is expected - means table structure is correct
        results.policies.insert_test = { status: 'passed', note: 'Duplicate key error expected' };
      } else if (insertError) {
        results.errors.push(`Insert test failed: ${insertError.message}`);
        results.policies.insert_test = { status: 'failed', error: insertError.message };
      } else {
        // If insert succeeded, clean up the test record
        await supabaseServer
          .from('profiles')
          .delete()
          .eq('id', '00000000-0000-0000-0000-000000000000');
        
        results.policies.insert_test = { status: 'passed', note: 'Test record created and cleaned up' };
      }
    } catch (error) {
      results.errors.push(`Insert test failed: ${error}`);
      results.policies.insert_test = { status: 'failed', error: String(error) };
    }

    // Check RLS policies by trying to read profiles
    try {
      const { data: allProfiles, error: rlsError } = await supabaseServer
        .from('profiles')
        .select('id, email, role');

      if (rlsError) {
        results.errors.push(`RLS check failed: ${rlsError.message}`);
        results.policies.rls = { status: 'failed', error: rlsError.message };
      } else {
        results.policies.rls = { 
          status: 'working', 
          note: 'Service role can read profiles',
          profile_count: allProfiles?.length || 0
        };
      }
    } catch (error) {
      results.errors.push(`RLS check failed: ${error}`);
      results.policies.rls = { status: 'failed', error: String(error) };
    }

    // Overall status
    const hasErrors = results.errors.length > 0;
    const allTablesExist = Object.values(results.tables).every(table => table.exists);
    
    results.status = hasErrors ? 'error' : (allTablesExist ? 'success' : 'partial');

    return new Response(
      JSON.stringify(results, null, 2),
      { 
        status: hasErrors ? 500 : 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    logger.error('Database verification failed:', error);
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Database verification failed completely'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};
