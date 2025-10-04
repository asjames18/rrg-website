import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DrbDqbTm.mjs';
import { manifest } from './manifest_CeWkX1gW.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/admin-dashboard.astro.mjs');
const _page3 = () => import('./pages/admin-login.astro.mjs');
const _page4 = () => import('./pages/admin-promote.astro.mjs');
const _page5 = () => import('./pages/api/health.astro.mjs');
const _page6 = () => import('./pages/api/ping.astro.mjs');
const _page7 = () => import('./pages/api/promote-to-admin.astro.mjs');
const _page8 = () => import('./pages/api/promote-user.astro.mjs');
const _page9 = () => import('./pages/api/test-supabase.astro.mjs');
const _page10 = () => import('./pages/auth.astro.mjs');
const _page11 = () => import('./pages/bible.astro.mjs');
const _page12 = () => import('./pages/blog.astro.mjs');
const _page13 = () => import('./pages/blog/_---slug_.astro.mjs');
const _page14 = () => import('./pages/books.astro.mjs');
const _page15 = () => import('./pages/end-times.astro.mjs');
const _page16 = () => import('./pages/feasts.astro.mjs');
const _page17 = () => import('./pages/give.astro.mjs');
const _page18 = () => import('./pages/identity-and-messiah.astro.mjs');
const _page19 = () => import('./pages/music.astro.mjs');
const _page20 = () => import('./pages/prayer-and-fasting.astro.mjs');
const _page21 = () => import('./pages/privacy.astro.mjs');
const _page22 = () => import('./pages/profile.astro.mjs');
const _page23 = () => import('./pages/spiritual-warfare.astro.mjs');
const _page24 = () => import('./pages/start-here.astro.mjs');
const _page25 = () => import('./pages/test-minimal.astro.mjs');
const _page26 = () => import('./pages/videos.astro.mjs');
const _page27 = () => import('./pages/videos/_---slug_.astro.mjs');
const _page28 = () => import('./pages/walk-in-the-spirit.astro.mjs');
const _page29 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/admin-dashboard.astro", _page2],
    ["src/pages/admin-login.astro", _page3],
    ["src/pages/admin-promote.astro", _page4],
    ["src/pages/api/health.ts", _page5],
    ["src/pages/api/ping.ts", _page6],
    ["src/pages/api/promote-to-admin.ts", _page7],
    ["src/pages/api/promote-user.ts", _page8],
    ["src/pages/api/test-supabase.ts", _page9],
    ["src/pages/auth.astro", _page10],
    ["src/pages/bible.astro", _page11],
    ["src/pages/blog/index.astro", _page12],
    ["src/pages/blog/[...slug].astro", _page13],
    ["src/pages/books/index.astro", _page14],
    ["src/pages/end-times.astro", _page15],
    ["src/pages/feasts.astro", _page16],
    ["src/pages/give.astro", _page17],
    ["src/pages/identity-and-messiah.astro", _page18],
    ["src/pages/music/index.astro", _page19],
    ["src/pages/prayer-and-fasting.astro", _page20],
    ["src/pages/privacy.astro", _page21],
    ["src/pages/profile.astro", _page22],
    ["src/pages/spiritual-warfare.astro", _page23],
    ["src/pages/start-here.astro", _page24],
    ["src/pages/test-minimal.astro", _page25],
    ["src/pages/videos/index.astro", _page26],
    ["src/pages/videos/[...slug].astro", _page27],
    ["src/pages/walk-in-the-spirit.astro", _page28],
    ["src/pages/index.astro", _page29]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "77f8cb94-da95-4c61-af80-12a8bf7d51e3",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
