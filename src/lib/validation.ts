/**
 * Zod validation schemas for API requests
 */

import { z } from 'zod';

// Blog post validation
export const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z.string().min(1).max(500),
  body: z.string().min(1),
  tags: z.array(z.string()).max(20).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Video validation
export const videoSchema = z.object({
  title: z.string().min(1).max(200),
  platform: z.enum(['youtube', 'tiktok', 'instagram', 'facebook']),
  video_id: z.string().min(1),
  series: z.string().optional(),
  topics: z.array(z.string()).max(20).default([]),
  scriptures: z.array(z.string()).default([]),
  notes: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Music validation
export const musicSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(['audio', 'video']),
  audio_file: z.string().optional(),
  platform: z.enum(['youtube', 'tiktok', 'instagram', 'facebook']).optional(),
  video_id: z.string().optional(),
  scriptures: z.array(z.string()).default([]),
  description: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Book validation
export const bookSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  description: z.string().min(1),
  affiliate_url: z.string().url().optional(),
  topics: z.array(z.string()).max(20).default([]),
  body: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Auth validation
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Generic content update schema
export const contentUpdateSchema = z.object({
  id: z.string().uuid(),
  data: z.record(z.any()),
});

// Validate and parse request body
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

