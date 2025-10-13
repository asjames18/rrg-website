import React, { useState, useEffect } from 'react';

interface MDXEditorProps {
  contentPath: string;
  onSave?: (content: string) => void;
  onCancel?: () => void;
}

export default function MDXEditor({ contentPath, onSave, onCancel }: MDXEditorProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContent();
  }, [contentPath]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cms/mdx-content?path=${encodeURIComponent(contentPath)}`);
      const data = await response.json();
      
      if (response.ok) {
        setContent(data.content);
      } else {
        setError(data.error || 'Failed to load content');
      }
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const response = await fetch('/api/cms/mdx-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: contentPath,
          content: content
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        onSave?.(content);
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
        <h3 className="text-lg font-semibold text-amber-100">Edit Content</h3>
        <p className="text-neutral-400 text-sm mt-1">Editing: {contentPath}</p>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-100 mb-2">
              Content (MDX Format)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter your MDX content here..."
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-400">
              {content.length} characters
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
                disabled={saving}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
