/**
 * Simple in-memory rate limiting middleware
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

const defaultOptions: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
};

// Stricter limits for auth endpoints
const authRateLimit: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
};

// Stricter limits for CMS endpoints
const cmsRateLimit: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
};

export function getRateLimitKey(identifier: string, path: string): string {
  return `${identifier}:${path}`;
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = defaultOptions
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = store[key];

  // Clean up expired entries periodically (simple cleanup)
  if (Math.random() < 0.01) {
    // 1% chance to clean up on each request
    Object.keys(store).forEach((k) => {
      if (store[k].resetTime < now) {
        delete store[k];
      }
    });
  }

  if (!record || record.resetTime < now) {
    // New window or expired, reset
    store[key] = {
      count: 1,
      resetTime: now + options.windowMs,
    };
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    };
  }

  if (record.count >= options.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  return {
    allowed: true,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

export function getRateLimitOptions(path: string): RateLimitOptions {
  // Auth endpoints get stricter limits
  if (path.startsWith('/api/auth/')) {
    return authRateLimit;
  }
  
  // CMS endpoints get moderate limits
  if (path.startsWith('/api/cms/')) {
    return cmsRateLimit;
  }
  
  // Default limits for other endpoints
  return defaultOptions;
}

export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for proxy/load balancer scenarios)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0]?.trim() || 
             realIp || 
             cfConnectingIp || 
             'unknown';
  
  return ip;
}

