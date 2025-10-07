/**
 * Supabase Client Configuration
 * 
 * Browser client for public operations (auth, reading published content)
 */
import { createClient } from '@supabase/supabase-js';
export { getSupabase } from './supabase-browser';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// Singleton pattern to prevent multiple instances (shared on window)
let supabaseInstance: any = null;

export const supabase = (() => {
  if (typeof window === 'undefined') return null;
  // Reuse if one already exists on window
  const existing = (window as any).__supabaseClient;
  if (existing) {
    supabaseInstance = existing;
    return supabaseInstance;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    (window as any).__supabaseClient = supabaseInstance;
  }
  return supabaseInstance;
})();

/**
 * Database Types
 * These match your Supabase schema
 */
export type Profile = {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  body_md?: string;
  tags: string[];
  published: boolean;
  published_at?: string;
  author?: string;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  title: string;
  slug: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook';
  video_id: string;
  series: string[];
  topics: string[];
  scriptures: string[];
  notes_md?: string;
  published: boolean;
  published_at?: string;
  author?: string;
  created_at: string;
  updated_at: string;
};

export type Book = {
  id: string;
  title: string;
  slug: string;
  author_name?: string;
  affiliate_label?: string;
  affiliate_url?: string;
  affiliate_merchant?: string;
  topics: string[];
  body_md?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Music = {
  id: string;
  title: string;
  slug: string;
  type: 'audio' | 'video';
  audio_src?: string;
  platform?: string;
  video_id?: string;
  scriptures: string[];
  notes_md?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

