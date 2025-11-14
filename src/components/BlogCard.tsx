interface BlogCardProps {
  post: {
    slug: string;
    data: {
      title: string;
      summary: string;
      excerpt?: string;
      publishedAt: Date | string; // Can be Date object or ISO string
      readingTime: number;
      author: string;
      featured?: boolean;
      category: string;
      coverImage?: string;
      tags: string[];
    };
  };
  viewMode?: 'list' | 'grid' | 'compact';
  featured?: boolean;
}

export default function BlogCard({ post, viewMode = 'list', featured = false }: BlogCardProps) {
  // Handle both Date objects and ISO strings
  const publishedDate = post.data.publishedAt instanceof Date 
    ? post.data.publishedAt 
    : new Date(post.data.publishedAt as any);
  
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (viewMode === 'grid') {
    return (
      <article className="group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors flex flex-col h-full">
        {/* Cover Image */}
        {post.data.coverImage && (
          <a href={`/blog/${post.slug}`} className="block aspect-video bg-neutral-800 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
              <svg className="w-16 h-16 text-amber-700/30" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </div>
          </a>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
            <span className="bg-amber-900/30 border border-amber-800 text-amber-200 px-2 py-1 rounded">
              {post.data.category}
            </span>
            <span>•</span>
            <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
            <span>•</span>
            <span>{post.data.readingTime} min</span>
          </div>

          <h3 className="text-xl font-bold text-amber-100 mb-3 group-hover:text-amber-200 transition-colors line-clamp-2">
            <a href={`/blog/${post.slug}`} className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">
              {post.data.title}
            </a>
          </h3>

          <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
            {post.data.excerpt || post.data.summary}
          </p>

          {post.data.tags && Array.isArray(post.data.tags) && post.data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {post.data.tags
                .slice(0, 3)
                .filter((tag): tag is string => typeof tag === 'string')
                .map((tag, i) => (
                  <span key={i} className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>
      </article>
    );
  }

  if (viewMode === 'compact') {
    return (
      <article className="group border-b border-neutral-800 pb-4 last:border-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-200 transition-colors line-clamp-1 mb-2">
              <a href={`/blog/${post.slug}`} className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded">
                {post.data.title}
              </a>
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="text-amber-400">{post.data.category}</span>
              <span>•</span>
              <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
              <span>•</span>
              <span>{post.data.readingTime} min</span>
            </div>
          </div>
          {post.data.featured && (
            <span className="flex-shrink-0 text-xs bg-amber-900/30 border border-amber-800 text-amber-200 px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
      </article>
    );
  }

  // List view (default/Medium-style)
  return (
    <article className="group">
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">RRG</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <span>{post.data.author}</span>
            <span>•</span>
            <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
            <span>•</span>
            <span>{post.data.readingTime} min read</span>
            {post.data.featured && (
              <>
                <span>•</span>
                <span className="text-amber-400">★ Featured</span>
              </>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-neutral-100 mb-3 group-hover:text-amber-200 transition-colors leading-tight">
            <a 
              href={`/blog/${post.slug}`}
              className="focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              {post.data.title}
            </a>
          </h2>
          
          <p className="text-neutral-400 leading-relaxed mb-4 line-clamp-2">
            {post.data.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {post.data.tags && Array.isArray(post.data.tags) && post.data.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.data.tags
                    .slice(0, 2)
                    .filter((tag): tag is string => typeof tag === 'string')
                    .map((tag, i) => (
                      <span key={i} className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  {post.data.tags.length > 2 && (
                    <span className="text-xs text-neutral-500">+{post.data.tags.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

