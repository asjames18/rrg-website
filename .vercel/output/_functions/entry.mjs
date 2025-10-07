import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bf-w0gbH.mjs';
import { manifest } from './manifest_CDiEj2-9.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/admin-dashboard.astro.mjs');
const _page3 = () => import('./pages/admin-login.astro.mjs');
const _page4 = () => import('./pages/admin-promote.astro.mjs');
const _page5 = () => import('./pages/api/admin/grant-admin.astro.mjs');
const _page6 = () => import('./pages/api/auth/request-reset.astro.mjs');
const _page7 = () => import('./pages/api/auth/signin.astro.mjs');
const _page8 = () => import('./pages/api/auth/signout.astro.mjs');
const _page9 = () => import('./pages/api/auth/signup.astro.mjs');
const _page10 = () => import('./pages/api/content-stats.astro.mjs');
const _page11 = () => import('./pages/api/health.astro.mjs');
const _page12 = () => import('./pages/api/ping.astro.mjs');
const _page13 = () => import('./pages/api/promote-to-admin.astro.mjs');
const _page14 = () => import('./pages/api/promote-user.astro.mjs');
const _page15 = () => import('./pages/api/request-password-reset.astro.mjs');
const _page16 = () => import('./pages/api/test-supabase.astro.mjs');
const _page17 = () => import('./pages/api/verify-db.astro.mjs');
const _page18 = () => import('./pages/auth/reset.astro.mjs');
const _page19 = () => import('./pages/auth.astro.mjs');
const _page20 = () => import('./pages/bible.astro.mjs');
const _page21 = () => import('./pages/blog.astro.mjs');
const _page22 = () => import('./pages/blog/_---slug_.astro.mjs');
const _page23 = () => import('./pages/books.astro.mjs');
const _page24 = () => import('./pages/debug-auth-state.astro.mjs');
const _page25 = () => import('./pages/end-times.astro.mjs');
const _page26 = () => import('./pages/feasts.astro.mjs');
const _page27 = () => import('./pages/give.astro.mjs');
const _page28 = () => import('./pages/identity-and-messiah.astro.mjs');
const _page29 = () => import('./pages/music.astro.mjs');
const _page30 = () => import('./pages/prayer-and-fasting.astro.mjs');
const _page31 = () => import('./pages/privacy.astro.mjs');
const _page32 = () => import('./pages/profile.astro.mjs');
const _page33 = () => import('./pages/spiritual-warfare.astro.mjs');
const _page34 = () => import('./pages/start-here.astro.mjs');
const _page35 = () => import('./pages/test-minimal.astro.mjs');
const _page36 = () => import('./pages/videos.astro.mjs');
const _page37 = () => import('./pages/videos/_---slug_.astro.mjs');
const _page38 = () => import('./pages/walk-in-the-spirit.astro.mjs');
const _page39 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/admin-dashboard.astro", _page2],
    ["src/pages/admin-login.astro", _page3],
    ["src/pages/admin-promote.astro", _page4],
    ["src/pages/api/admin/grant-admin.ts", _page5],
    ["src/pages/api/auth/request-reset.ts", _page6],
    ["src/pages/api/auth/signin.ts", _page7],
    ["src/pages/api/auth/signout.ts", _page8],
    ["src/pages/api/auth/signup.ts", _page9],
    ["src/pages/api/content-stats.ts", _page10],
    ["src/pages/api/health.ts", _page11],
    ["src/pages/api/ping.ts", _page12],
    ["src/pages/api/promote-to-admin.ts", _page13],
    ["src/pages/api/promote-user.ts", _page14],
    ["src/pages/api/request-password-reset.ts", _page15],
    ["src/pages/api/test-supabase.ts", _page16],
    ["src/pages/api/verify-db.ts", _page17],
    ["src/pages/auth/reset.astro", _page18],
    ["src/pages/auth.astro", _page19],
    ["src/pages/bible.astro", _page20],
    ["src/pages/blog/index.astro", _page21],
    ["src/pages/blog/[...slug].astro", _page22],
    ["src/pages/books/index.astro", _page23],
    ["src/pages/debug-auth-state.astro", _page24],
    ["src/pages/end-times.astro", _page25],
    ["src/pages/feasts.astro", _page26],
    ["src/pages/give.astro", _page27],
    ["src/pages/identity-and-messiah.astro", _page28],
    ["src/pages/music/index.astro", _page29],
    ["src/pages/prayer-and-fasting.astro", _page30],
    ["src/pages/privacy.astro", _page31],
    ["src/pages/profile.astro", _page32],
    ["src/pages/spiritual-warfare.astro", _page33],
    ["src/pages/start-here.astro", _page34],
    ["src/pages/test-minimal.astro", _page35],
    ["src/pages/videos/index.astro", _page36],
    ["src/pages/videos/[...slug].astro", _page37],
    ["src/pages/walk-in-the-spirit.astro", _page38],
    ["src/pages/index.astro", _page39]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "8280446c-5306-4ad5-bf7b-cbb8c9002686",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
