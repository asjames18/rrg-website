import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DBYb7_Us.mjs';
import { manifest } from './manifest_Bxk3XCdc.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/admin-dashboard.astro.mjs');
const _page3 = () => import('./pages/admin-promote.astro.mjs');
const _page4 = () => import('./pages/api/admin/analytics/content/_id_.astro.mjs');
const _page5 = () => import('./pages/api/admin/analytics/overview.astro.mjs');
const _page6 = () => import('./pages/api/admin/analytics/trending.astro.mjs');
const _page7 = () => import('./pages/api/admin/content/bulk-action.astro.mjs');
const _page8 = () => import('./pages/api/admin/dashboard/stats.astro.mjs');
const _page9 = () => import('./pages/api/admin/grant-admin.astro.mjs');
const _page10 = () => import('./pages/api/admin/settings.astro.mjs');
const _page11 = () => import('./pages/api/admin/users/bulk-action.astro.mjs');
const _page12 = () => import('./pages/api/admin/users/export.astro.mjs');
const _page13 = () => import('./pages/api/admin/users/_id_.astro.mjs');
const _page14 = () => import('./pages/api/admin/users.astro.mjs');
const _page15 = () => import('./pages/api/admin/workflow/change-state.astro.mjs');
const _page16 = () => import('./pages/api/admin/workflow/history/_id_.astro.mjs');
const _page17 = () => import('./pages/api/auth/request-reset.astro.mjs');
const _page18 = () => import('./pages/api/auth/signin.astro.mjs');
const _page19 = () => import('./pages/api/auth/signout.astro.mjs');
const _page20 = () => import('./pages/api/auth/signup.astro.mjs');
const _page21 = () => import('./pages/api/cms/activity.astro.mjs');
const _page22 = () => import('./pages/api/cms/blog.astro.mjs');
const _page23 = () => import('./pages/api/cms/books.astro.mjs');
const _page24 = () => import('./pages/api/cms/bulk.astro.mjs');
const _page25 = () => import('./pages/api/cms/content/_id_.astro.mjs');
const _page26 = () => import('./pages/api/cms/content.astro.mjs');
const _page27 = () => import('./pages/api/cms/media.astro.mjs');
const _page28 = () => import('./pages/api/cms/music.astro.mjs');
const _page29 = () => import('./pages/api/cms/relationships.astro.mjs');
const _page30 = () => import('./pages/api/cms/schedule.astro.mjs');
const _page31 = () => import('./pages/api/cms/stats.astro.mjs');
const _page32 = () => import('./pages/api/cms/tags.astro.mjs');
const _page33 = () => import('./pages/api/cms/upload.astro.mjs');
const _page34 = () => import('./pages/api/cms/users.astro.mjs');
const _page35 = () => import('./pages/api/cms/videos.astro.mjs');
const _page36 = () => import('./pages/api/content-stats.astro.mjs');
const _page37 = () => import('./pages/api/health.astro.mjs');
const _page38 = () => import('./pages/api/ping.astro.mjs');
const _page39 = () => import('./pages/api/promote-to-admin.astro.mjs');
const _page40 = () => import('./pages/api/promote-user.astro.mjs');
const _page41 = () => import('./pages/api/request-password-reset.astro.mjs');
const _page42 = () => import('./pages/api/test-supabase.astro.mjs');
const _page43 = () => import('./pages/api/user/activity.astro.mjs');
const _page44 = () => import('./pages/api/user/change-password.astro.mjs');
const _page45 = () => import('./pages/api/user/preferences.astro.mjs');
const _page46 = () => import('./pages/api/verify-db.astro.mjs');
const _page47 = () => import('./pages/auth/reset.astro.mjs');
const _page48 = () => import('./pages/auth.astro.mjs');
const _page49 = () => import('./pages/blog.astro.mjs');
const _page50 = () => import('./pages/blog/_---slug_.astro.mjs');
const _page51 = () => import('./pages/books.astro.mjs');
const _page52 = () => import('./pages/books/_---slug_.astro.mjs');
const _page53 = () => import('./pages/cms/blog/new.astro.mjs');
const _page54 = () => import('./pages/cms/books/new.astro.mjs');
const _page55 = () => import('./pages/cms/edit/_id_.astro.mjs');
const _page56 = () => import('./pages/cms/media.astro.mjs');
const _page57 = () => import('./pages/cms/music/new.astro.mjs');
const _page58 = () => import('./pages/cms/videos/new.astro.mjs');
const _page59 = () => import('./pages/cms.astro.mjs');
const _page60 = () => import('./pages/end-times.astro.mjs');
const _page61 = () => import('./pages/feasts.astro.mjs');
const _page62 = () => import('./pages/give.astro.mjs');
const _page63 = () => import('./pages/identity-and-messiah.astro.mjs');
const _page64 = () => import('./pages/music.astro.mjs');
const _page65 = () => import('./pages/prayer-and-fasting.astro.mjs');
const _page66 = () => import('./pages/privacy.astro.mjs');
const _page67 = () => import('./pages/profile.astro.mjs');
const _page68 = () => import('./pages/rss.xml.astro.mjs');
const _page69 = () => import('./pages/spiritual-warfare.astro.mjs');
const _page70 = () => import('./pages/start-here.astro.mjs');
const _page71 = () => import('./pages/videos.astro.mjs');
const _page72 = () => import('./pages/videos/_---slug_.astro.mjs');
const _page73 = () => import('./pages/walk-in-the-spirit.astro.mjs');
const _page74 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/admin-dashboard.astro", _page2],
    ["src/pages/admin-promote.astro", _page3],
    ["src/pages/api/admin/analytics/content/[id].ts", _page4],
    ["src/pages/api/admin/analytics/overview.ts", _page5],
    ["src/pages/api/admin/analytics/trending.ts", _page6],
    ["src/pages/api/admin/content/bulk-action.ts", _page7],
    ["src/pages/api/admin/dashboard/stats.ts", _page8],
    ["src/pages/api/admin/grant-admin.ts", _page9],
    ["src/pages/api/admin/settings/index.ts", _page10],
    ["src/pages/api/admin/users/bulk-action.ts", _page11],
    ["src/pages/api/admin/users/export.ts", _page12],
    ["src/pages/api/admin/users/[id].ts", _page13],
    ["src/pages/api/admin/users/index.ts", _page14],
    ["src/pages/api/admin/workflow/change-state.ts", _page15],
    ["src/pages/api/admin/workflow/history/[id].ts", _page16],
    ["src/pages/api/auth/request-reset.ts", _page17],
    ["src/pages/api/auth/signin.ts", _page18],
    ["src/pages/api/auth/signout.ts", _page19],
    ["src/pages/api/auth/signup.ts", _page20],
    ["src/pages/api/cms/activity.ts", _page21],
    ["src/pages/api/cms/blog.ts", _page22],
    ["src/pages/api/cms/books.ts", _page23],
    ["src/pages/api/cms/bulk.ts", _page24],
    ["src/pages/api/cms/content/[id].ts", _page25],
    ["src/pages/api/cms/content.ts", _page26],
    ["src/pages/api/cms/media.ts", _page27],
    ["src/pages/api/cms/music.ts", _page28],
    ["src/pages/api/cms/relationships.ts", _page29],
    ["src/pages/api/cms/schedule.ts", _page30],
    ["src/pages/api/cms/stats.ts", _page31],
    ["src/pages/api/cms/tags.ts", _page32],
    ["src/pages/api/cms/upload.ts", _page33],
    ["src/pages/api/cms/users.ts", _page34],
    ["src/pages/api/cms/videos.ts", _page35],
    ["src/pages/api/content-stats.ts", _page36],
    ["src/pages/api/health.ts", _page37],
    ["src/pages/api/ping.ts", _page38],
    ["src/pages/api/promote-to-admin.ts", _page39],
    ["src/pages/api/promote-user.ts", _page40],
    ["src/pages/api/request-password-reset.ts", _page41],
    ["src/pages/api/test-supabase.ts", _page42],
    ["src/pages/api/user/activity.ts", _page43],
    ["src/pages/api/user/change-password.ts", _page44],
    ["src/pages/api/user/preferences.ts", _page45],
    ["src/pages/api/verify-db.ts", _page46],
    ["src/pages/auth/reset.astro", _page47],
    ["src/pages/auth.astro", _page48],
    ["src/pages/blog/index.astro", _page49],
    ["src/pages/blog/[...slug].astro", _page50],
    ["src/pages/books/index.astro", _page51],
    ["src/pages/books/[...slug].astro", _page52],
    ["src/pages/cms/blog/new.astro", _page53],
    ["src/pages/cms/books/new.astro", _page54],
    ["src/pages/cms/edit/[id].astro", _page55],
    ["src/pages/cms/media/index.astro", _page56],
    ["src/pages/cms/music/new.astro", _page57],
    ["src/pages/cms/videos/new.astro", _page58],
    ["src/pages/cms/index.astro", _page59],
    ["src/pages/end-times.astro", _page60],
    ["src/pages/feasts.astro", _page61],
    ["src/pages/give.astro", _page62],
    ["src/pages/identity-and-messiah.astro", _page63],
    ["src/pages/music/index.astro", _page64],
    ["src/pages/prayer-and-fasting.astro", _page65],
    ["src/pages/privacy.astro", _page66],
    ["src/pages/profile.astro", _page67],
    ["src/pages/rss.xml.ts", _page68],
    ["src/pages/spiritual-warfare.astro", _page69],
    ["src/pages/start-here.astro", _page70],
    ["src/pages/videos/index.astro", _page71],
    ["src/pages/videos/[...slug].astro", _page72],
    ["src/pages/walk-in-the-spirit.astro", _page73],
    ["src/pages/index.astro", _page74]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "16f12e82-75c0-4fcf-9752-8460743b73bb",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
