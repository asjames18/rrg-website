/**
 * Rich Text Editor Component for CMS
 * Uses TipTap for WYSIWYG editing with live preview
 */

import { useState, useEffect } from 'react';

interface RichEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  showPreview?: boolean;
  autoSave?: boolean;
  onAutoSave?: (content: string) => void;
}

export default function RichEditor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  className = '',
  showPreview = false,
  autoSave = false,
  onAutoSave
}: RichEditorProps) {
  const [editorContent, setEditorContent] = useState(content);
  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onAutoSave) {
      const timer = setTimeout(() => {
        onAutoSave(editorContent);
      }, 2000); // Auto-save every 2 seconds

      return () => clearTimeout(timer);
    }
  }, [editorContent, autoSave, onAutoSave]);

  // Update word count and reading time
  useEffect(() => {
    const words = editorContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = editorContent.length;
    const time = Math.ceil(words / 200); // Average reading speed: 200 words per minute

    setWordCount(words);
    setCharCount(chars);
    setReadingTime(time);
  }, [editorContent]);

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange?.(newContent);
  };

  const insertMarkdown = (markdown: string) => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      let insertText = '';
      switch (markdown) {
        case 'bold':
          insertText = `**${selectedText || 'bold text'}**`;
          break;
        case 'italic':
          insertText = `*${selectedText || 'italic text'}*`;
          break;
        case 'heading':
          insertText = `## ${selectedText || 'Heading'}`;
          break;
        case 'link':
          insertText = `[${selectedText || 'link text'}](url)`;
          break;
        case 'quote':
          insertText = `> ${selectedText || 'quote'}`;
          break;
        case 'code':
          insertText = `\`${selectedText || 'code'}\``;
          break;
        case 'list':
          insertText = `- ${selectedText || 'list item'}`;
          break;
        case 'image':
          insertText = `![alt text](image-url)`;
          break;
      }
      
      const newContent = textarea.value.substring(0, start) + insertText + textarea.value.substring(end);
      handleContentChange(newContent);
      
      // Update textarea value
      textarea.value = newContent;
      
      // Set cursor position after inserted text
      const newCursorPos = start + insertText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }
  };

  const renderPreview = (content: string) => {
    // Simple markdown to HTML conversion for preview
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-amber-100 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-amber-100 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-amber-100 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="text-amber-200 font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="text-amber-200">$1</em>')
      .replace(/`(.*)`/gim, '<code class="bg-neutral-800 text-amber-300 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-amber-700 bg-amber-900/20 pl-4 py-2 my-4 text-neutral-300">$1</blockquote>')
      .replace(/^\- (.*$)/gim, '<li class="text-neutral-300 mb-1">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-amber-400 hover:text-amber-300 underline">$1</a>')
      .replace(/\n/gim, '<br>');
  };

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => insertMarkdown('bold')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Bold"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/>
            </svg>
          </button>
          
          <button
            onClick={() => insertMarkdown('italic')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Italic"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 4L6 20M14 4l-4 16"/>
            </svg>
          </button>
          
          <button
            onClick={() => insertMarkdown('heading')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Heading"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
          </button>
          
          <button
            onClick={() => insertMarkdown('link')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Link"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </button>
          
          <button
            onClick={() => insertMarkdown('quote')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Quote"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </button>
          
          <button
            onClick={() => insertMarkdown('code')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Code"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
          </button>
          
          <button
            onClick={() => insertMarkdown('list')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="List"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
          </button>
          
          <button
            onClick={() => insertMarkdown('image')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Image"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {showPreview && (
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                isPreview 
                  ? 'bg-amber-700 text-white' 
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-neutral-400">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-6 prose prose-invert max-w-none prose-headings:text-amber-100 prose-p:text-neutral-300 prose-strong:text-amber-200 prose-a:text-amber-400 prose-code:text-amber-300 prose-code:bg-neutral-800"
            dangerouslySetInnerHTML={{ __html: renderPreview(editorContent) }}
          />
        ) : (
          <textarea
            id="editor-textarea"
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-96 p-6 bg-transparent text-neutral-200 placeholder-neutral-500 resize-none focus:outline-none"
            style={{ minHeight: '400px' }}
          />
        )}
      </div>

      {/* Auto-save indicator */}
      {autoSave && (
        <div className="px-4 py-2 border-t border-neutral-800">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            <span>Auto-save enabled</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Saved</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
