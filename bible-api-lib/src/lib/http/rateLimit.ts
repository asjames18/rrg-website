/**
 * Simple in-memory rate limiting middleware
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import type { RateLimitInfo } from '../../types/index';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

interface RateLimitStore {
  [key: string]: RateLimitInfo;
}

// In-memory store for rate limiting
const rateLimitStore: RateLimitStore = {};

// Default configuration
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  message: 'Too many requests, please try again later.'
};

/**
 * Get client identifier from request
 * @param req - The request object
 * @returns Client identifier string
 */
function getClientId(req: NextApiRequest): string {
  // Try to get real IP from various headers
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  
  let ip = '';
  
  if (forwarded) {
    ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
  } else if (realIp) {
    ip = Array.isArray(realIp) ? realIp[0] : realIp;
  } else if (cfConnectingIp) {
    ip = Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;
  } else {
    ip = req.socket.remoteAddress || 'unknown';
  }
  
  return ip.trim();
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [clientId, info] of Object.entries(rateLimitStore)) {
    if (now - info.windowStart > info.windowMs) {
      delete rateLimitStore[clientId];
    }
  }
}

/**
 * Check if a client has exceeded the rate limit
 * @param clientId - The client identifier
 * @param config - Rate limit configuration
 * @returns Rate limit info and whether the limit is exceeded
 */
function checkRateLimit(clientId: string, config: RateLimitConfig): { info: RateLimitInfo; exceeded: boolean } {
  const now = Date.now();
  const windowMs = config.windowMs;
  const maxRequests = config.maxRequests;
  
  let info = rateLimitStore[clientId];
  
  if (!info) {
    // First request from this client
    info = {
      requests: 1,
      windowStart: now,
      limit: maxRequests,
      windowMs: windowMs
    };
    rateLimitStore[clientId] = info;
    return { info, exceeded: false };
  }
  
  // Check if the window has expired
  if (now - info.windowStart > windowMs) {
    // Reset the window
    info.requests = 1;
    info.windowStart = now;
    rateLimitStore[clientId] = info;
    return { info, exceeded: false };
  }
  
  // Increment request count
  info.requests++;
  rateLimitStore[clientId] = info;
  
  return { info, exceeded: info.requests > maxRequests };
}

/**
 * Create rate limiting middleware
 * @param config - Rate limit configuration
 * @returns Middleware function
 */
export function createRateLimit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  return (req: NextApiRequest, res: NextApiResponse, next?: () => void) => {
    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      cleanupExpiredEntries();
    }
    
    const clientId = getClientId(req);
    const { info, exceeded } = checkRateLimit(clientId, finalConfig);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', info.limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, info.limit - info.requests));
    res.setHeader('X-RateLimit-Reset', new Date(info.windowStart + info.windowMs).toISOString());
    
    if (exceeded) {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: finalConfig.message || 'Too many requests, please try again later.'
        }
      });
      return;
    }
    
    if (next) {
      next();
    }
  };
}

/**
 * Get rate limit information for a client
 * @param clientId - The client identifier
 * @returns Rate limit information or null if not found
 */
export function getRateLimitInfo(clientId: string): RateLimitInfo | null {
  return rateLimitStore[clientId] || null;
}

/**
 * Reset rate limit for a client
 * @param clientId - The client identifier
 */
export function resetRateLimit(clientId: string): void {
  delete rateLimitStore[clientId];
}

/**
 * Get all active rate limit entries (for debugging)
 * @returns Object with all active rate limit entries
 */
export function getAllRateLimits(): RateLimitStore {
  return { ...rateLimitStore };
}

/**
 * Clear all rate limit entries
 */
export function clearAllRateLimits(): void {
  for (const key in rateLimitStore) {
    delete rateLimitStore[key];
  }
}
