-- PART 2: Enhanced Database Schema for Custom CMS
-- Run this SECOND in Supabase SQL Editor (after running PART 1)
-- This creates all the new CMS tables and relationships

-- Drop existing content tables if they exist (to start fresh)
DROP TABLE IF EXISTS public.content_versions CASCADE;
DROP TABLE IF EXISTS public.content_media CASCADE;
DROP TABLE IF EXISTS public.media_library CASCADE;
DROP TABLE IF EXISTS public.content_activities CASCADE;
DROP TABLE IF EXISTS public.content_schedules CASCADE;
DROP TABLE IF EXISTS public.content_tags CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.content CASCADE;

-- Create content types enum
CREATE TYPE public.content_type AS ENUM ('blog', 'video', 'book', 'music');
CREATE TYPE public.content_status AS ENUM ('draft', 'review', 'published', 'archived');
CREATE TYPE public.media_type AS ENUM ('image', 'video', 'audio', 'document');

-- Main content table (replaces separate blog/video/book/music tables)
CREATE TABLE public.content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content_type public.content_type NOT NULL,
  status public.content_status DEFAULT 'draft',
  featured boolean DEFAULT false,
  
  -- Content fields
  summary text,
  body_md text,
  body_html text,
  
  -- Metadata
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  scheduled_at timestamptz,
  
  -- SEO
  seo_title text,
  seo_description text,
  seo_keywords text[],
  
  -- Type-specific fields (JSON for flexibility)
  metadata jsonb DEFAULT '{}',
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT content_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT content_published_check CHECK (
    (status = 'published' AND published_at IS NOT NULL) OR 
    (status != 'published')
  )
);

-- Tags table
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT tags_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Content-Tags relationship
CREATE TABLE public.content_tags (
  content_id uuid REFERENCES public.content(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- Media library
CREATE TABLE public.media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  media_type public.media_type NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  width integer,
  height integer,
  duration integer, -- in seconds for video/audio
  
  -- Metadata
  alt_text text,
  caption text,
  description text,
  
  -- Organization
  folder_path text DEFAULT '/',
  tags text[],
  
  -- Upload info
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT media_file_size_positive CHECK (file_size > 0)
);

-- Content-Media relationship
CREATE TABLE public.content_media (
  content_id uuid REFERENCES public.content(id) ON DELETE CASCADE,
  media_id uuid REFERENCES public.media_library(id) ON DELETE CASCADE,
  relationship_type text DEFAULT 'featured', -- 'featured', 'gallery', 'attachment'
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  PRIMARY KEY (content_id, media_id, relationship_type)
);

-- Content versions (for history/rollback)
CREATE TABLE public.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES public.content(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  title text NOT NULL,
  body_md text,
  body_html text,
  metadata jsonb DEFAULT '{}',
  status public.content_status,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(content_id, version_number)
);

-- Content scheduling
CREATE TABLE public.content_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES public.content(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  action text NOT NULL, -- 'publish', 'unpublish', 'archive'
  status text DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Activity log
CREATE TABLE public.content_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES public.content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL, -- 'created', 'updated', 'published', 'deleted', etc.
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_content_type ON public.content(content_type);
CREATE INDEX idx_content_status ON public.content(status);
CREATE INDEX idx_content_published_at ON public.content(published_at);
CREATE INDEX idx_content_featured ON public.content(featured);
CREATE INDEX idx_content_author ON public.content(author_id);
CREATE INDEX idx_content_slug ON public.content(slug);

CREATE INDEX idx_media_type ON public.media_library(media_type);
CREATE INDEX idx_media_folder ON public.media_library(folder_path);
CREATE INDEX idx_media_uploaded_by ON public.media_library(uploaded_by);

CREATE INDEX idx_content_tags_content ON public.content_tags(content_id);
CREATE INDEX idx_content_tags_tag ON public.content_tags(tag_id);

CREATE INDEX idx_content_versions_content ON public.content_versions(content_id);
CREATE INDEX idx_content_versions_number ON public.content_versions(version_number);

CREATE INDEX idx_schedules_scheduled_at ON public.content_schedules(scheduled_at);
CREATE INDEX idx_schedules_status ON public.content_schedules(status);

CREATE INDEX idx_activities_content ON public.content_activities(content_id);
CREATE INDEX idx_activities_user ON public.content_activities(user_id);
CREATE INDEX idx_activities_created_at ON public.content_activities(created_at);

-- Row Level Security
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content
CREATE POLICY "content: public read published" ON public.content
FOR SELECT USING (status = 'published');

CREATE POLICY "content: authenticated read own" ON public.content
FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "content: editors read all" ON public.content
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "content: editors write" ON public.content
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for tags
CREATE POLICY "tags: public read" ON public.tags
FOR SELECT USING (true);

CREATE POLICY "tags: editors write" ON public.tags
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for content_tags
CREATE POLICY "content_tags: public read" ON public.content_tags
FOR SELECT USING (true);

CREATE POLICY "content_tags: editors write" ON public.content_tags
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for media_library
CREATE POLICY "media: public read" ON public.media_library
FOR SELECT USING (true);

CREATE POLICY "media: editors write" ON public.media_library
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for content_media
CREATE POLICY "content_media: public read" ON public.content_media
FOR SELECT USING (true);

CREATE POLICY "content_media: editors write" ON public.content_media
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for content_versions
CREATE POLICY "content_versions: editors read" ON public.content_versions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "content_versions: editors write" ON public.content_versions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for content_schedules
CREATE POLICY "content_schedules: editors read" ON public.content_schedules
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "content_schedules: editors write" ON public.content_schedules
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for content_activities
CREATE POLICY "content_activities: editors read" ON public.content_activities
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "content_activities: editors write" ON public.content_activities
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION public.update_content_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.update_content_updated_at();

-- Function to create content version on update
CREATE OR REPLACE FUNCTION public.create_content_version()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  next_version integer;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version
  FROM public.content_versions 
  WHERE content_id = NEW.id;
  
  -- Create version record
  INSERT INTO public.content_versions (
    content_id, version_number, title, body_md, body_html, 
    metadata, status, created_by
  ) VALUES (
    NEW.id, next_version, OLD.title, OLD.body_md, OLD.body_html,
    OLD.metadata, OLD.status, auth.uid()
  );
  
  RETURN NEW;
END;
$$;

-- Trigger to create version on content update
CREATE TRIGGER content_version_trigger
  BEFORE UPDATE ON public.content
  FOR EACH ROW 
  WHEN (OLD.title IS DISTINCT FROM NEW.title OR 
        OLD.body_md IS DISTINCT FROM NEW.body_md OR 
        OLD.body_html IS DISTINCT FROM NEW.body_html OR
        OLD.metadata IS DISTINCT FROM NEW.metadata)
  EXECUTE FUNCTION public.create_content_version();

-- Function to log content activities
CREATE OR REPLACE FUNCTION public.log_content_activity()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  action_name text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    action_name := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_name := 'updated';
  ELSIF TG_OP = 'DELETE' THEN
    action_name := 'deleted';
  END IF;
  
  INSERT INTO public.content_activities (content_id, user_id, action, details)
  VALUES (
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    action_name,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'title', COALESCE(NEW.title, OLD.title)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to log activities
CREATE TRIGGER content_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.log_content_activity();

-- Insert some default tags
INSERT INTO public.tags (name, slug, color) VALUES
  ('Faith', 'faith', '#3B82F6'),
  ('Walk in the Spirit', 'walk-in-the-spirit', '#10B981'),
  ('Prayer & Fasting', 'prayer-fasting', '#F59E0B'),
  ('Spiritual Warfare', 'spiritual-warfare', '#EF4444'),
  ('End Times', 'end-times', '#8B5CF6'),
  ('Feasts', 'feasts', '#06B6D4'),
  ('Identity & Messiah', 'identity-messiah', '#84CC16'),
  ('Sacred Names', 'sacred-names', '#F97316')
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
