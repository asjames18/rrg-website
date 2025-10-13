-- PART 1: Update existing app_role enum
-- Run this FIRST in Supabase SQL Editor

-- Add 'editor' value to existing app_role enum
ALTER TYPE public.app_role ADD VALUE 'editor';
