/**
 * Astro Content Collections CMS API
 * Works with existing MDX content instead of database tables
 */

import { getCollection } from 'astro:content';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: 'blog' | 'video' | 'book' | 'music';
  status: 'published' | 'draft';
  featured: boolean;
  summary?: string;
  body_md?: string;
  body_html?: string;
  author_id?: string;
  published_at?: string;
  scheduled_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  tags?: string[];
  topics?: string[];
  scriptures?: string[];
  series?: string[];
  platform?: string;
  videoId?: string;
  audioSrc?: string;
  author?: string;
  affiliate?: {
    label: string;
    url: string;
    merchant: string;
  };
}

export interface ContentStats {
  total: {
    content: number;
    published: number;
    drafts: number;
    review: number;
    archived: number;
    featured: number;
  };
  byType: {
    blog: number;
    video: number;
    book: number;
    music: number;
  };
  recent: ContentItem[];
  lastUpdated: string;
}

export interface ContentFilters {
  type?: string;
  status?: string;
  featured?: boolean;
  tags?: string[];
  author?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class AstroContentAPI {
  /**
   * Get content statistics
   */
  static async getStats(): Promise<ContentStats> {
    try {
      // Get all content collections
      const blogPosts = await getCollection('blog');
      const videos = await getCollection('videos');
      const books = await getCollection('books');
      const music = await getCollection('music');

      // Convert to unified format
      const allContent = [
        ...blogPosts.map(post => this.convertBlogToContentItem(post)),
        ...videos.map(video => this.convertVideoToContentItem(video)),
        ...books.map(book => this.convertBookToContentItem(book)),
        ...music.map(track => this.convertMusicToContentItem(track))
      ];

      // Calculate stats
      const stats = {
        total: {
          content: allContent.length,
          published: allContent.filter(c => c.status === 'published').length,
          drafts: allContent.filter(c => c.status === 'draft').length,
          review: 0, // Astro doesn't have review status
          archived: 0, // Astro doesn't have archived status
          featured: allContent.filter(c => c.featured).length,
        },
        byType: {
          blog: allContent.filter(c => c.content_type === 'blog').length,
          video: allContent.filter(c => c.content_type === 'video').length,
          book: allContent.filter(c => c.content_type === 'book').length,
          music: allContent.filter(c => c.content_type === 'music').length,
        },
        recent: allContent
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 10),
        lastUpdated: new Date().toISOString()
      };

      return stats;
    } catch (error) {
      console.error('Error fetching content stats:', error);
      throw error;
    }
  }

  /**
   * Get content list with filters
   */
  static async getContent(filters: ContentFilters = {}): Promise<{
    content: ContentItem[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasMore: boolean;
    };
  }> {
    try {
      const {
        type,
        status,
        featured,
        tags,
        author,
        search,
        limit = 50,
        offset = 0,
        sortBy = 'updated_at',
        sortOrder = 'desc'
      } = filters;

      // Get all content collections
      const blogPosts = await getCollection('blog');
      const videos = await getCollection('videos');
      const books = await getCollection('books');
      const music = await getCollection('music');

      // Convert to unified format
      let allContent = [
        ...blogPosts.map(post => this.convertBlogToContentItem(post)),
        ...videos.map(video => this.convertVideoToContentItem(video)),
        ...books.map(book => this.convertBookToContentItem(book)),
        ...music.map(track => this.convertMusicToContentItem(track))
      ];

      // Apply filters
      if (type && type !== 'all') {
        allContent = allContent.filter(item => item.content_type === type);
      }

      if (status && status !== 'all') {
        allContent = allContent.filter(item => item.status === status);
      }

      if (featured !== undefined) {
        allContent = allContent.filter(item => item.featured === featured);
      }

      if (tags && tags.length > 0) {
        allContent = allContent.filter(item => 
          item.tags && item.tags.some(tag => tags.includes(tag))
        );
      }

      if (author) {
        allContent = allContent.filter(item => 
          item.author?.toLowerCase().includes(author.toLowerCase()) ||
          item.author_id === author
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        allContent = allContent.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.summary?.toLowerCase().includes(searchLower) ||
          item.body_md?.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      allContent.sort((a, b) => {
        const aValue = this.getSortValue(a, sortBy);
        const bValue = this.getSortValue(b, sortBy);
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const total = allContent.length;
      const paginatedContent = allContent.slice(offset, offset + limit);

      return {
        content: paginatedContent,
        pagination: {
          limit,
          offset,
          total,
          hasMore: (offset + limit) < total
        }
      };
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  /**
   * Get single content item
   */
  static async getContentById(id: string): Promise<ContentItem | null> {
    try {
      const allContent = await this.getAllContent();
      return allContent.find(item => item.id === id) || null;
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw error;
    }
  }

  /**
   * Get all content for internal use
   */
  private static async getAllContent(): Promise<ContentItem[]> {
    const blogPosts = await getCollection('blog');
    const videos = await getCollection('videos');
    const books = await getCollection('books');
    const music = await getCollection('music');

    return [
      ...blogPosts.map(post => this.convertBlogToContentItem(post)),
      ...videos.map(video => this.convertVideoToContentItem(video)),
      ...books.map(book => this.convertBookToContentItem(book)),
      ...music.map(track => this.convertMusicToContentItem(track))
    ];
  }

  /**
   * Convert blog post to content item
   */
  private static convertBlogToContentItem(post: any): ContentItem {
    return {
      id: post.id,
      title: post.data.title,
      slug: post.data.slug || post.id,
      content_type: 'blog',
      status: 'published', // All Astro content is published
      featured: false, // Could be determined by tags or other criteria
      summary: post.data.summary,
      body_md: post.body,
      published_at: post.data.publishedAt?.toISOString(),
      created_at: post.data.publishedAt?.toISOString() || new Date().toISOString(),
      updated_at: post.data.publishedAt?.toISOString() || new Date().toISOString(),
      tags: post.data.tags || [],
      metadata: {
        readingTime: post.data.readingTime
      }
    };
  }

  /**
   * Convert video to content item
   */
  private static convertVideoToContentItem(video: any): ContentItem {
    return {
      id: video.id,
      title: video.data.title,
      slug: video.data.slug || video.id,
      content_type: 'video',
      status: 'published',
      featured: false,
      body_md: video.body,
      published_at: video.data.publishedAt?.toISOString(),
      created_at: video.data.publishedAt?.toISOString() || new Date().toISOString(),
      updated_at: video.data.publishedAt?.toISOString() || new Date().toISOString(),
      topics: video.data.topics || [],
      scriptures: video.data.scriptures || [],
      series: video.data.series || [],
      platform: video.data.platform,
      videoId: video.data.videoId,
      metadata: {
        platform: video.data.platform
      }
    };
  }

  /**
   * Convert book to content item
   */
  private static convertBookToContentItem(book: any): ContentItem {
    return {
      id: book.id,
      title: book.data.title,
      slug: book.data.slug || book.id,
      content_type: 'book',
      status: 'published',
      featured: false,
      body_md: book.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: book.data.author,
      topics: book.data.topics || [],
      affiliate: book.data.affiliate,
      metadata: {
        author: book.data.author
      }
    };
  }

  /**
   * Convert music to content item
   */
  private static convertMusicToContentItem(music: any): ContentItem {
    return {
      id: music.id,
      title: music.data.title,
      slug: music.data.slug || music.id,
      content_type: 'music',
      status: 'published',
      featured: false,
      body_md: music.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      scriptures: music.data.scriptures || [],
      audioSrc: music.data.audioSrc,
      platform: music.data.platform,
      videoId: music.data.videoId,
      metadata: {
        type: music.data.type,
        platform: music.data.platform
      }
    };
  }

  /**
   * Get sort value for content item
   */
  private static getSortValue(item: ContentItem, sortBy: string): any {
    switch (sortBy) {
      case 'title':
        return item.title;
      case 'created_at':
        return new Date(item.created_at).getTime();
      case 'updated_at':
        return new Date(item.updated_at).getTime();
      case 'published_at':
        return item.published_at ? new Date(item.published_at).getTime() : 0;
      default:
        return new Date(item.updated_at).getTime();
    }
  }
}
