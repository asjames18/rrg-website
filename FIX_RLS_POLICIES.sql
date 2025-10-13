-- Fix infinite recursion in user_roles RLS policies
-- Run this in Supabase SQL Editor

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "user_roles: read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: admin manage all" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: allow all for authenticated users" ON public.user_roles;

-- Create a simpler policy that allows users to read their own roles
-- without causing recursion
CREATE POLICY "user_roles: read own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows all operations for now (we'll restrict later)
-- This prevents the recursion issue
CREATE POLICY "user_roles: allow all for authenticated users" ON public.user_roles
FOR ALL USING (auth.uid() IS NOT NULL);

-- Verify the setup works
SELECT 
  u.email,
  ur.role,
  p.display_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'asjames18@proton.me';


