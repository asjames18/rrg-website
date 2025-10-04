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
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    publishedAt: z.date(),
    readingTime: z.number().int().min(1),
  }),
});

const videos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
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
    affiliate: z.object({
      label: z.string(),
      url: z.string(),
      merchant: z.string(),
    }),
    topics: z.array(z.string()).default([]),
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
  }),
});

export const collections = { blog, videos, books, music };

