import React, { useState, useEffect } from 'react';
import WorkflowManager from '../admin/WorkflowManager';

interface SupabaseContentEditorProps {
  contentId?: string;
  onSave?: (content: any) => void;
  onCancel?: () => void;
  defaultContentType?: string;
}

export default function SupabaseContentEditor({ contentId, onSave, onCancel, defaultContentType }: SupabaseContentEditorProps) {
  const [content, setContent] = useState<any>({
    title: '',
    slug: '',
    content_type: defaultContentType || 'blog',
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
    } else {
      // Initialize metadata based on content type for new content
      const initialMetadata = getInitialMetadata(content.content_type);
      if (!content.metadata || Object.keys(content.metadata).length === 0 || 
          (content.content_type === 'book' && !content.metadata.isbn)) {
        setContent({
          ...content,
          metadata: initialMetadata
        });
      }
    }
    loadTags();
  }, [contentId]);

  // Update metadata when content type changes
  useEffect(() => {
    if (!contentId && content.content_type) {
      const newMetadata = getInitialMetadata(content.content_type);
      // Only update if metadata structure doesn't match content type
      const shouldUpdate = 
        (content.content_type === 'book' && !content.metadata?.isbn) ||
        (content.content_type === 'video' && !content.metadata?.platform) ||
        (content.content_type === 'music' && !content.metadata?.artist) ||
        (content.content_type === 'blog' && !content.metadata?.coverImage);
      
      if (shouldUpdate) {
        setContent((prev: any) => ({
          ...prev,
          metadata: { ...newMetadata, ...(prev.metadata || {}) }
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.content_type]);

  const getInitialMetadata = (contentType: string) => {
    switch (contentType) {
      case 'book':
        return {
          isbn: '',
          rating: undefined,
          level: 'beginner',
          category: '',
          publishedYear: undefined,
          publisher: '',
          pages: undefined,
          coverImageUrl: '',
          affiliate: {
            label: '',
            url: '',
            merchant: 'amazon'
          },
          alternativeLinks: [],
          whyRecommended: '',
          warnings: '',
          topics: []
        };
      case 'video':
        return {
          platform: 'youtube',
          videoId: '',
          series: [],
          topics: [],
          scriptures: []
        };
      case 'music':
        return {
          artist: '',
          album: '',
          platform: 'youtube',
          videoId: '',
          topics: []
        };
      default: // blog
        return {
          coverImage: '',
          topics: []
        };
    }
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      console.log('[ContentEditor] Loading content:', contentId);
      const response = await fetch(`/api/cms/content/${contentId}`);
      const data = await response.json();
      
      console.log('[ContentEditor] Response:', response.status, data);
      
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
        console.log('[ContentEditor] Content loaded successfully');
      } else {
        const errorMsg = data.error || 'Failed to load content';
        console.error('[ContentEditor] Error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('[ContentEditor] Exception:', err);
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
      
      // Clean up the payload - move affiliate fields to metadata if they're at top level
      const cleanedContent = { ...content };
      
      // If this is a book and affiliate fields are at top level, move them to metadata
      if (cleanedContent.content_type === 'book') {
        if (!cleanedContent.metadata) {
          cleanedContent.metadata = {};
        }
        
        // Move affiliate fields from top level to metadata.affiliate
        if (cleanedContent.affiliate_url || cleanedContent.affiliate_label || cleanedContent.affiliate_merchant) {
          cleanedContent.metadata.affiliate = {
            url: cleanedContent.affiliate_url || cleanedContent.metadata?.affiliate?.url || '',
            label: cleanedContent.affiliate_label || cleanedContent.metadata?.affiliate?.label || '',
            merchant: cleanedContent.affiliate_merchant || cleanedContent.metadata?.affiliate?.merchant || 'amazon'
          };
          
          // Remove top-level affiliate fields
          delete cleanedContent.affiliate_url;
          delete cleanedContent.affiliate_label;
          delete cleanedContent.affiliate_merchant;
        }
      }
      
      const payload = {
        ...cleanedContent,
        tags: selectedTags
      };
      
      console.log('[ContentEditor] Saving content:', contentId ? 'UPDATE' : 'CREATE');
      console.log('[ContentEditor] Payload:', payload);
      
      const response = await fetch(contentId ? `/api/cms/content/${contentId}` : '/api/cms/content', {
        method: contentId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      console.log('[ContentEditor] Save response:', response.status, data);
      
      if (response.ok) {
        console.log('[ContentEditor] Content saved successfully');
        onSave?.(data);
      } else {
        // Build detailed error message
        let errorMsg = data.error || 'Failed to save content';
        if (data.message) {
          errorMsg += `: ${data.message}`;
        }
        if (data.details) {
          errorMsg += `\nDetails: ${data.details}`;
        }
        if (data.hint) {
          errorMsg += `\nHint: ${data.hint}`;
        }
        if (data.code) {
          errorMsg += `\nError Code: ${data.code}`;
        }
        
        console.error('[ContentEditor] Save error:', {
          error: data.error,
          message: data.message,
          details: data.details,
          hint: data.hint,
          code: data.code,
          fullData: data
        });
        setError(errorMsg);
      }
    } catch (err) {
      console.error('[ContentEditor] Save exception:', err);
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
            <p className="text-red-300 text-sm whitespace-pre-wrap">{error}</p>
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

        {/* Book-Specific Fields */}
        {content.content_type === 'book' && (
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6 space-y-6">
            <h4 className="text-lg font-semibold text-amber-100 mb-4">Book Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={content.metadata?.author || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, author: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Author name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={content.metadata?.coverImageUrl || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, coverImageUrl: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://example.com/book-cover.jpg"
                />
                <p className="text-xs text-neutral-500 mt-1">Direct URL to book cover image (optional)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  value={content.metadata?.isbn || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, isbn: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="978-0-123456-78-9"
                />
                <p className="text-xs text-neutral-500 mt-1">Used for cover image lookup if no custom URL provided</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Rating (1-5)
                </label>
                <select
                  value={content.metadata?.rating || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, rating: e.target.value ? parseInt(e.target.value) : undefined}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">No rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Level
                </label>
                <select
                  value={content.metadata?.level || 'intermediate'}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, level: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={content.metadata?.category || 'General'}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, category: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="General"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Published Year
                </label>
                <input
                  type="number"
                  value={content.metadata?.publishedYear || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, publishedYear: e.target.value ? parseInt(e.target.value) : undefined}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="2024"
                  min="1000"
                  max="9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Publisher
                </label>
                <input
                  type="text"
                  value={content.metadata?.publisher || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, publisher: e.target.value}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Publisher name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Pages
                </label>
                <input
                  type="number"
                  value={content.metadata?.pages || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, pages: e.target.value ? parseInt(e.target.value) : undefined}
                  })}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="300"
                  min="1"
                />
              </div>
            </div>

            {/* Affiliate Information */}
            <div className="border-t border-neutral-700 pt-6">
              <h5 className="text-md font-semibold text-amber-100 mb-4">Affiliate Information</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-2">
                    Affiliate Label
                  </label>
                  <input
                    type="text"
                    value={content.metadata?.affiliate?.label || ''}
                    onChange={(e) => setContent({
                      ...content, 
                      metadata: {
                        ...content.metadata, 
                        affiliate: {
                          ...content.metadata?.affiliate,
                          label: e.target.value,
                          url: content.metadata?.affiliate?.url || '',
                          merchant: content.metadata?.affiliate?.merchant || 'amazon'
                        }
                      }
                    })}
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Buy on Amazon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-2">
                    Affiliate URL *
                  </label>
                  <input
                    type="url"
                    value={content.metadata?.affiliate?.url || ''}
                    onChange={(e) => setContent({
                      ...content, 
                      metadata: {
                        ...content.metadata, 
                        affiliate: {
                          ...content.metadata?.affiliate,
                          url: e.target.value,
                          label: content.metadata?.affiliate?.label || '',
                          merchant: content.metadata?.affiliate?.merchant || 'amazon'
                        }
                      }
                    })}
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="https://amazon.com/dp/..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-2">
                    Merchant
                  </label>
                  <select
                    value={content.metadata?.affiliate?.merchant || 'amazon'}
                    onChange={(e) => setContent({
                      ...content, 
                      metadata: {
                        ...content.metadata, 
                        affiliate: {
                          ...content.metadata?.affiliate,
                          merchant: e.target.value,
                          url: content.metadata?.affiliate?.url || '',
                          label: content.metadata?.affiliate?.label || ''
                        }
                      }
                    })}
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="amazon">Amazon</option>
                    <option value="christianbook">ChristianBook</option>
                    <option value="barnesandnoble">Barnes & Noble</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Alternative Links */}
            <div className="border-t border-neutral-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-md font-semibold text-amber-100">Alternative Links</h5>
                <button
                  type="button"
                  onClick={() => {
                    const altLinks = content.metadata?.alternativeLinks || [];
                    setContent({
                      ...content,
                      metadata: {
                        ...content.metadata,
                        alternativeLinks: [...altLinks, { label: '', url: '', merchant: 'other' }]
                      }
                    });
                  }}
                  className="bg-neutral-700 hover:bg-neutral-600 text-neutral-200 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  + Add Alternative Link
                </button>
              </div>
              
              {(content.metadata?.alternativeLinks || []).map((link: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
                  <div>
                    <label className="block text-xs font-medium text-amber-100 mb-1">Label</label>
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => {
                        const altLinks = [...(content.metadata?.alternativeLinks || [])];
                        altLinks[index] = { ...altLinks[index], label: e.target.value };
                        setContent({
                          ...content,
                          metadata: { ...content.metadata, alternativeLinks: altLinks }
                        });
                      }}
                      className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-amber-100 text-sm"
                      placeholder="Buy on ChristianBook"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-amber-100 mb-1">URL</label>
                    <input
                      type="url"
                      value={link.url || ''}
                      onChange={(e) => {
                        const altLinks = [...(content.metadata?.alternativeLinks || [])];
                        altLinks[index] = { ...altLinks[index], url: e.target.value };
                        setContent({
                          ...content,
                          metadata: { ...content.metadata, alternativeLinks: altLinks }
                        });
                      }}
                      className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-amber-100 text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const altLinks = [...(content.metadata?.alternativeLinks || [])];
                        altLinks.splice(index, 1);
                        setContent({
                          ...content,
                          metadata: { ...content.metadata, alternativeLinks: altLinks }
                        });
                      }}
                      className="w-full bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-neutral-700 pt-6">
              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Why Recommended
                </label>
                <textarea
                  value={content.metadata?.whyRecommended || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, whyRecommended: e.target.value}
                  })}
                  rows={3}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Explain why this book is recommended..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-100 mb-2">
                  Warnings
                </label>
                <textarea
                  value={content.metadata?.warnings || ''}
                  onChange={(e) => setContent({
                    ...content, 
                    metadata: {...content.metadata, warnings: e.target.value}
                  })}
                  rows={3}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Any warnings or cautions about this book..."
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
        
        {/* Workflow Management */}
        {contentId && (
          <div className="pt-6 border-t border-neutral-800">
            <WorkflowManager
              contentId={contentId}
              contentType={content.content_type}
              currentState={content.status || 'draft'}
              onStateChange={(newState) => {
                setContent({...content, status: newState});
                // Optionally reload content to get updated workflow state
                loadContent();
              }}
            />
          </div>
        )}
        
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
