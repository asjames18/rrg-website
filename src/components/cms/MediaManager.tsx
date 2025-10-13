import React, { useState, useRef } from 'react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface MediaManagerProps {
  onUpload?: (files: File[]) => void;
  onDelete?: (id: string) => void;
  onSelect?: (url: string) => void;
  media?: MediaFile[];
}

const MediaManager: React.FC<MediaManagerProps> = ({
  onUpload,
  onDelete,
  onSelect,
  media = []
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploading(true);
    try {
      // Filter for image files
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length !== files.length) {
        alert('Only image files are allowed');
      }
      
      if (onUpload) {
        await onUpload(imageFiles);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    return '📄';
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-amber-500 bg-amber-900/20'
            : 'border-neutral-700 bg-neutral-900/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <h3 className="text-lg font-bold text-neutral-200 mb-2">Upload Images</h3>
            <p className="text-neutral-400 text-sm">
              Drag and drop images here, or click to browse
            </p>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {media.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-200">Media Library</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((file) => (
              <div
                key={file.id}
                className={`relative group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-colors ${
                  selectedMedia === file.id ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                {/* Image Preview */}
                <div className="aspect-square bg-neutral-800 flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">{getFileIcon(file.type)}</div>
                  )}
                </div>

                {/* File Info */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-neutral-200 truncate">
                    {file.name}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    {onSelect && (
                      <button
                        onClick={() => {
                          setSelectedMedia(file.id);
                          onSelect(file.url);
                        }}
                        className="p-1 bg-blue-700 text-blue-200 rounded hover:bg-blue-600 transition-colors"
                        title="Select this media"
                      >
                        ✓
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(file.id)}
                        className="p-1 bg-red-700 text-red-200 rounded hover:bg-red-600 transition-colors"
                        title="Delete this media"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {/* Selected Indicator */}
                {selectedMedia === file.id && (
                  <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                    <div className="bg-amber-700 text-amber-200 px-3 py-1 rounded-full text-sm font-bold">
                      Selected
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
            <span className="text-amber-200">Uploading files...</span>
          </div>
        </div>
      )}

      {/* Usage Stats */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
        <h4 className="text-sm font-bold text-neutral-200 mb-2">Storage Usage</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Total Files</span>
            <span className="text-neutral-200">{media.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Total Size</span>
            <span className="text-neutral-200">
              {formatFileSize(media.reduce((sum, file) => sum + file.size, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaManager;
