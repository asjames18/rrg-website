-- =====================================================
-- Admin Dashboard & Content Management Enhancements
-- =====================================================
-- Run this in your Supabase SQL Editor
-- Adds content analytics, workflow states, and system settings

-- 1. Create content_analytics table for tracking views and engagement
CREATE TABLE IF NOT EXISTS content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog', 'video', 'book', 'music')),
  views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  avg_time_on_page INT DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, content_type, date)
);

CREATE INDEX IF NOT EXISTS idx_content_analytics_content ON content_analytics(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_analytics_date ON content_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_content_analytics_views ON content_analytics(views DESC);

-- Enable RLS
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all analytics
CREATE POLICY "Admins can read all analytics"
  ON content_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: System can insert analytics
CREATE POLICY "Authenticated users can insert analytics"
  ON content_analytics FOR INSERT
  WITH CHECK (true);

-- 2. Add workflow states to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS workflow_state TEXT DEFAULT 'draft' 
  CHECK (workflow_state IN ('draft', 'review', 'published', 'archived'));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Add workflow states to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS workflow_state TEXT DEFAULT 'draft' 
  CHECK (workflow_state IN ('draft', 'review', 'published', 'archived'));
ALTER TABLE videos ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Add workflow states to books table  
ALTER TABLE books ADD COLUMN IF NOT EXISTS workflow_state TEXT DEFAULT 'draft' 
  CHECK (workflow_state IN ('draft', 'review', 'published', 'archived'));
ALTER TABLE books ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);
ALTER TABLE books ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id);
ALTER TABLE books ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Add workflow states to music table
ALTER TABLE music ADD COLUMN IF NOT EXISTS workflow_state TEXT DEFAULT 'draft' 
  CHECK (workflow_state IN ('draft', 'review', 'published', 'archived'));
ALTER TABLE music ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);
ALTER TABLE music ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE music ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id);
ALTER TABLE music ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for workflow queries
CREATE INDEX IF NOT EXISTS idx_posts_workflow_state ON posts(workflow_state);
CREATE INDEX IF NOT EXISTS idx_videos_workflow_state ON videos(workflow_state);
CREATE INDEX IF NOT EXISTS idx_books_workflow_state ON books(workflow_state);
CREATE INDEX IF NOT EXISTS idx_music_workflow_state ON music(workflow_state);

-- 3. Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'email', 'features', 'seo', 'content')),
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read settings
CREATE POLICY "Admins can read settings"
  ON system_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update settings
CREATE POLICY "Admins can update settings"
  ON system_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default settings
INSERT INTO system_settings (key, value, category, description) VALUES
  ('site_name', '"Real & Raw Gospel"', 'general', 'Site name displayed in header'),
  ('site_tagline', '"Training the Remnant"', 'general', 'Site tagline'),
  ('contact_email', '"contact@realandrawgospel.com"', 'general', 'Primary contact email'),
  ('timezone', '"America/New_York"', 'general', 'Site timezone'),
  ('enable_comments', 'false', 'features', 'Enable comments on blog posts'),
  ('enable_registration', 'true', 'features', 'Allow new user registration'),
  ('maintenance_mode', 'false', 'features', 'Enable maintenance mode'),
  ('default_meta_description', '"Real & Raw Gospel - Training the remnant in the ways of YAHUAH"', 'seo', 'Default meta description'),
  ('content_approval_required', 'false', 'content', 'Require admin approval before publishing'),
  ('autosave_interval', '30', 'content', 'Auto-save interval in seconds'),
  ('max_upload_size', '10485760', 'content', 'Maximum file upload size in bytes (10MB)')
ON CONFLICT (key) DO NOTHING;

-- 4. Create workflow history table for audit trail
CREATE TABLE IF NOT EXISTS workflow_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  from_state TEXT,
  to_state TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_history_content ON workflow_history(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_workflow_history_created ON workflow_history(created_at DESC);

-- Enable RLS
ALTER TABLE workflow_history ENABLE ROW LEVEL SECURITY;

-- Policy: Admins and editors can read workflow history
CREATE POLICY "Editors can read workflow history"
  ON workflow_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Policy: Authenticated users can insert workflow history
CREATE POLICY "Authenticated can insert workflow history"
  ON workflow_history FOR INSERT
  WITH CHECK (auth.uid() = changed_by);

-- 5. Create function to track content analytics
CREATE OR REPLACE FUNCTION track_content_view(
  p_content_id TEXT,
  p_content_type TEXT,
  p_time_on_page INT DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO content_analytics (content_id, content_type, views, date)
  VALUES (p_content_id, p_content_type, 1, CURRENT_DATE)
  ON CONFLICT (content_id, content_type, date)
  DO UPDATE SET 
    views = content_analytics.views + 1,
    avg_time_on_page = (content_analytics.avg_time_on_page * content_analytics.views + p_time_on_page) / (content_analytics.views + 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_content', (
      SELECT COUNT(*) FROM (
        SELECT id FROM posts WHERE workflow_state = 'published'
        UNION ALL
        SELECT id FROM videos WHERE workflow_state = 'published'
        UNION ALL
        SELECT id FROM books WHERE workflow_state = 'published'
        UNION ALL
        SELECT id FROM music WHERE workflow_state = 'published'
      ) AS all_content
    ),
    'total_users', (SELECT COUNT(*) FROM profiles),
    'total_activity_30d', (
      SELECT COUNT(*) 
      FROM user_activity 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    ),
    'content_by_type', (
      SELECT json_build_object(
        'blog', (SELECT COUNT(*) FROM posts WHERE workflow_state = 'published'),
        'videos', (SELECT COUNT(*) FROM videos WHERE workflow_state = 'published'),
        'books', (SELECT COUNT(*) FROM books WHERE workflow_state = 'published'),
        'music', (SELECT COUNT(*) FROM music WHERE workflow_state = 'published')
      )
    ),
    'recent_activity', (
      SELECT json_agg(
        json_build_object(
          'id', id,
          'activity_type', activity_type,
          'description', description,
          'created_at', created_at
        )
      )
      FROM (
        SELECT * FROM user_activity
        ORDER BY created_at DESC
        LIMIT 10
      ) AS recent
    )
  )
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION track_content_view(TEXT, TEXT, INT) TO authenticated;

-- 7. Create view for trending content
CREATE OR REPLACE VIEW trending_content AS
SELECT 
  ca.content_id,
  ca.content_type,
  SUM(ca.views) as total_views,
  SUM(ca.unique_visitors) as total_visitors,
  AVG(ca.avg_time_on_page) as avg_engagement
FROM content_analytics ca
WHERE ca.date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY ca.content_id, ca.content_type
ORDER BY total_views DESC
LIMIT 20;

GRANT SELECT ON trending_content TO authenticated;

-- =====================================================
-- Migration Complete!
-- =====================================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Verify tables were created in the Table Editor
-- 3. Test that RLS policies work correctly
-- =====================================================

