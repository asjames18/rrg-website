import { useState } from 'react';
import { getVideoThumbnail, getVideoThumbnailFallback, getPlatformIcon, getPlatformName } from '../lib/video-utils';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    slug: string;
    summary?: string;
    published_at?: string;
    created_at: string;
    metadata?: {
      platform?: string;
      videoId?: string;
      series?: string[];
      topics?: string[];
      scriptures?: string[];
      duration?: number;
    };
  };
  viewMode?: 'grid' | 'list';
}

export default function VideoCard({ video, viewMode = 'grid' }: VideoCardProps) {
  const [imgError, setImgError] = useState(false);
  
  const platform = video.metadata?.platform || 'youtube';
  const videoId = video.metadata?.videoId || '';
  const thumbnailUrl = imgError 
    ? getVideoThumbnailFallback(platform)
    : getVideoThumbnail(platform, videoId);
  
  const formattedDate = new Date(video.published_at || video.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (viewMode === 'list') {
    return (
      <a 
        href={`/videos/${video.slug}`}
        className="group flex gap-4 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors p-4"
      >
        {/* Thumbnail */}
        <div className="relative w-48 h-28 flex-shrink-0 bg-neutral-800 rounded overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 bg-amber-700/90 group-hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          {/* Platform badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d={getPlatformIcon(platform)} />
            </svg>
            <span>{getPlatformName(platform)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-200 transition-colors mb-2 line-clamp-2">
            {video.title}
          </h3>
          
          {video.summary && (
            <p className="text-sm text-neutral-400 mb-2 line-clamp-2">
              {video.summary}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <time>{formattedDate}</time>
            {video.metadata?.series && video.metadata.series.length > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-400">
                  {Array.isArray(video.metadata.series) ? video.metadata.series[0] : video.metadata.series}
                </span>
              </>
            )}
          </div>
          
          {video.metadata?.topics && video.metadata.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {(Array.isArray(video.metadata.topics) ? video.metadata.topics.slice(0, 3) : [video.metadata.topics]).map((topic, i) => (
                <span key={i} className="inline-block bg-neutral-800 text-neutral-400 text-xs px-2 py-0.5 rounded">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>
    );
  }

  // Grid view (default)
  return (
    <article className="group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors">
      {/* Thumbnail with play overlay */}
      <a href={`/videos/${video.slug}`} className="block relative aspect-video bg-neutral-800">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 bg-amber-700/90 group-hover:bg-amber-600 group-hover:scale-110 rounded-full flex items-center justify-center transition-all">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* Platform badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1.5">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d={getPlatformIcon(platform)} />
          </svg>
          <span>{getPlatformName(platform)}</span>
        </div>
      </a>

      {/* Card content */}
      <div className="p-5">
        <h2 className="text-lg font-bold mb-2 text-amber-100 line-clamp-2">
          <a 
            href={`/videos/${video.slug}`}
            className="hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
          >
            {video.title}
          </a>
        </h2>
        
        {video.metadata?.series && video.metadata.series.length > 0 && (
          <p className="text-sm text-amber-400 mb-2">
            Series: {Array.isArray(video.metadata.series) ? video.metadata.series.join(', ') : video.metadata.series}
          </p>
        )}
        
        {video.metadata?.topics && video.metadata.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {(Array.isArray(video.metadata.topics) ? video.metadata.topics.slice(0, 3) : [video.metadata.topics]).map((topic, i) => (
              <span key={i} className="inline-block bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs px-2 py-1 rounded">
                {topic}
              </span>
            ))}
            {Array.isArray(video.metadata.topics) && video.metadata.topics.length > 3 && (
              <span className="inline-block text-neutral-500 text-xs px-2 py-1">
                +{video.metadata.topics.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {video.summary && (
          <p className="text-sm text-neutral-400 line-clamp-2">
            {video.summary}
          </p>
        )}
        
        <div className="mt-3 text-xs text-neutral-500">
          <time>{formattedDate}</time>
        </div>
      </div>
    </article>
  );
}

