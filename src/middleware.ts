import { defineMiddleware } from 'astro/middleware';
import { createServerClient } from '@supabase/ssr';
import { logger } from './lib/logger';
import { validateEnv } from './lib/env';
import { checkRateLimit, getRateLimitKey, getRateLimitOptions, getClientIdentifier } from './lib/rate-limit';

// Define protected routes
const ADMIN_ROUTES = [/^\/admin(\/|$)/, /^\/api\/admin(\/|$)/];
const CMS_ROUTES = [/^\/cms(\/|$)/, /^\/api\/cms(\/|$)/];
const EDITOR_ROUTES = [/^\/api\/content(\/|$)/];
const API_ROUTES = [/^\/api\//];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const pathname = ctx.url.pathname;
  
  // Apply rate limiting to API routes
  const isApiRoute = API_ROUTES.some(rx => rx.test(pathname));
  let rateLimitInfo:
    | null
    | {
        limit: number;
        remaining: number;
        resetTime: number;
      } = null;
  if (isApiRoute) {
    const clientId = getClientIdentifier(ctx.request);
    const options = getRateLimitOptions(pathname);
    const key = getRateLimitKey(clientId, pathname);
    const rateLimit = checkRateLimit(key, options);

    if (!rateLimit.allowed) {
      logger.warn(`Rate limit exceeded for ${pathname} from ${clientId}`);
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(options.maxRequests),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          },
        }
      );
    }

    rateLimitInfo = {
      limit: options.maxRequests,
      remaining: rateLimit.remaining,
      resetTime: rateLimit.resetTime,
    };
  }
  
  // Check if route needs admin access
  const needsAdmin = ADMIN_ROUTES.some(rx => rx.test(pathname));
  const needsCMS = CMS_ROUTES.some(rx => rx.test(pathname));
  const needsEditor = EDITOR_ROUTES.some(rx => rx.test(pathname));
  
  // If no special access needed, continue
  if (!needsAdmin && !needsCMS && !needsEditor) {
    const res = await next();
    // Add rate limit headers on the final response (for API routes)
    if (isApiRoute && rateLimitInfo) {
      res.headers.set('X-RateLimit-Limit', String(rateLimitInfo.limit));
      res.headers.set('X-RateLimit-Remaining', String(rateLimitInfo.remaining));
      res.headers.set('X-RateLimit-Reset', String(rateLimitInfo.resetTime));
    }
    return res;
  }

  logger.debug(`[Middleware] Checking access for ${pathname} - Admin: ${needsAdmin}, CMS: ${needsCMS}, Editor: ${needsEditor}`);

  try {
    const env = validateEnv();
    const supabase = createServerClient(
      env.PUBLIC_SUPABASE_URL,
      env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (k) => ctx.cookies.get(k)?.value,
          set: (k, v, o) => ctx.cookies.set(k, v, { ...o, path: '/' }),
          remove: (k, o) => ctx.cookies.delete(k, { ...o, path: '/' }),
        }
      }
    );

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      logger.error('[Middleware] Auth error:', authError);
      return ctx.redirect('/auth?error=auth-failed&redirect=' + encodeURIComponent(pathname));
    }
    
    if (!user) {
      logger.debug(`[Middleware] No user found for ${pathname}, redirecting to auth`);
      return ctx.redirect('/auth?redirect=' + encodeURIComponent(pathname));
    }

    logger.debug(`[Middleware] User found: ${user.email}`);

    // Check if user is admin by querying user_roles table directly
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (rolesError) {
      logger.error('[Middleware] Roles check error:', rolesError);
      return ctx.redirect('/auth?error=role-check-failed&redirect=' + encodeURIComponent(pathname));
    }

    const isAdmin = userRoles && userRoles.length > 0;
    const isEditor = isAdmin; // For now, only admins can access
    const userRole = isAdmin ? 'admin' : 'user';

    logger.debug(`[Middleware] User role: ${userRole}, isAdmin: ${isAdmin}, isEditor: ${isEditor}`);

    // Check permissions based on route requirements
    if (needsAdmin && !isAdmin) {
      logger.debug(`[Middleware] Access denied: ${pathname} requires admin, user is ${userRole}`);
      return ctx.redirect('/auth?error=insufficient-permissions&redirect=' + encodeURIComponent(pathname));
    }

    if (needsCMS && !isEditor) {
      logger.debug(`[Middleware] Access denied: ${pathname} requires editor/admin, user is ${userRole}`);
      return ctx.redirect('/auth?error=insufficient-permissions&redirect=' + encodeURIComponent(pathname));
    }

    if (needsEditor && !isEditor) {
      logger.debug(`[Middleware] Access denied: ${pathname} requires editor/admin, user is ${userRole}`);
      return ctx.redirect('/auth?error=insufficient-permissions&redirect=' + encodeURIComponent(pathname));
    }

    // Add user info to context for use in pages
    ctx.locals.user = user;
    ctx.locals.userRole = userRole;
    ctx.locals.isAdmin = isAdmin;
    ctx.locals.isEditor = isEditor;

    logger.debug(`[Middleware] Access granted for ${pathname}`);
    const res = await next();
    if (isApiRoute && rateLimitInfo) {
      res.headers.set('X-RateLimit-Limit', String(rateLimitInfo.limit));
      res.headers.set('X-RateLimit-Remaining', String(rateLimitInfo.remaining));
      res.headers.set('X-RateLimit-Reset', String(rateLimitInfo.resetTime));
    }
    return res;
    
  } catch (error) {
    logger.error('[Middleware] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    const errorType = errorMessage.includes('auth') ? 'auth-failed' : 
                     errorMessage.includes('role') ? 'role-check-failed' : 
                     errorMessage.includes('database') ? 'database-error' : 'server-error';
    
    logger.error('[Middleware] Error details:', {
      errorType,
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      pathname
    });
    
    return ctx.redirect(`/auth?error=${errorType}&redirect=${encodeURIComponent(pathname)}`);
  }
});