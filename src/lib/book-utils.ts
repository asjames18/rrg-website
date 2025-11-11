/**
 * Book utility functions
 * Helpers for book covers, ISBN handling, etc.
 */

export function getBookCoverUrl(isbn?: string, size: 'S' | 'M' | 'L' = 'M'): string | null {
  if (!isbn) return null;
  
  // Clean ISBN (remove hyphens)
  const cleanIsbn = isbn.replace(/-/g, '');
  
  // Open Library Covers API
  // Sizes: S (small), M (medium), L (large)
  return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-${size}.jpg`;
}

export function getGoogleBooksCoverUrl(isbn?: string): string | null {
  if (!isbn) return null;
  const cleanIsbn = isbn.replace(/-/g, '');
  return `https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=1&isbn=${cleanIsbn}`;
}

export function getLevelBadgeColor(level: string): string {
  switch (level) {
    case 'beginner':
      return 'bg-green-900/30 border-green-800 text-green-200';
    case 'intermediate':
      return 'bg-blue-900/30 border-blue-800 text-blue-200';
    case 'advanced':
      return 'bg-purple-900/30 border-purple-800 text-purple-200';
    default:
      return 'bg-neutral-800 border-neutral-700 text-neutral-300';
  }
}

export function getLevelLabel(level: string): string {
  switch (level) {
    case 'beginner':
      return 'Beginner Friendly';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return level;
  }
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Hebrew Roots': '✡️',
    'Prophecy': '🔮',
    'Spiritual Warfare': '⚔️',
    'Torah': '📜',
    'End Times': '⏰',
    'Identity': '👤',
    'Feasts': '🎺',
    'Prayer': '🙏',
    'Theology': '📖',
    'General': '📚',
  };
  return icons[category] || '📚';
}

export function formatRating(rating?: number): string {
  if (!rating) return '';
  return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
}

export function getMerchantLogo(merchant: string): string | null {
  const logos: Record<string, string> = {
    'Amazon': '🛒',
    'ChristianBook.com': '✝️',
    'Barnes & Noble': '📚',
    'Example Retailer': '🏪',
  };
  return logos[merchant] || null;
}

