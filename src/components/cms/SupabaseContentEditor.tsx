import React, { useState, useEffect } from 'react';

interface SupabaseContentEditorProps {
  contentId?: string;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

export default function SupabaseContentEditor({ contentId, onSave, onCancel }: SupabaseContentEditorProps) {
  const [content, setContent] = useState<any>({
    title: '',
    slug: '',
    content_type: 'blog',
    status: 'draft',
    featured: false,
    summary: '',
    body_md: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: [],
    metadata: {
      platform: 'youtube',
      videoId: '',
      series: [],
      topics: [],
      scriptures: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (contentId) {
      loadContent();
    }
    loadTags();
  }, [contentId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cms/content/${contentId}`);
      const data = await response.json();
      
      if (response.ok) {
        setContent({
          ...data,
          metadata: data.metadata || {
            platform: 'youtube',
            videoId: '',
            series: [],
            topics: [],
            scriptures: []
          }
        });
        setSelectedTags(data.tags?.map((tag: any) => tag.id) || []);
      } else {
        setError(data.error || 'Failed to load content');
      }
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch('/api/cms/tags');
      const data = await response.json();
      if (response.ok) {
        setTags(data.tags || []);
      }
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const response = await fetch(contentId ? `/api/cms/content/${contentId}` : '/api/cms/content', {
        method: contentId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...content,
          tags: selectedTags
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        onSave?.(data);
      } else {
        setError(data.error || 'Failed to save content');
      }
    } catch (err) {
      setError('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500"></div>
          <div className="text-amber-100 font-medium">Loading content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
      <div className="px-8 py-6 border-b border-neutral-800 bg-neutral-800/50">
        <h3 className="text-lg font-semibold text-amber-100">
          {contentId ? 'Edit Content' : 'Create New Content'}
        </h3>
        <p className="text-neutral-400 text-sm mt-1">
          {contentId ? 'Update your content' : 'Create a new piece of content'}
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-amber-100 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => {
                setContent({...content, title: e.target.value, slug: generateSlug(e.target.value)});
              }}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter content title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-amber-100 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={content.slug}
              onChange={(e) => setContent({...content, slug: e.target.value})}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="url-friendly-slug"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-amber-100 mb-2">
              Content Type *
            </label>
            <select
              value={content.content_type}
              onChange={(e) => setContent({...content, content_type: e.target.value})}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="blog">Blog Post</option>
              <option value="video">Video</option>
              <option value="book">Book</option>
              <option value="music">Music</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-amber-100 mb-2">
              Status *
            </label>
            <select
              value={content.status}
              onChange={(e) => setContent({...content, status: e.target.value})}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={content.featured}
                onChange={(e) => setContent({...content, featured: e.target.checked})}
                className="w-4 h-4 text-amber-600 bg-neutral-800 border-neutral-700 rounded focus:ring-amber-500"
              />
              <span className="text-amber-100 text-sm">Featured</span>
            </label>
          </div>
        </div>

        {/* Music-Specific Fields */}
        {content.content_type === 'music' && (
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-amber-100 mb-4">Music Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Music Type *
                </label>
                <select
                  value={content.metadata?.type || 'audio'}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, type: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="audio">🎵 Audio Track</option>
                  <option value="video">🎬 Music Video</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Audio Source URL
                </label>
                <input
                  type="url"
                  value={content.metadata?.audioSrc || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, audioSrc: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://example.com/audio/song.mp3"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Direct URL to audio file (MP3, WAV, etc.)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Platform (for video music)
                </label>
                <select
                  value={content.metadata?.platform || 'youtube'}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, platform: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Video ID (for video music)
                </label>
                <input
                  type="text"
                  value={content.metadata?.videoId || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, videoId: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Video ID from platform"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Scriptures (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(content.metadata?.scriptures) ? content.metadata.scriptures.join(', ') : (content.metadata?.scriptures || '')}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, scriptures: e.target.value.split(',').map(s => s.trim()).filter(s => s)}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Revelation 12:11, Romans 8:37, 2 Timothy 2:3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Genre/Style
                </label>
                <input
                  type="text"
                  value={content.metadata?.genre || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, genre: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Worship, Anthem, Hymn, Teaching"
                />
              </div>
            </div>
          </div>
        )}

        {/* Video-Specific Fields */}
        {content.content_type === 'video' && (
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-amber-100 mb-4">Video Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Platform *
                </label>
                <select
                  value={content.metadata?.platform || 'youtube'}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, platform: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Video ID *
                </label>
                <input
                  type="text"
                  value={content.metadata?.videoId || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, videoId: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter video ID from platform"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  YouTube: Extract from URL after v= | TikTok/Instagram: Post ID | Facebook: Video ID
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Series (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(content.metadata?.series) ? content.metadata.series.join(', ') : (content.metadata?.series || '')}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, series: e.target.value.split(',').map(s => s.trim()).filter(s => s)}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Spiritual Warfare Basics, Remnant Training"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(content.metadata?.topics) ? content.metadata.topics.join(', ') : (content.metadata?.topics || '')}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, topics: e.target.value.split(',').map(s => s.trim()).filter(s => s)}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Spiritual Warfare, Deliverance, Repentance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Scriptures (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(content.metadata?.scriptures) ? content.metadata.scriptures.join(', ') : (content.metadata?.scriptures || '')}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, scriptures: e.target.value.split(',').map(s => s.trim()).filter(s => s)}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Ephesians 6:12, James 4:7, 1 Peter 5:8"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-amber-100 mb-2">
            Summary
          </label>
          <textarea
            value={content.summary}
            onChange={(e) => setContent({...content, summary: e.target.value})}
            className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={3}
            placeholder="Brief summary of the content"
          />
        </div>

        {/* Content Body */}
        <div>
          <label className="block text-sm font-medium text-amber-100 mb-2">
            Content (Markdown) *
          </label>
          <textarea
            value={content.body_md}
            onChange={(e) => setContent({...content, body_md: e.target.value})}
            className="w-full h-96 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Write your content in Markdown..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-amber-100 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag.id]);
                    } else {
                      setSelectedTags(selectedTags.filter(id => id !== tag.id));
                    }
                  }}
                  className="w-4 h-4 text-amber-600 bg-neutral-800 border-neutral-700 rounded focus:ring-amber-500"
                />
                <span className="text-amber-100 text-sm">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SEO Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-amber-100 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={content.seo_title}
              onChange={(e) => setContent({...content, seo_title: e.target.value})}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="SEO optimized title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-amber-100 mb-2">
              SEO Description
            </label>
            <textarea
              value={content.seo_description}
              onChange={(e) => setContent({...content, seo_description: e.target.value})}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={2}
              placeholder="SEO meta description"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
          <div className="text-sm text-neutral-400">
            {content.body_md.length} characters
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-amber-100 rounded-lg transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !content.title || !content.slug}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : (contentId ? 'Update Content' : 'Create Content')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
