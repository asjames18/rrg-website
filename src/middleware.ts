import { defineMiddleware } from 'astro/middleware';
import { createServerClient } from '@supabase/ssr';

const ADMIN = [/^\/admin(\/|$)/, /^\/api\/admin(\/|$)/];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const needsAdmin = ADMIN.some(rx => rx.test(ctx.url.pathname));
  if (!needsAdmin) return next();

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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return ctx.redirect('/auth');

  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error || !isAdmin) return ctx.redirect('/');

  return next();
});