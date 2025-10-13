import React, { useState, useEffect } from 'react';

interface ContentEditorProps {
  content?: {
    id: string;
    title: string;
    slug: string;
    status: 'draft' | 'review' | 'published';
    featured: boolean;
    summary: string;
    tags: string[];
    publishedAt: string;
    author: string;
    coverImage?: string;
    seoDescription?: string;
    body: string;
  };
  type: 'blog' | 'videos' | 'books' | 'music';
  onSave?: (content: any) => void;
  onCancel?: () => void;
  onPreview?: (content: any) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  type,
  onSave,
  onCancel,
  onPreview
}) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    slug: content?.slug || '',
    status: content?.status || 'draft',
    featured: content?.featured || false,
    summary: content?.summary || '',
    tags: content?.tags || [],
    publishedAt: content?.publishedAt || new Date().toISOString().split('T')[0],
    author: content?.author || 'Real & Raw Gospel',
    coverImage: content?.coverImage || '',
    seoDescription: content?.seoDescription || '',
    body: content?.body || ''
  });

  const [newTag, setNewTag] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title && !content?.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, content?.slug]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setIsDirty(true);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsDirty(false);
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(formData);
    }
  };

  const getTypeSpecificFields = () => {
    switch (type) {
      case 'videos':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Platform
              </label>
              <select
                value={formData.platform || 'youtube'}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Video ID
              </label>
              <input
                type="text"
                value={formData.videoId || ''}
                onChange={(e) => handleInputChange('videoId', e.target.value)}
                placeholder="YouTube video ID or URL"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        );
      case 'books':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn || ''}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
                placeholder="Book ISBN number"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                value={formData.year || ''}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="2024"
                min="1900"
                max="2030"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        );
      case 'music':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Audio File
              </label>
              <input
                type="text"
                value={formData.audioSrc || ''}
                onChange={(e) => handleInputChange('audioSrc', e.target.value)}
                placeholder="/audio/filename.mp3"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="3"
                min="1"
                max="60"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-100">
          {content ? 'Edit' : 'Create'} {type === 'blog' ? 'Blog Post' : type === 'videos' ? 'Video' : type === 'books' ? 'Book' : 'Music'}
        </h2>
        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-neutral-700 text-neutral-200 rounded-lg hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
          )}
          {onPreview && (
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-blue-700 text-blue-200 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Preview
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="px-4 py-2 bg-amber-700 text-amber-200 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDirty ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6">
        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter title..."
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="url-friendly-slug"
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Type-specific fields */}
        {getTypeSpecificFields()}

        {/* Status and Featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Published Date
            </label>
            <input
              type="date"
              value={formData.publishedAt}
              onChange={(e) => handleInputChange('publishedAt', e.target.value)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-neutral-200">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 text-amber-600 bg-neutral-800 border-neutral-700 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            Summary *
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            placeholder="Brief description for previews and SEO..."
            rows={3}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-amber-700 text-amber-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-amber-200 hover:text-amber-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-amber-700 text-amber-200 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* SEO Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            SEO Description
          </label>
          <textarea
            value={formData.seoDescription}
            onChange={(e) => handleInputChange('seoDescription', e.target.value)}
            placeholder="Meta description for search engines..."
            rows={2}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Content Body */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            Content *
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="Write your content here... (Markdown supported)"
            rows={12}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
            required
          />
          <p className="text-xs text-neutral-500 mt-2">
            Supports Markdown formatting. Use **bold**, *italic*, # headings, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
