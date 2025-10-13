import { defineMiddleware } from 'astro/middleware';
import { createServerClient } from '@supabase/ssr';

// Define protected routes
const ADMIN_ROUTES = [/^\/admin(\/|$)/, /^\/api\/admin(\/|$)/];
const CMS_ROUTES = [/^\/cms(\/|$)/, /^\/api\/cms(\/|$)/];
const EDITOR_ROUTES = [/^\/api\/content(\/|$)/];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const pathname = ctx.url.pathname;
  
  // Check if route needs admin access
  const needsAdmin = ADMIN_ROUTES.some(rx => rx.test(pathname));
  const needsCMS = CMS_ROUTES.some(rx => rx.test(pathname));
  const needsEditor = EDITOR_ROUTES.some(rx => rx.test(pathname));
  
  // If no special access needed, continue
  if (!needsAdmin && !needsCMS && !needsEditor) return next();

  console.log(`[Middleware] Checking access for ${pathname} - Admin: ${needsAdmin}, CMS: ${needsCMS}, Editor: ${needsEditor}`);

  try {
    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL!,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
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
      console.error('[Middleware] Auth error:', authError);
      return ctx.redirect('/auth?error=auth-failed&redirect=' + encodeURIComponent(pathname));
    }
    
    if (!user) {
      console.log(`[Middleware] No user found for ${pathname}, redirecting to auth`);
      return ctx.redirect('/auth?redirect=' + encodeURIComponent(pathname));
    }

    console.log(`[Middleware] User found: ${user.email}`);

    // Check if user is admin by querying user_roles table directly
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (rolesError) {
      console.error('[Middleware] Roles check error:', rolesError);
      return ctx.redirect('/auth?error=role-check-failed&redirect=' + encodeURIComponent(pathname));
    }

    const isAdmin = userRoles && userRoles.length > 0;
    const isEditor = isAdmin; // For now, only admins can access
    const userRole = isAdmin ? 'admin' : 'user';

    console.log(`[Middleware] User role: ${userRole}, isAdmin: ${isAdmin}, isEditor: ${isEditor}`);

    // Check permissions based on route requirements
    if (needsAdmin && !isAdmin) {
      console.log(`[Middleware] Access denied: ${pathname} requires admin, user is ${userRole}`);
      return ctx.redirect('/auth?error=insufficient-permissions&redirect=' + encodeURIComponent(pathname));
    }

    if (needsCMS && !isEditor) {
      console.log(`[Middleware] Access denied: ${pathname} requires editor/admin, user is ${userRole}`);
      return ctx.redirect('/auth?error=insufficient-permissions&redirect=' + encodeURIComponent(pathname));
    }

    if (needsEditor && !isEditor) {
      console.log(`[Middleware] Access denied: ${pathname} requires editor/admin, user is ${userRole}`);
      return ctx.redirect('/auth?error=insufficient-permissions&redirect=' + encodeURIComponent(pathname));
    }

    // Add user info to context for use in pages
    ctx.locals.user = user;
    ctx.locals.userRole = userRole;
    ctx.locals.isAdmin = isAdmin;
    ctx.locals.isEditor = isEditor;

    console.log(`[Middleware] Access granted for ${pathname}`);
    return next();
    
  } catch (error) {
    console.error('[Middleware] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    const errorType = errorMessage.includes('auth') ? 'auth-failed' : 
                     errorMessage.includes('role') ? 'role-check-failed' : 
                     errorMessage.includes('database') ? 'database-error' : 'server-error';
    
    console.error('[Middleware] Error details:', {
      errorType,
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      pathname
    });
    
    return ctx.redirect(`/auth?error=${errorType}&redirect=${encodeURIComponent(pathname)}`);
  }
});