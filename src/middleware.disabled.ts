/**
 * Astro Middleware
 * Handles authentication and route protection
 */
import { defineMiddleware } from 'astro:middleware';
import { supabaseServer } from './lib/supabase-server';

// Add error handling for unhandled rejections
if (typeof process !== 'undefined') {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED_REJECTION at:', promise, 'reason:', reason);
  });
  
  process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT_EXCEPTION:', error);
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  const pathname = url.pathname;

  // Admin routes that need protection
  const adminRoutes = ['/admin-dashboard', '/admin-login'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Check if user is authenticated for admin routes
  if (isAdminRoute) {
    try {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '') || 
                   request.headers.get('cookie')?.match(/sb-.*-auth-token=([^;]+)/)?.[1];

      if (token) {
        const { data: { user }, error } = await supabaseServer.auth.getUser(token);
        
        if (error || !user) {
          // Redirect to unified auth page if not authenticated
          return context.redirect('/auth?redirect=' + encodeURIComponent(pathname));
        } else {
          // Check if user has admin/editor role
          const { data: profile } = await supabaseServer
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profile?.role !== 'admin' && profile?.role !== 'editor') {
            return context.redirect('/auth?error=insufficient-permissions&redirect=' + encodeURIComponent(pathname));
          }
        }
      } else {
        // No token, redirect to unified auth page
        return context.redirect('/auth?redirect=' + encodeURIComponent(pathname));
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return context.redirect('/auth?redirect=' + encodeURIComponent(pathname));
    }
  }

  return next();
});
