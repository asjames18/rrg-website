-- Fix conflicting RLS policies that are causing 406 errors
-- Run this in Supabase SQL Editor

-- Drop ALL existing policies to start completely fresh
DROP POLICY IF EXISTS "user_roles: admin only" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: allow all for authenticated users" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: admin manage all" ON public.user_roles;

-- Drop all existing profiles policies too
DROP POLICY IF EXISTS "profiles: read own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin read all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin update all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin manage all" ON public.profiles;

-- Create simple, non-conflicting policies for user_roles
CREATE POLICY "user_roles: read own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_roles: allow all for authenticated users" ON public.user_roles
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create simple, non-conflicting policies for profiles
CREATE POLICY "profiles: read own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles: insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow admins to read all profiles (using a simple role check)
CREATE POLICY "profiles: admin read all" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Test the setup
SELECT 'Test user_roles access:' as test_type, ur.user_id, ur.role, p.email
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE p.email = 'asjames18@proton.me';

SELECT 'Test profiles access:' as test_type, id, email, role
FROM public.profiles 
WHERE email = 'asjames18@proton.me';
