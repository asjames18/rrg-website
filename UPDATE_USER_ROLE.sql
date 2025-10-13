-- Update your user role to admin so you can access the CMS
-- Run this in Supabase SQL Editor

-- Update your specific user to have admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'asjames18@proton.me';

-- Verify the update
SELECT id, email, display_name, role, created_at 
FROM public.profiles 
WHERE email = 'asjames18@proton.me';
