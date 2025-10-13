-- Debug database structure and user status
-- Run this in Supabase SQL Editor

-- 1. Check if user_roles table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_roles' 
ORDER BY ordinal_position;

-- 2. Check if app_role type exists
SELECT typname, typtype 
FROM pg_type 
WHERE typname = 'app_role';

-- 3. Check current user
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'asjames18@proton.me';

-- 4. Check profiles table
SELECT id, email, display_name, created_at 
FROM public.profiles 
WHERE email = 'asjames18@proton.me';

-- 5. Check user_roles table
SELECT ur.user_id, ur.role, p.email
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE p.email = 'asjames18@proton.me';

-- 6. Test the is_admin function directly
SELECT public.is_admin('9fa4a8d1-b592-459d-b883-69bb4874cd55'::uuid) as is_admin_result;


