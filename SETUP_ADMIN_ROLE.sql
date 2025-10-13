-- Setup admin role for asjames18@proton.me
-- Run this in Supabase SQL Editor

-- First, make sure the user_roles table exists
CREATE TABLE IF NOT EXISTS public.user_roles(
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  PRIMARY KEY(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "user_roles: read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles: admin manage all" ON public.user_roles;

-- Create a policy that allows users to read their own roles
CREATE POLICY "user_roles: read own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows admins to manage all roles
CREATE POLICY "user_roles: admin manage all" ON public.user_roles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert admin role for your user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'asjames18@proton.me'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the setup
SELECT 
  u.email,
  ur.role,
  p.display_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'asjames18@proton.me';
