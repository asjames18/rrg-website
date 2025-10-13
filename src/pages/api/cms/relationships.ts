import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const contentId = url.searchParams.get('id');
    const type = url.searchParams.get('type') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!contentId) {
      return new Response(JSON.stringify({ 
        error: 'Content ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all content collections
    const blogPosts = await getCollection('blog');
    const videos = await getCollection('videos');
    const books = await getCollection('books');
    const music = await getCollection('music');

    // Find the target content
    const allContent = [
      ...blogPosts.map(post => ({ ...post, contentType: 'blog' })),
      ...videos.map(video => ({ ...video, contentType: 'videos' })),
      ...books.map(book => ({ ...book, contentType: 'books' })),
      ...music.map(track => ({ ...track, contentType: 'music' }))
    ];

    const targetContent = allContent.find(item => item.id === contentId);
    if (!targetContent) {
      return new Response(JSON.stringify({ 
        error: 'Content not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find related content based on tags, topics, and keywords
    const relatedContent = [];
    const targetTags = targetContent.data.tags || [];
    const targetTopics = targetContent.data.topics || [];
    const targetScriptures = targetContent.data.scriptures || [];

    for (const item of allContent) {
      if (item.id === contentId) continue; // Skip self

      let score = 0;
      const itemTags = item.data.tags || [];
      const itemTopics = item.data.topics || [];
      const itemScriptures = item.data.scriptures || [];

      // Score based on shared tags
      const sharedTags = targetTags.filter(tag => itemTags.includes(tag));
      score += sharedTags.length * 3;

      // Score based on shared topics
      const sharedTopics = targetTopics.filter(topic => itemTopics.includes(topic));
      score += sharedTopics.length * 2;

      // Score based on shared scriptures
      const sharedScriptures = targetScriptures.filter(scripture => itemScriptures.includes(scripture));
      score += sharedScriptures.length * 4;

      // Score based on content type similarity
      if (item.contentType === targetContent.contentType) {
        score += 1;
      }

      // Score based on author similarity
      if (item.data.author === targetContent.data.author) {
        score += 2;
      }

      if (score > 0) {
        relatedContent.push({
          ...item,
          relevanceScore: score,
          sharedTags,
          sharedTopics,
          sharedScriptures
        });
      }
    }

    // Sort by relevance score and apply limit
    const sortedRelated = relatedContent
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map(item => ({
        id: item.id,
        slug: item.slug,
        title: item.data.title,
        type: item.contentType,
        status: item.data.status,
        featured: item.data.featured,
        publishedAt: item.data.publishedAt.toISOString(),
        summary: item.data.summary,
        author: item.data.author,
        relevanceScore: item.relevanceScore,
        sharedTags: item.sharedTags,
        sharedTopics: item.sharedTopics,
        sharedScriptures: item.sharedScriptures
      }));

    const response = {
      targetContent: {
        id: targetContent.id,
        title: targetContent.data.title,
        type: targetContent.contentType,
        tags: targetTags,
        topics: targetTopics,
        scriptures: targetScriptures
      },
      relatedContent: sortedRelated,
      totalFound: relatedContent.length,
      limit,
      lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Error fetching content relationships:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch relationships',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { sourceId, targetId, relationshipType, metadata } = body;

    if (!sourceId || !targetId || !relationshipType) {
      return new Response(JSON.stringify({ 
        error: 'sourceId, targetId, and relationshipType are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validTypes = ['related', 'series', 'prerequisite', 'follow-up', 'reference'];
    if (!validTypes.includes(relationshipType)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid relationship type. Must be one of: ' + validTypes.join(', ') 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // In a real implementation, you would store this in a database
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = {
      success: true,
      message: 'Relationship created successfully',
      relationship: {
        id: `rel-${Date.now()}`,
        sourceId,
        targetId,
        type: relationshipType,
        metadata: metadata || {},
        createdAt: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error creating relationship:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create relationship',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  try {
    const relationshipId = url.searchParams.get('id');
    
    if (!relationshipId) {
      return new Response(JSON.stringify({ 
        error: 'Relationship ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // In a real implementation, you would delete from a database
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = {
      success: true,
      message: `Relationship ${relationshipId} deleted successfully`,
      deletedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error deleting relationship:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete relationship',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};




