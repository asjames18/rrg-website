import { useState } from 'react';
import { getBookCoverUrl, getLevelBadgeColor, getLevelLabel, formatRating, getCategoryIcon, getMerchantLogo } from '../lib/book-utils';

interface BookCardProps {
  book: {
    id: string;
    slug: string;
    data: {
      title: string;
      author: string;
      isbn?: string;
      rating?: number;
      level: 'beginner' | 'intermediate' | 'advanced';
      category: string;
      publishedYear?: number;
      publisher?: string;
      pages?: number;
      whyRecommended?: string;
      featured?: boolean;
      affiliate: {
        label: string;
        url: string;
        merchant: string;
      };
      alternativeLinks?: Array<{
        label: string;
        url: string;
        merchant: string;
      }>;
      topics: string[];
    };
  };
  viewMode?: 'grid' | 'list' | 'detailed';
}

export default function BookCard({ book, viewMode = 'grid' }: BookCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showQuickLook, setShowQuickLook] = useState(false);
  
  const coverUrl = getBookCoverUrl(book.data.isbn, 'M');
  const hasValidCover = coverUrl && !imgError;

  if (viewMode === 'list') {
    return (
      <article className="flex gap-4 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors p-4">
        {/* Book Cover */}
        <a 
          href={`/books/${book.slug}`}
          className="flex-shrink-0 w-24 h-32 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded overflow-hidden flex items-center justify-center"
        >
          {hasValidCover ? (
            <img
              src={coverUrl}
              alt={`${book.data.title} cover`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <svg className="w-12 h-12 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
            </svg>
          )}
        </a>

        {/* Book Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-amber-100 line-clamp-1">
                <a 
                  href={`/books/${book.slug}`}
                  className="hover:text-amber-200 transition-colors"
                >
                  {book.data.title}
                </a>
              </h3>
              <p className="text-sm text-neutral-400">by {book.data.author}</p>
            </div>
            {book.data.featured && (
              <span className="flex-shrink-0 text-xs bg-amber-900/30 border border-amber-800 text-amber-200 px-2 py-1 rounded">
                Essential
              </span>
            )}
          </div>

          {book.data.rating && (
            <div className="text-amber-400 text-sm mb-2">
              {formatRating(book.data.rating)}
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded border ${getLevelBadgeColor(book.data.level)}`}>
              {getLevelLabel(book.data.level)}
            </span>
            <span className="text-xs text-neutral-500">
              {getCategoryIcon(book.data.category)} {book.data.category}
            </span>
          </div>

          {book.data.whyRecommended && (
            <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
              {book.data.whyRecommended}
            </p>
          )}

          <div className="mt-auto flex gap-2">
            <a 
              href={book.data.affiliate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <span>{book.data.affiliate.label}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a 
              href={`/books/${book.slug}`}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Details
            </a>
          </div>
        </div>
      </article>
    );
  }

  // Grid and Detailed views
  return (
    <article className={`bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors flex flex-col ${viewMode === 'detailed' ? 'md:flex-row' : ''}`}>
      {/* Book Cover */}
      <a 
        href={`/books/${book.slug}`}
        className={`relative bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center ${
          viewMode === 'detailed' ? 'md:w-64 md:h-auto h-80' : 'h-80'
        }`}
      >
        {hasValidCover ? (
          <img
            src={coverUrl}
            alt={`${book.data.title} cover`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="text-center p-6">
            <svg className="w-20 h-20 mx-auto mb-4 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
            </svg>
            <p className="text-sm text-neutral-500">Book Cover</p>
          </div>
        )}

        {book.data.featured && (
          <div className="absolute top-3 right-3 bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            ★ Essential
          </div>
        )}

        {book.data.rating && (
          <div className="absolute bottom-3 left-3 bg-black/80 text-amber-400 text-sm px-3 py-1.5 rounded-lg">
            {formatRating(book.data.rating)}
          </div>
        )}
      </a>

      {/* Book Info */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <h2 className="text-xl font-bold mb-2 text-amber-100">
            <a 
              href={`/books/${book.slug}`}
              className="hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
            >
              {book.data.title}
            </a>
          </h2>
          <p className="text-sm text-neutral-400 mb-2">by {book.data.author}</p>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded border ${getLevelBadgeColor(book.data.level)}`}>
              {getLevelLabel(book.data.level)}
            </span>
            <span className="text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 px-2 py-1 rounded">
              {getCategoryIcon(book.data.category)} {book.data.category}
            </span>
            {book.data.publishedYear && (
              <span className="text-xs text-neutral-500">
                {book.data.publishedYear}
              </span>
            )}
            {book.data.pages && (
              <span className="text-xs text-neutral-500">
                {book.data.pages} pages
              </span>
            )}
          </div>
        </div>

        {book.data.whyRecommended && (
          <div className="mb-4 p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg">
            <p className="text-sm text-amber-100">
              <span className="font-semibold">Why we recommend:</span> {book.data.whyRecommended}
            </p>
          </div>
        )}

        {book.data.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {book.data.topics.map((topic, i) => (
              <span key={i} className="inline-block bg-amber-900/30 border border-amber-800 text-amber-200 text-xs px-2 py-1 rounded">
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-2">
          <a 
            href={book.data.affiliate.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 w-full"
          >
            <span>{getMerchantLogo(book.data.affiliate.merchant)}</span>
            <span>{book.data.affiliate.label}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          
          {book.data.alternativeLinks && book.data.alternativeLinks.length > 0 && (
            <div className="flex gap-2">
              {book.data.alternativeLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg transition-colors"
                  title={link.merchant}
                >
                  {getMerchantLogo(link.merchant) || '🛒'} {link.merchant.split('.')[0]}
                </a>
              ))}
            </div>
          )}

          <p className="text-xs text-neutral-500 text-center mt-2">
            via {book.data.affiliate.merchant}
          </p>
        </div>
      </div>
    </article>
  );
}

