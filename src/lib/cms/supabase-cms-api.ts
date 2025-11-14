/**
 * Supabase CMS API Client
 * Works with Supabase database for content management
 */

import { supabaseAdmin } from '../supabase-admin';
import { logger } from '../logger';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: 'blog' | 'video' | 'book' | 'music';
  status: 'draft' | 'published' | 'archived';
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
  description?: string;
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

export class SupabaseCMSAPI {
  /**
   * Get content statistics
   */
  static async getStats(): Promise<ContentStats> {
    try {
      const supabase = supabaseAdmin();

      // Get total counts
      const { data: contentCounts, error: countError } = await supabase
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
      const { data: recentContent, error: recentError } = await supabase
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

      const supabase = supabaseAdmin();

      let query = supabase
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
      let countQuery = supabase.from('content').select('id', { count: 'exact', head: true });
      
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
   * Get single content item by slug
   */
  static async getContentBySlug(slug: string, options: { type?: string; status?: string } = {}): Promise<ContentItem | null> {
    try {
      const supabase = supabaseAdmin();
      let query = supabase
        .from('content')
        .select(`
          *,
          tags:content_tags(tags(*)),
          media:content_media(media_library(*))
        `)
        .eq('slug', slug);

      if (options.type && options.type !== 'all') {
        query = query.eq('content_type', options.type);
      }
      if (options.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }

      const { data, error } = await query.single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching content by slug:', error);
      throw error;
    }
  }

  /**
   * Get single content item
   */
  static async getContentById(id: string): Promise<ContentItem | null> {
    try {
      const supabase = supabaseAdmin();
      
      const { data, error } = await supabase
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
      const supabase = supabaseAdmin();
      
      // Filter out relationship fields that aren't columns in the content table
      const { tags, media, ...contentData } = content;
      
      // Ensure required fields are set
      const now = new Date().toISOString();
      const insertData: any = {
        ...contentData,
        // Ensure metadata is an object, not null or undefined
        metadata: contentData.metadata || {},
        // Set timestamps if not provided
        created_at: contentData.created_at || now,
        updated_at: contentData.updated_at || now,
        // Ensure featured is a boolean
        featured: contentData.featured ?? false,
        // Ensure status is set (default to draft)
        status: contentData.status || 'draft',
      };

      // Filter out undefined/null values that might cause issues
      Object.keys(insertData).forEach(key => {
        if (insertData[key] === undefined) {
          delete insertData[key];
        }
      });

      logger.info('[createContent] Inserting content with data:', {
        title: insertData.title,
        slug: insertData.slug,
        content_type: insertData.content_type,
        status: insertData.status,
        featured: insertData.featured,
        hasMetadata: !!insertData.metadata,
        metadataKeys: insertData.metadata ? Object.keys(insertData.metadata) : []
      });

      const { data, error } = await supabase
        .from('content')
        .insert([insertData])
        .select(`
          *,
          tags:content_tags(tags(*)),
          media:content_media(media_library(*))
        `)
        .single();

      if (error) {
        logger.error('[createContent] Database error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          insertData: {
            title: insertData.title,
            slug: insertData.slug,
            content_type: insertData.content_type,
            status: insertData.status
          }
        });
        throw error;
      }
      
      // Create tag relationships if tags were provided
      if (tags && Array.isArray(tags) && tags.length > 0 && data.id) {
        try {
          const tagRelationships = tags.map((tagId: string) => ({
            content_id: data.id,
            tag_id: tagId
          }));
          
          const { error: tagError } = await supabase
            .from('content_tags')
            .insert(tagRelationships);
          
          if (tagError) {
            logger.warn('[createContent] Error creating tag relationships:', tagError);
            // Don't fail the entire operation if tags fail
          } else {
            logger.info('[createContent] Created tag relationships:', tags.length);
          }
        } catch (tagErr) {
          logger.warn('[createContent] Exception creating tag relationships:', tagErr);
          // Don't fail the entire operation if tags fail
        }
      }
      
      // Fetch the content again with updated tag relationships
      if (tags && Array.isArray(tags) && tags.length > 0) {
        const { data: updatedContent, error: fetchError } = await supabase
          .from('content')
          .select(`
            *,
            tags:content_tags(tags(*)),
            media:content_media(media_library(*))
          `)
          .eq('id', data.id)
          .single();
        
        if (!fetchError && updatedContent) {
          logger.info('[createContent] Content created successfully with tags:', data.id);
          return updatedContent;
        }
      }
      
      logger.info('[createContent] Content created successfully:', data.id);
      return data;
    } catch (error: any) {
      logger.error('[createContent] Error creating content:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        stack: error?.stack
      });
      throw error;
    }
  }

  /**
   * Update content
   */
  static async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const supabase = supabaseAdmin();
      
      // Filter out relationship fields that aren't columns in the content table
      const { tags, media, ...contentUpdates } = updates;
      
      // If status is being changed to 'published', ensure published_at is set
      // First, check if we need to fetch current content to see existing published_at
      if (contentUpdates.status === 'published') {
        // If published_at is not in the updates, we need to check if it exists in the database
        if (!contentUpdates.published_at) {
          // Fetch current content to check if published_at already exists
          const { data: currentContent } = await supabase
            .from('content')
            .select('published_at')
            .eq('id', id)
            .single();
          
          // Only set published_at if it doesn't already exist
          if (!currentContent?.published_at) {
            contentUpdates.published_at = new Date().toISOString();
            logger.info(`[SupabaseCMSAPI] Auto-setting published_at for content ${id}`);
          } else {
            logger.info(`[SupabaseCMSAPI] Content ${id} already has published_at, keeping existing value`);
          }
        }
      }
      
      // Remove any undefined or null values that might cause issues
      // But preserve published_at even if it's in the original updates
      const cleanUpdates = Object.fromEntries(
        Object.entries(contentUpdates).filter(([_, v]) => v !== undefined && v !== null)
      );
      
      logger.info(`[SupabaseCMSAPI] Updating content ${id} with fields:`, Object.keys(cleanUpdates));
      
      const { data, error } = await supabase
        .from('content')
        .update(cleanUpdates)
        .eq('id', id)
        .select(`
          *,
          tags:content_tags(tags(*)),
          media:content_media(media_library(*))
        `)
        .single();

      if (error) {
        logger.error('[SupabaseCMSAPI] Supabase error updating content:', error);
        throw new Error(`Database error: ${error.message || JSON.stringify(error)}`);
      }
      
      if (!data) {
        throw new Error('Content not found or update returned no data');
      }
      
      return data;
    } catch (error) {
      logger.error('[SupabaseCMSAPI] Error updating content:', error);
      // Re-throw with better error message
      if (error instanceof Error) {
      throw error;
      }
      throw new Error(`Failed to update content: ${String(error)}`);
    }
  }

  /**
   * Delete content
   */
  static async deleteContent(id: string): Promise<void> {
    try {
      const supabase = supabaseAdmin();
      
      const { error } = await supabase
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
      const supabase = supabaseAdmin();
      
      const { data, error } = await supabase
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
      const supabase = supabaseAdmin();
      
      const { data, error } = await supabase
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

      const supabase = supabaseAdmin();

      let query = supabase
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
      let countQuery = supabase.from('media_library').select('id', { count: 'exact', head: true });
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
      const supabase = supabaseAdmin();
      
      // Get workflow history (content state changes)
      // Note: changed_by is a UUID referencing auth.users.id, not profiles
      // We'll fetch without the join to avoid foreign key errors
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflow_history')
        .select(`
          id,
          content_id,
          content_type,
          from_state,
          to_state,
          changed_by,
          comment,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (workflowError) {
        logger.warn('Error fetching workflow history:', workflowError);
      }

      // Get user activities related to content (views, edits, etc.)
      // Note: user_id is a UUID referencing auth.users.id, not profiles
      // We'll fetch without the join to avoid foreign key errors
      const { data: userActivityData, error: activityError } = await supabase
        .from('user_activity')
        .select(`
          id,
          user_id,
          activity_type,
          description,
          metadata,
          created_at
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
      const supabase = supabaseAdmin();
      
      const { error } = await supabase
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
      const supabase = supabaseAdmin();
      
      const { error } = await supabase
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
