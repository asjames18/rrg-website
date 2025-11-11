interface VideoSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export default function VideoSkeleton({ viewMode = 'grid', count = 6 }: VideoSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden p-4 animate-pulse">
            {/* Thumbnail skeleton */}
            <div className="w-48 h-28 flex-shrink-0 bg-neutral-800 rounded" />
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-neutral-800 rounded w-3/4" />
              <div className="h-4 bg-neutral-800 rounded w-full" />
              <div className="h-4 bg-neutral-800 rounded w-2/3" />
              <div className="flex gap-2">
                <div className="h-6 bg-neutral-800 rounded w-16" />
                <div className="h-6 bg-neutral-800 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Grid view
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden animate-pulse">
          {/* Thumbnail skeleton */}
          <div className="aspect-video bg-neutral-800" />
          
          {/* Content skeleton */}
          <div className="p-5 space-y-3">
            <div className="h-5 bg-neutral-800 rounded w-3/4" />
            <div className="h-4 bg-neutral-800 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-neutral-800 rounded w-16" />
              <div className="h-6 bg-neutral-800 rounded w-16" />
              <div className="h-6 bg-neutral-800 rounded w-16" />
            </div>
            <div className="h-4 bg-neutral-800 rounded w-full" />
            <div className="h-4 bg-neutral-800 rounded w-2/3" />
          </div>
        </div>
      ))}
    </>
  );
}

