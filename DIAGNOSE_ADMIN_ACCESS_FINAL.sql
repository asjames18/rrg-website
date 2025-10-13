-- Final Admin Access Diagnosis and Fix
-- Run this in Supabase SQL Editor

-- 1. Check if the user exists in auth.users
SELECT 'Auth User Check:' as check_type, id, email, created_at 
FROM auth.users 
WHERE email = 'asjames18@proton.me';

-- 2. Check if the user has a profile and its role
SELECT 'Profile Check:' as check_type, id, email, display_name, role, created_at 
FROM public.profiles 
WHERE email = 'asjames18@proton.me';

-- 3. Check if the user has admin role in user_roles table
SELECT 'User Role Check:' as check_type, ur.user_id, ur.role, p.email
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE p.email = 'asjames18@proton.me';

-- 4. Check RLS status on both tables
SELECT 'RLS Status:' as check_type, schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('profiles', 'user_roles');

-- 5. If user exists but no role, set admin role
DO $$ 
BEGIN
    -- First, ensure the user has a profile
    INSERT INTO public.profiles (id, email, display_name, role)
    SELECT u.id, u.email, u.raw_user_meta_data->>'full_name', 'admin'
    FROM auth.users u
    WHERE u.email = 'asjames18@proton.me'
    AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id)
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    
    -- Also ensure they have an entry in user_roles
    INSERT INTO public.user_roles (user_id, role)
    SELECT u.id, 'admin'
    FROM auth.users u
    WHERE u.email = 'asjames18@proton.me'
    AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = u.id)
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
END $$;

-- 6. Verify the final state
SELECT 'Final Profile State:' as check_type, id, email, role FROM public.profiles WHERE email = 'asjames18@proton.me';
SELECT 'Final User Role State:' as check_type, user_id, role FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'asjames18@proton.me');

-- 7. Test API access with explicit permissions
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO anon;
GRANT SELECT ON public.user_roles TO authenticated;

-- 8. Create simple RLS policies that work
DROP POLICY IF EXISTS "profiles: allow authenticated read" ON public.profiles;
DROP POLICY IF EXISTS "user_roles: allow authenticated read" ON public.user_roles;

CREATE POLICY "profiles: allow authenticated read" ON public.profiles
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "user_roles: allow authenticated read" ON public.user_roles
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 9. Final test
SELECT 'API Test - Should work now:' as test_type, id, email, role
FROM public.profiles 
WHERE email = 'asjames18@proton.me';
