-- Fix RLS policies for profiles table to resolve 406 errors
-- Run this in Supabase SQL Editor

-- Drop existing problematic policies
DROP POLICY IF EXISTS "profiles: read own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin manage all" ON public.profiles;

-- Create new, simpler policies that work
-- Allow users to read their own profile
CREATE POLICY "profiles: read own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "profiles: update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "profiles: insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow admins to read all profiles (for admin functionality)
CREATE POLICY "profiles: admin read all" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- Allow admins to update all profiles
CREATE POLICY "profiles: admin update all" ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Test the policies work
SELECT 
  p.id,
  p.email,
  p.display_name,
  p.role,
  ur.role as user_role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
WHERE p.email = 'asjames18@proton.me';
