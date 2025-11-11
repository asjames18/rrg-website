/**
 * CMS API Client
 * Centralized API functions for the new custom CMS
 */

import { supabaseServer } from '../supabase-server';
import { logger } from '../logger';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: 'blog' | 'video' | 'book' | 'music';
  status: 'draft' | 'review' | 'published' | 'archived';
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
  tags?: Tag[];
  media?: MediaItem[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_url: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  duration?: number;
  alt_text?: string;
  caption?: string;
  description?: string;
  folder_path: string;
  tags: string[];
  uploaded_by?: string;
  created_at: string;
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

export class CMSAPI {
  /**
   * Get content statistics
   */
  static async getStats(): Promise<ContentStats> {
    try {
      // Get total counts
      const { data: contentCounts, error: countError } = await supabaseServer
        .from('content')
        .select('content_type, status, featured');

      if (countError) throw countError;

      // Calculate stats
      const stats = {
        total: {
          content: contentCounts?.length || 0,
          published: contentCounts?.filter(c => c.status === 'published').length || 0,
          drafts: contentCounts?.filter(c => c.status === 'draft').length || 0,
          review: contentCounts?.filter(c => c.status === 'review').length || 0,
          archived: contentCounts?.filter(c => c.status === 'archived').length || 0,
          featured: contentCounts?.filter(c => c.featured).length || 0,
        },
        byType: {
          blog: contentCounts?.filter(c => c.content_type === 'blog').length || 0,
          video: contentCounts?.filter(c => c.content_type === 'video').length || 0,
          book: contentCounts?.filter(c => c.content_type === 'book').length || 0,
          music: contentCounts?.filter(c => c.content_type === 'music').length || 0,
        },
        recent: [],
        lastUpdated: new Date().toISOString()
      };

      // Get recent content
      const { data: recentContent, error: recentError } = await supabaseServer
        .from('content')
        .select(`
          *,
          tags:content_tags(tags(*))
        `)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      stats.recent = recentContent || [];

      return stats;
    } catch (error) {
      logger.error('Error fetching CMS stats:', error);
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

      let query = supabaseServer
        .from('content')
        .select(`
          *,
          tags:content_tags(tags(*)),
          media:content_media(media_library(*))
        `);

      // Apply filters
      if (type && type !== 'all') {
        query = query.eq('content_type', type);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (featured !== undefined) {
        query = query.eq('featured', featured);
      }

      if (author) {
        query = query.eq('author_id', author);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,body_md.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data: content, error } = await query;

      if (error) throw error;

      // Get total count for pagination
      let countQuery = supabaseServer.from('content').select('id', { count: 'exact', head: true });
      
      if (type && type !== 'all') countQuery = countQuery.eq('content_type', type);
      if (status && status !== 'all') countQuery = countQuery.eq('status', status);
      if (featured !== undefined) countQuery = countQuery.eq('featured', featured);
      if (author) countQuery = countQuery.eq('author_id', author);
      if (search) countQuery = countQuery.or(`title.ilike.%${search}%,summary.ilike.%${search}%,body_md.ilike.%${search}%`);

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;

      return {
        content: content || [],
        pagination: {
          limit,
          offset,
          total: count || 0,
          hasMore: (offset + limit) < (count || 0)
        }
      };
    } catch (error) {
      logger.error('Error fetching content:', error);
      throw error;
    }
  }

  /**
   * Get single content item
   */
  static async getContentById(id: string): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabaseServer
        .from('content')
        .select(`
          *,
          tags:content_tags(tags(*)),
          media:content_media(media_library(*))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching content by ID:', error);
      throw error;
    }
  }

  /**
   * Create new content
   */
  static async createContent(content: Partial<ContentItem>): Promise<ContentItem> {
    try {
      // Filter out relationship fields that aren't columns in the content table
      const { tags, media, ...contentData } = content;
      
      const { data, error } = await supabaseServer
        .from('content')
        .insert([contentData])
        .select(`
          *,
          tags:content_tags(tags(*)),
          media:content_media(media_library(*))
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating content:', error);
      throw error;
    }
  }

  /**
   * Update content
   */
  static async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    try {
      // Filter out relationship fields that aren't columns in the content table
      const { tags, media, ...contentUpdates } = updates;
      
      const { data, error } = await supabaseServer
        .from('content')
        .update(contentUpdates)
        .eq('id', id)
        .select(`
          *,
          tags:content_tags(tags(*)),
          media:content_media(media_library(*))
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating content:', error);
      throw error;
    }
  }

  /**
   * Delete content
   */
  static async deleteContent(id: string): Promise<void> {
    try {
      const { error } = await supabaseServer
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      logger.error('Error deleting content:', error);
      throw error;
    }
  }

  /**
   * Get all tags
   */
  static async getTags(): Promise<Tag[]> {
    try {
      const { data, error } = await supabaseServer
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching tags:', error);
      throw error;
    }
  }

  /**
   * Create new tag
   */
  static async createTag(tag: Partial<Tag>): Promise<Tag> {
    try {
      const { data, error } = await supabaseServer
        .from('tags')
        .insert([tag])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating tag:', error);
      throw error;
    }
  }

  /**
   * Get media library
   */
  static async getMedia(filters: {
    type?: string;
    folder?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{
    media: MediaItem[];
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
        folder,
        search,
        limit = 50,
        offset = 0
      } = filters;

      let query = supabaseServer
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) query = query.eq('media_type', type);
      if (folder) query = query.eq('folder_path', folder);
      if (search) {
        query = query.or(`filename.ilike.%${search}%,original_name.ilike.%${search}%,alt_text.ilike.%${search}%`);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: media, error } = await query;

      if (error) throw error;

      // Get total count
      let countQuery = supabaseServer.from('media_library').select('id', { count: 'exact', head: true });
      if (type) countQuery = countQuery.eq('media_type', type);
      if (folder) countQuery = countQuery.eq('folder_path', folder);
      if (search) {
        countQuery = countQuery.or(`filename.ilike.%${search}%,original_name.ilike.%${search}%,alt_text.ilike.%${search}%`);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;

      return {
        media: media || [],
        pagination: {
          limit,
          offset,
          total: count || 0,
          hasMore: (offset + limit) < (count || 0)
        }
      };
    } catch (error) {
      logger.error('Error fetching media:', error);
      throw error;
    }
  }

  /**
   * Get content activities (workflow history and user activities related to content)
   */
  static async getActivities(limit = 50): Promise<any[]> {
    try {
      // Get workflow history (content state changes)
      const { data: workflowData, error: workflowError } = await supabaseServer
        .from('workflow_history')
        .select(`
          id,
          content_id,
          content_type,
          from_state,
          to_state,
          changed_by,
          comment,
          created_at,
          changer:profiles!changed_by(id, display_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (workflowError) {
        logger.warn('Error fetching workflow history:', workflowError);
      }

      // Get user activities related to content (views, edits, etc.)
      const { data: userActivityData, error: activityError } = await supabaseServer
        .from('user_activity')
        .select(`
          id,
          user_id,
          activity_type,
          description,
          metadata,
          created_at,
          user:profiles!user_id(id, display_name, email)
        `)
        .in('activity_type', ['content_created', 'content_updated', 'content_deleted', 'content_published'])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (activityError) {
        logger.warn('Error fetching user activities:', activityError);
      }

      // Combine and sort by created_at
      const combined = [
        ...(workflowData || []).map(item => ({
          ...item,
          activity_type: 'workflow_change',
          description: `Changed from ${item.from_state} to ${item.to_state}`
        })),
        ...(userActivityData || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, limit);

      return combined;
    } catch (error) {
      logger.error('Error fetching activities:', error);
      throw error;
    }
  }

  /**
   * Bulk operations
   */
  static async bulkUpdate(ids: string[], updates: Partial<ContentItem>): Promise<void> {
    try {
      const { error } = await supabaseServer
        .from('content')
        .update(updates)
        .in('id', ids);

      if (error) throw error;
    } catch (error) {
      logger.error('Error bulk updating content:', error);
      throw error;
    }
  }

  /**
   * Bulk delete
   */
  static async bulkDelete(ids: string[]): Promise<void> {
    try {
      const { error } = await supabaseServer
        .from('content')
        .delete()
        .in('id', ids);

      if (error) throw error;
    } catch (error) {
      logger.error('Error bulk deleting content:', error);
      throw error;
    }
  }
}
