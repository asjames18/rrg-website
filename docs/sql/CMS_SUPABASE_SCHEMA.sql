-- CMS Supabase Database Schema
-- Run this in Supabase SQL Editor to create the CMS tables

-- 1. Content Types Enum (create only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
        CREATE TYPE content_type AS ENUM ('blog', 'video', 'book', 'music');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
        CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
        CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document');
    END IF;
END $$;

-- 2. Content Table
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_type content_type NOT NULL,
  status content_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  summary TEXT,
  body_md TEXT,
  body_html TEXT,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tags Table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add description column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tags' AND column_name = 'description') THEN
        ALTER TABLE tags ADD COLUMN description TEXT;
    END IF;
END $$;

-- 4. Content Tags Junction Table
CREATE TABLE IF NOT EXISTS content_tags (
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- 5. Media Library Table
CREATE TABLE IF NOT EXISTS media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  media_type media_type NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for video/audio
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  folder_path TEXT DEFAULT '/',
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Content Media Junction Table
CREATE TABLE IF NOT EXISTS content_media (
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  media_id UUID REFERENCES media_library(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, media_id)
);

-- 7. Content Activities Table (for activity log)
CREATE TABLE IF NOT EXISTS content_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL, -- 'created', 'updated', 'published', 'archived'
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Content Schedules Table (for scheduled publishing)
CREATE TABLE IF NOT EXISTS content_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'publish', 'feature', 'archive'
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_published_at ON content(published_at);
CREATE INDEX IF NOT EXISTS idx_content_author ON content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_media_type ON media_library(media_type);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media_library(folder_path);
CREATE INDEX IF NOT EXISTS idx_activities_content ON content_activities(content_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON content_activities(user_id);

-- 10. Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedules ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS Policies (drop existing first to avoid conflicts)
-- Drop existing policies
DROP POLICY IF EXISTS "content: authenticated read" ON content;
DROP POLICY IF EXISTS "content: admin manage" ON content;
DROP POLICY IF EXISTS "tags: authenticated read" ON tags;
DROP POLICY IF EXISTS "tags: admin manage" ON tags;
DROP POLICY IF EXISTS "media: authenticated read" ON media_library;
DROP POLICY IF EXISTS "media: admin manage" ON media_library;
DROP POLICY IF EXISTS "content_tags: admin manage" ON content_tags;
DROP POLICY IF EXISTS "content_media: admin manage" ON content_media;
DROP POLICY IF EXISTS "activities: admin read" ON content_activities;
DROP POLICY IF EXISTS "activities: admin manage" ON content_activities;
DROP POLICY IF EXISTS "schedules: admin manage" ON content_schedules;

-- Content policies
CREATE POLICY "content: authenticated read" ON content
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "content: admin manage" ON content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Tags policies
CREATE POLICY "tags: authenticated read" ON tags
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "tags: admin manage" ON tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Media policies
CREATE POLICY "media: authenticated read" ON media_library
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "media: admin manage" ON media_library
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Junction table policies
CREATE POLICY "content_tags: admin manage" ON content_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "content_media: admin manage" ON content_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Activities policies
CREATE POLICY "activities: admin read" ON content_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "activities: admin manage" ON content_activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Schedules policies
CREATE POLICY "schedules: admin manage" ON content_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- 12. Grant API permissions
GRANT SELECT ON content TO anon;
GRANT SELECT ON content TO authenticated;
GRANT SELECT ON tags TO anon;
GRANT SELECT ON tags TO authenticated;
GRANT SELECT ON media_library TO anon;
GRANT SELECT ON media_library TO authenticated;

-- 13. Create functions for common operations
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Create triggers
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_content_updated_at();

-- 15. Insert some sample tags
INSERT INTO tags (name, slug, color, description) VALUES
  ('End Times', 'end-times', '#EF4444', 'Content about end times prophecy'),
  ('Spiritual Warfare', 'spiritual-warfare', '#8B5CF6', 'Content about spiritual warfare'),
  ('Hebrew Roots', 'hebrew-roots', '#F59E0B', 'Content about Hebrew roots of Christianity'),
  ('Worship', 'worship', '#10B981', 'Worship and music content'),
  ('Teaching', 'teaching', '#3B82F6', 'Educational content')
ON CONFLICT (slug) DO NOTHING;

-- 16. Verify the setup
SELECT 'CMS Schema Created Successfully' as status;
SELECT 'Tables created:' as info, count(*) as count FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('content', 'tags', 'media_library', 'content_activities', 'content_schedules');
