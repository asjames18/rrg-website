-- Fix profiles table by adding the role column
-- Run this in Supabase SQL Editor

-- First, check if the app_role enum exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'editor');
    ELSE
        -- Add 'editor' to existing enum if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'editor' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
            ALTER TYPE public.app_role ADD VALUE 'editor';
        END IF;
    END IF;
END $$;

-- Add role column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role public.app_role DEFAULT 'user';
    END IF;
END $$;

-- Update existing users to have 'admin' role (you can change this as needed)
UPDATE public.profiles 
SET role = 'admin' 
WHERE role IS NULL OR role = 'user';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
