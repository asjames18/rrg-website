-- FINAL ADMIN PORTAL FIX
-- Run this in Supabase SQL Editor to fix all admin portal issues

-- 1. Ensure the user exists and has proper role
DO $$ 
BEGIN
    -- First, ensure the user has a profile with admin role
    INSERT INTO public.profiles (id, email, display_name, role)
    SELECT u.id, u.email, u.raw_user_meta_data->>'full_name', 'admin'
    FROM auth.users u
    WHERE u.email = 'asjames18@proton.me'
    AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id)
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    
    -- Also ensure they have an entry in user_roles (without ON CONFLICT since no unique constraint)
    INSERT INTO public.user_roles (user_id, role)
    SELECT u.id, 'admin'
    FROM auth.users u
    WHERE u.email = 'asjames18@proton.me'
    AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = u.id);
    
    -- Update existing user_roles entry if it exists
    UPDATE public.user_roles 
    SET role = 'admin' 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'asjames18@proton.me');
END $$;

-- 2. Grant explicit API permissions
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO anon;
GRANT SELECT ON public.user_roles TO authenticated;

-- 3. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "profiles: read own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin read all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin update all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: allow authenticated read" ON public.profiles;

DROP POLICY IF EXISTS "user_roles: read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: admin manage all" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: allow all for authenticated users" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: admin only" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: allow authenticated read" ON public.user_roles;

-- 4. Create simple, working RLS policies
-- Profiles table policies
CREATE POLICY "profiles: allow authenticated read" ON public.profiles
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "profiles: allow authenticated update own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles: allow authenticated insert own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles table policies
CREATE POLICY "user_roles: allow authenticated read" ON public.user_roles
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "user_roles: allow authenticated all" ON public.user_roles
FOR ALL USING (auth.uid() IS NOT NULL);

-- 5. Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 6. Test the setup
SELECT 'User Profile Test:' as test_type, id, email, role FROM public.profiles WHERE email = 'asjames18@proton.me';
SELECT 'User Roles Test:' as test_type, user_id, role FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'asjames18@proton.me');

-- 7. Verify RLS status
SELECT 'RLS Status:' as test_type, schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('profiles', 'user_roles');

-- 8. Show current policies
SELECT 'Current Policies:' as test_type, schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('profiles', 'user_roles');
