-- Fix Supabase API Schema to resolve 406 errors
-- Run this in Supabase SQL Editor

-- Grant explicit permissions to anon role for profiles table
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO authenticated;

-- Grant explicit permissions to anon role for user_roles table  
GRANT SELECT ON public.user_roles TO anon;
GRANT SELECT ON public.user_roles TO authenticated;

-- Ensure the profiles table is accessible via API
-- This makes sure the table is exposed in the PostgREST API
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "profiles: allow authenticated read" ON public.profiles;
DROP POLICY IF EXISTS "user_roles: allow authenticated read" ON public.user_roles;

-- Create a simple policy that allows authenticated users to read profiles
CREATE POLICY "profiles: allow authenticated read" ON public.profiles
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create a simple policy for user_roles
CREATE POLICY "user_roles: allow authenticated read" ON public.user_roles
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Test API access
SELECT 'API Test - Profiles:' as test_type, id, email, role
FROM public.profiles 
WHERE email = 'asjames18@proton.me';

SELECT 'API Test - User Roles:' as test_type, ur.user_id, ur.role, p.email
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE p.email = 'asjames18@proton.me';
