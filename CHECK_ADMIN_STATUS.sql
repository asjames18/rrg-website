-- Check and fix admin status for asjames18@proton.me
-- Run this in Supabase SQL Editor

-- First, check if the user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'asjames18@proton.me';

-- Check if the user has a profile
SELECT id, email, display_name, created_at 
FROM public.profiles 
WHERE email = 'asjames18@proton.me';

-- Check if the user has admin role in user_roles table
SELECT ur.user_id, ur.role, p.email
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE p.email = 'asjames18@proton.me';

-- If the user doesn't have admin role, add it
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'asjames18@proton.me'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the admin status using the is_admin function
SELECT public.is_admin(
  (SELECT id FROM auth.users WHERE email = 'asjames18@proton.me')
) as is_admin_status;


