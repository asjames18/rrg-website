-- EMERGENCY FIX: Temporarily disable RLS to get admin page working
-- Run this in Supabase SQL Editor

-- Completely disable RLS on both tables temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop ALL policies to ensure no conflicts
DROP POLICY IF EXISTS "user_roles: admin only" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: allow all for authenticated users" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: admin manage all" ON public.user_roles;

DROP POLICY IF EXISTS "profiles: read own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin read all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin update all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin manage all" ON public.profiles;

-- Test that we can now access the data
SELECT 'User roles test:' as test_type, ur.user_id, ur.role, p.email
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE p.email = 'asjames18@proton.me';

SELECT 'Profiles test:' as test_type, id, email, role
FROM public.profiles 
WHERE email = 'asjames18@proton.me';

-- Verify RLS is disabled
SELECT 'RLS Status:' as test_type, schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'user_roles') AND schemaname = 'public';
