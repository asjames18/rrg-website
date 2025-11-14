import type { APIRoute } from 'astro';
import { logger } from '../../../lib/logger';

import { supabaseServer } from '../../../lib/supabase-server';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = supabaseServer(cookies);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user has editor or admin role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isEditor = userRoles && userRoles.some(role => ['admin', 'editor'].includes(role.role));
    if (!isEditor) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { 
      title, 
      author, 
      description, 
      slug,
      cover_image_url,
      isbn,
      rating,
      level,
      category,
      published_year,
      publisher,
      pages,
      affiliate_label,
      affiliate_url, 
      affiliate_merchant,
      alternative_links,
      topics, 
      why_recommended,
      warnings,
      body: content, 
      featured,
      status 
    } = body;

    // Validate required fields
    if (!title || !author || !description) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate slug from title if not provided
    let bookSlug = slug;
    if (!bookSlug) {
      bookSlug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Prepare metadata object for additional fields
    const metadata: any = {};
    if (cover_image_url) metadata.coverImageUrl = cover_image_url;
    if (isbn) metadata.isbn = isbn;
    if (rating) metadata.rating = rating;
    if (level) metadata.level = level;
    if (category) metadata.category = category;
    if (published_year) metadata.publishedYear = published_year;
    if (publisher) metadata.publisher = publisher;
    if (pages) metadata.pages = pages;
    if (why_recommended) metadata.whyRecommended = why_recommended;
    if (warnings) metadata.warnings = warnings;
    if (alternative_links && alternative_links.length > 0) {
      metadata.alternativeLinks = alternative_links;
    }

    // Prepare affiliate object
    const affiliate: any = {};
    if (affiliate_url) {
      affiliate.url = affiliate_url;
      affiliate.label = affiliate_label || 'Buy Now';
      affiliate.merchant = affiliate_merchant || 'amazon';
    }

    // Create book
    const bookData: any = {
        title,
      slug: bookSlug,
        author_name: author,
        description,
        topics: topics || [],
        body_md: content || null,
        published: status === 'published',
        published_at: status === 'published' ? new Date().toISOString() : null,
        author: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // Add optional fields if they exist
    if (Object.keys(affiliate).length > 0) {
      bookData.affiliate_url = affiliate.url;
      bookData.affiliate_label = affiliate.label;
      bookData.affiliate_merchant = affiliate.merchant;
    }

    // Store metadata as JSON if we have any
    if (Object.keys(metadata).length > 0) {
      bookData.metadata = metadata;
    }

    // Add featured flag if provided
    if (featured !== undefined) {
      bookData.featured = featured;
    }

    const { data, error } = await supabase
      .from('books')
      .insert(bookData)
      .select()
      .single();

    if (error) {
      logger.error('Error creating book:', error);
      return new Response(JSON.stringify({ error: 'Failed to create book' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data,
      message: 'Book created successfully' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    logger.error('Book creation error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


