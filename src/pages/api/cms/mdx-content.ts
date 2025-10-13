import type { APIRoute } from 'astro';
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

export const GET: APIRoute = async ({ url }) => {
  try {
    const contentPath = url.searchParams.get('path');
    if (!contentPath) {
      return new Response(JSON.stringify({ error: 'Content path is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read the MDX file
    const fullPath = join(process.cwd(), 'src/content', contentPath);
    const content = await readFile(fullPath, 'utf-8');

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reading MDX content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to read content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { path, content } = await request.json();
    
    if (!path || !content) {
      return new Response(JSON.stringify({ error: 'Path and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Write the updated MDX file
    const fullPath = join(process.cwd(), 'src/content', path);
    await writeFile(fullPath, content, 'utf-8');

    return new Response(JSON.stringify({ 
      message: 'Content updated successfully',
      path: fullPath
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating MDX content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { type, title, slug, content } = await request.json();
    
    if (!type || !title || !content) {
      return new Response(JSON.stringify({ error: 'Type, title, and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Create the MDX file content
    const mdxContent = `---
title: "${title}"
slug: "${finalSlug}"
${type === 'blog' ? `tags: []
summary: "Enter your summary here"
publishedAt: ${new Date().toISOString()}
readingTime: 5` : ''}
${type === 'video' ? `platform: "youtube"
videoId: "your-video-id"
series: []
topics: []
scriptures: []
publishedAt: ${new Date().toISOString()}` : ''}
${type === 'book' ? `author: "Author Name"
affiliate:
  label: "Get the book"
  url: "https://example.com"
  merchant: "Example Store"
topics: []` : ''}
${type === 'music' ? `type: "audio"
audioSrc: "/audio/your-file.mp3"
scriptures: []` : ''}
---

${content}`;

    // Write the new MDX file
    const fileName = `${finalSlug}.mdx`;
    const fullPath = join(process.cwd(), 'src/content', type, fileName);
    await writeFile(fullPath, mdxContent, 'utf-8');

    return new Response(JSON.stringify({ 
      message: 'Content created successfully',
      path: fullPath,
      slug: finalSlug
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating MDX content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  try {
    const contentPath = url.searchParams.get('path');
    if (!contentPath) {
      return new Response(JSON.stringify({ error: 'Content path is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the MDX file
    const fullPath = join(process.cwd(), 'src/content', contentPath);
    await writeFile(fullPath, '', 'utf-8'); // Clear the file instead of deleting

    return new Response(JSON.stringify({ 
      message: 'Content deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting MDX content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
