/**
 * Input sanitization utilities
 * Sanitizes user input to prevent XSS and injection attacks
 */

import validator from 'validator';

/**
 * Sanitize a string input
 */
export function sanitizeString(input: unknown, maxLength = 10000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Basic XSS prevention - escape HTML
  sanitized = validator.escape(sanitized);
  
  return sanitized;
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  const email = input.trim().toLowerCase();
  
  if (!validator.isEmail(email)) {
    return '';
  }
  
  return email;
}

/**
 * Sanitize a URL
 */
export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  const url = input.trim();
  
  if (!validator.isURL(url, { require_protocol: true })) {
    return '';
  }
  
  // Ensure it's http or https
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return '';
  }
  
  return url;
}

/**
 * Sanitize a slug (alphanumeric, hyphens, underscores)
 */
export function sanitizeSlug(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return validator.whitelist(input.trim().toLowerCase(), 'a-z0-9-_');
}

/**
 * Sanitize an array of strings
 */
export function sanitizeStringArray(input: unknown, maxLength = 100): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  
  return input
    .slice(0, maxLength)
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0);
}

/**
 * Sanitize markdown content (less strict, allows markdown syntax)
 */
export function sanitizeMarkdown(input: unknown, maxLength = 100000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  let sanitized = input.trim().slice(0, maxLength);
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove script tags and event handlers (basic XSS prevention)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  return sanitized;
}

/**
 * Sanitize a number (integer)
 */
export function sanitizeInteger(input: unknown, min = -Infinity, max = Infinity): number | null {
  if (typeof input === 'number') {
    const num = Math.round(input);
    return (num >= min && num <= max) ? num : null;
  }
  
  if (typeof input === 'string') {
    const num = parseInt(input, 10);
    if (isNaN(num)) {
      return null;
    }
    return (num >= min && num <= max) ? num : null;
  }
  
  return null;
}

/**
 * Sanitize request body - recursively sanitize object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T, schema?: Record<string, (val: any) => any>): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }
  
  const sanitized = { ...obj };
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (schema && schema[key]) {
      sanitized[key] = schema[key](value);
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeStringArray(value);
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, schema);
    }
  }
  
  return sanitized;
}

