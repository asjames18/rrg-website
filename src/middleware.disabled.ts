import { defineMiddleware } from 'astro/middleware';

const PROTECTED = [/^\/admin(\/|$)/, /^\/api\/admin(\/|$)/];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const path = ctx.url.pathname;
  const needsAuth = PROTECTED.some(rx => rx.test(path));
  
  // If not a protected route, just continue
  if (!needsAuth) {
    return next();
  }

  // For protected routes, check for auth cookie
  try {
    const authCookie = ctx.cookies.get('sb-access-token');
    const isAuthed = Boolean(authCookie?.value);
    
    if (!isAuthed) {
      // Use Astro's redirect instead of ctx.redirect
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/auth'
        }
      });
    }
    
    return next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error, just continue to avoid breaking the site
    return next();
  }
});
