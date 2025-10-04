import { defineMiddleware } from 'astro/middleware';

const PROTECTED = [/^\/admin(\/|$)/, /^\/api\/admin(\/|$)/];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const path = ctx.url.pathname;
  const needsAuth = PROTECTED.some(rx => rx.test(path));
  
  if (!needsAuth) return next();        // all public routes bypass

  // lightweight check (no Node APIs here)
  const isAuthed = Boolean(ctx.cookies.get('sb-access-token')?.value);
  if (!isAuthed) return ctx.redirect('/auth');
  
  return next();
});
