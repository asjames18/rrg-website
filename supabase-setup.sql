-- =====================================================
-- Real & Raw Gospel - Supabase Database Setup
-- =====================================================
-- This SQL file sets up all necessary tables, policies, and functions
-- for the authentication and content management system.

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
-- User profiles with role-based access control

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ADD MISSING COLUMNS (if tables exist with different schema)
-- =====================================================

-- Add missing columns to existing tables if they don't exist
DO $$
BEGIN
    -- Add published_at to posts if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts' AND table_schema = 'public') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'published_at') THEN
            ALTER TABLE public.posts ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'published') THEN
            ALTER TABLE public.posts ADD COLUMN published BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'author') THEN
            ALTER TABLE public.posts ADD COLUMN author UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
        END IF;
    END IF;

    -- Add missing columns to videos
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'videos' AND table_schema = 'public') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'published_at') THEN
            ALTER TABLE public.videos ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'published') THEN
            ALTER TABLE public.videos ADD COLUMN published BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'author') THEN
            ALTER TABLE public.videos ADD COLUMN author UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
        END IF;
    END IF;

    -- Add missing columns to books
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'books' AND table_schema = 'public') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'published_at') THEN
            ALTER TABLE public.books ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'published') THEN
            ALTER TABLE public.books ADD COLUMN published BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'author') THEN
            ALTER TABLE public.books ADD COLUMN author UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
        END IF;
    END IF;

    -- Add missing columns to music
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'music' AND table_schema = 'public') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'music' AND column_name = 'published_at') THEN
            ALTER TABLE public.music ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'music' AND column_name = 'published') THEN
            ALTER TABLE public.music ADD COLUMN published BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'music' AND column_name = 'author') THEN
            ALTER TABLE public.music ADD COLUMN author UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

-- =====================================================
-- 3. CONTENT TABLES
-- =====================================================

-- Blog posts
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    body_md TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('youtube', 'tiktok', 'instagram', 'facebook')),
    video_id TEXT NOT NULL,
    series TEXT[] DEFAULT '{}',
    topics TEXT[] DEFAULT '{}',
    scriptures TEXT[] DEFAULT '{}',
    notes_md TEXT,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books
CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    author_name TEXT NOT NULL,
    affiliate_label TEXT,
    affiliate_url TEXT,
    affiliate_merchant TEXT,
    topics TEXT[] DEFAULT '{}',
    body_md TEXT,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Music
CREATE TABLE IF NOT EXISTS public.music (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('audio', 'video')),
    audio_src TEXT,
    platform TEXT CHECK (platform IN ('youtube', 'tiktok', 'instagram', 'facebook')),
    video_id TEXT,
    scriptures TEXT[] DEFAULT '{}',
    notes_md TEXT,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. PROFILES POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 6. CONTENT POLICIES
-- =====================================================

-- Posts policies
CREATE POLICY "Anyone can read published posts" ON public.posts
    FOR SELECT USING (published = true);

CREATE POLICY "Admins and editors can read all posts" ON public.posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins and editors can insert posts" ON public.posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins and editors can update posts" ON public.posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins and editors can delete posts" ON public.posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Videos policies (same pattern as posts)
CREATE POLICY "Anyone can read published videos" ON public.videos
    FOR SELECT USING (published = true);

CREATE POLICY "Admins and editors can read all videos" ON public.videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins and editors can manage videos" ON public.videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Books policies (same pattern)
CREATE POLICY "Anyone can read published books" ON public.books
    FOR SELECT USING (published = true);

CREATE POLICY "Admins and editors can manage books" ON public.books
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Music policies (same pattern)
CREATE POLICY "Anyone can read published music" ON public.music
    FOR SELECT USING (published = true);

CREATE POLICY "Admins and editors can manage music" ON public.music
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- =====================================================
-- 7. FUNCTIONS
-- =====================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'viewer');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_music_updated_at
    BEFORE UPDATE ON public.music
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 8. INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Content indexes (only create if columns exist)
DO $$
BEGIN
    -- Posts indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'published') THEN
        CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts(published);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'published_at') THEN
        CREATE INDEX IF NOT EXISTS posts_published_at_idx ON public.posts(published_at);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'author') THEN
        CREATE INDEX IF NOT EXISTS posts_author_idx ON public.posts(author);
    END IF;

    -- Videos indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'published') THEN
        CREATE INDEX IF NOT EXISTS videos_published_idx ON public.videos(published);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'published_at') THEN
        CREATE INDEX IF NOT EXISTS videos_published_at_idx ON public.videos(published_at);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'platform') THEN
        CREATE INDEX IF NOT EXISTS videos_platform_idx ON public.videos(platform);
    END IF;

    -- Books indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'published') THEN
        CREATE INDEX IF NOT EXISTS books_published_idx ON public.books(published);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'published_at') THEN
        CREATE INDEX IF NOT EXISTS books_published_at_idx ON public.books(published_at);
    END IF;

    -- Music indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'music' AND column_name = 'published') THEN
        CREATE INDEX IF NOT EXISTS music_published_idx ON public.music(published);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'music' AND column_name = 'published_at') THEN
        CREATE INDEX IF NOT EXISTS music_published_at_idx ON public.music(published_at);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'music' AND column_name = 'type') THEN
        CREATE INDEX IF NOT EXISTS music_type_idx ON public.music(type);
    END IF;
END $$;

-- =====================================================
-- 9. SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert a sample admin user (replace with your email)
-- This is commented out for security - uncomment and modify as needed
/*
INSERT INTO public.profiles (id, email, role)
VALUES (
    '00000000-0000-0000-0000-000000000000', -- Replace with actual UUID
    'admin@example.com', -- Replace with your email
    'admin'
);
*/

-- =====================================================
-- 10. VERIFICATION QUERIES
-- =====================================================

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'posts', 'videos', 'books', 'music');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'posts', 'videos', 'books', 'music');

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your Supabase database is now ready for the Real & Raw Gospel website.
-- 
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Test user registration at /auth
-- 3. Promote your first user to admin using /admin-promote
-- 4. Start creating content!
