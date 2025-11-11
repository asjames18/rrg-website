/**
 * CSRF protection utility
 * Generates and validates CSRF tokens for state-changing operations
 */

// CSRF token generation using Web Crypto API (works in both Node and browser)
function randomBytes(length: number): Uint8Array {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(length));
  }
  // Fallback for environments without crypto
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_HEADER = 'X-CSRF-Token';

// In-memory token store (for production, use Redis or session storage)
const tokenStore = new Map<string, { token: string; expires: number }>();

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tokenStore.entries()) {
    if (value.expires < now) {
      tokenStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export function generateCsrfToken(sessionId: string): string {
  const bytes = randomBytes(CSRF_TOKEN_LENGTH);
  const token = bytesToHex(bytes);
  const expires = Date.now() + 3600000; // 1 hour
  
  tokenStore.set(sessionId, { token, expires });
  
  return token;
}

export function validateCsrfToken(sessionId: string, token: string): boolean {
  const stored = tokenStore.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  if (stored.expires < Date.now()) {
    tokenStore.delete(sessionId);
    return false;
  }
  
  // Use timing-safe comparison
  return timingSafeEqual(stored.token, token);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

export function getCsrfTokenFromRequest(request: Request): string | null {
  return request.headers.get(CSRF_TOKEN_HEADER);
}

export function requireCsrfToken(sessionId: string, request: Request): { valid: boolean; error?: string } {
  const token = getCsrfTokenFromRequest(request);
  
  if (!token) {
    return { valid: false, error: 'CSRF token missing' };
  }
  
  if (!validateCsrfToken(sessionId, token)) {
    return { valid: false, error: 'Invalid CSRF token' };
  }
  
  return { valid: true };
}

