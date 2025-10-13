-- Diagnose admin access issues
-- Run this in Supabase SQL Editor

-- Check if user exists in auth.users
SELECT 'User in auth.users:' as check_type, id, email, created_at 
FROM auth.users 
WHERE email = 'asjames18@proton.me';

-- Check if user has a profile
SELECT 'User profile:' as check_type, id, email, display_name, role, created_at 
FROM public.profiles 
WHERE email = 'asjames18@proton.me';

-- Check if user has admin role in user_roles table
SELECT 'User roles:' as check_type, ur.user_id, ur.role, p.email
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE p.email = 'asjames18@proton.me';

-- Check current RLS policies on profiles table
SELECT 'Profiles RLS policies:' as check_type, schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- Check current RLS policies on user_roles table
SELECT 'User_roles RLS policies:' as check_type, schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'user_roles' AND schemaname = 'public';

-- Test if we can query profiles table directly (this should work if RLS is fixed)
SELECT 'Direct profiles query:' as check_type, id, email, role
FROM public.profiles 
WHERE email = 'asjames18@proton.me';
