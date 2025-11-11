/**
 * Astro Content Collections Configuration
 * 
 * TODO: Add 'resources' collection for downloadable PDFs/guides
 * TODO: Add 'testimonies' collection for user stories
 * TODO: Consider adding 'events' collection for calendar/webinars
 */
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    excerpt: z.string().optional(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    readingTime: z.number().int().min(1),
    author: z.string().default('Real & Raw Gospel'),
    authorBio: z.string().optional(),
    featured: z.boolean().default(false),
    category: z.string().default('General'),
    coverImage: z.string().optional(),
    scriptures: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]),
  }),
});

const videos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    platform: z.enum(['youtube', 'tiktok', 'instagram', 'facebook']),
    videoId: z.string(),
    series: z.array(z.string()).default([]),
    topics: z.array(z.string()).default([]),
    scriptures: z.array(z.string()).default([]),
    publishedAt: z.date(),
  }),
});

const books = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    isbn: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    category: z.string().default('General'),
    publishedYear: z.number().optional(),
    publisher: z.string().optional(),
    pages: z.number().optional(),
    whyRecommended: z.string().optional(),
    warnings: z.string().optional(),
    affiliate: z.object({
      label: z.string(),
      url: z.string(),
      merchant: z.string(),
    }),
    alternativeLinks: z.array(z.object({
      label: z.string(),
      url: z.string(),
      merchant: z.string(),
    })).optional().default([]),
    topics: z.array(z.string()).default([]),
    slug: z.string().optional(),
    featured: z.boolean().default(false),
    addedDate: z.date().optional(),
  }),
});

const music = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['audio', 'video']),
    audioSrc: z.string().optional(),
    platform: z.enum(['youtube', 'tiktok', 'instagram', 'facebook']).optional(),
    videoId: z.string().optional(),
    scriptures: z.array(z.string()).default([]),
    slug: z.string().optional(),
  }),
});

export const collections = { blog, videos, books, music };

