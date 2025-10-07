import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BKIoqdNA.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_Bd7Ja63m.mjs';
import { s as supabaseServer } from '../chunks/supabase-server_ssb-PSP4.mjs';
import { U as UserProfile } from '../chunks/UserProfile_xFc-1SSw.mjs';
import { U as UserManagement } from '../chunks/UserManagement_BV7S7wYZ.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from '../chunks/supabase_B6EMrqat.mjs';
export { renderers } from '../renderers.mjs';

function ContentStats() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    videos: 0,
    books: 0,
    music: 0,
    totalUsers: 0,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [blogResult, videoResult, bookResult, musicResult, userResult] = await Promise.all([
        fetch("/api/content-stats?type=blog"),
        fetch("/api/content-stats?type=videos"),
        fetch("/api/content-stats?type=books"),
        fetch("/api/content-stats?type=music"),
        supabase.from("profiles").select("*", { count: "exact", head: true })
      ]);
      const blogData = await blogResult.json();
      const videoData = await videoResult.json();
      const bookData = await bookResult.json();
      const musicData = await musicResult.json();
      setStats({
        blogPosts: blogData.count || 0,
        videos: videoData.count || 0,
        books: bookData.count || 0,
        music: musicData.count || 0,
        totalUsers: userResult.count || 0,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3e4);
    return () => clearInterval(interval);
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-neutral-700 rounded w-1/3 mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx("div", { className: "h-20 bg-neutral-800 rounded" }, i)) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100", children: "Content Statistics" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: fetchStats,
            className: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded text-sm transition-colors",
            children: "Refresh"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-neutral-400", children: [
          "Updated: ",
          new Date(stats.lastUpdated).toLocaleTimeString()
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-900/30 border border-red-700 text-red-200 p-3 rounded mb-4", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-400 mb-1", children: stats.blogPosts }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Blog Posts" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-400 mb-1", children: stats.videos }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Videos" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-400 mb-1", children: stats.books }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Books" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-400 mb-1", children: stats.music }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Music" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-cyan-400 mb-1", children: stats.totalUsers }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Users" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-neutral-700", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm text-neutral-400", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Total Content: ",
        stats.blogPosts + stats.videos + stats.books + stats.music
      ] }),
      /* @__PURE__ */ jsx("span", { children: "Auto-refresh: 30s" })
    ] }) })
  ] });
}

const prerender = false;
const $$AdminDashboard = createComponent(async ($$result, $$props, $$slots) => {
  let postsCount = 0;
  let videosCount = 0;
  let booksCount = 0;
  let musicCount = 0;
  let usersCount = 0;
  try {
    const { count: posts } = await supabaseServer.from("posts").select("*", { count: "exact", head: true });
    postsCount = posts || 0;
  } catch (error) {
    console.log("Posts table not found, using default count");
  }
  try {
    const { count: videos } = await supabaseServer.from("videos").select("*", { count: "exact", head: true });
    videosCount = videos || 0;
  } catch (error) {
    console.log("Videos table not found, using default count");
  }
  try {
    const { count: books } = await supabaseServer.from("books").select("*", { count: "exact", head: true });
    booksCount = books || 0;
  } catch (error) {
    console.log("Books table not found, using default count");
  }
  try {
    const { count: music } = await supabaseServer.from("music").select("*", { count: "exact", head: true });
    musicCount = music || 0;
  } catch (error) {
    console.log("Music table not found, using default count");
  }
  try {
    const { count: users } = await supabaseServer.from("profiles").select("*", { count: "exact", head: true });
    usersCount = users || 0;
  } catch (error) {
    console.log("Profiles table not found, using default count");
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Admin Dashboard | Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <div class="max-w-6xl mx-auto"> <div class="mb-8"> <h1 class="text-3xl md:text-4xl font-bold text-amber-100 mb-4">
Admin Dashboard
</h1> <p class="text-lg text-neutral-300">
Manage content, users, and site settings
</p> </div> <!-- Stats Grid --> <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${postsCount || 0}</div> <div class="text-sm text-neutral-400">Blog Posts</div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${videosCount || 0}</div> <div class="text-sm text-neutral-400">Videos</div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${booksCount || 0}</div> <div class="text-sm text-neutral-400">Books</div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${musicCount || 0}</div> <div class="text-sm text-neutral-400">Music</div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${usersCount || 0}</div> <div class="text-sm text-neutral-400">Users</div> </div> </div> <!-- Quick Actions --> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"> <a href="/admin" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-6 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">📝</div> <div class="font-bold">Content Management</div> <div class="text-sm opacity-90">Edit posts, videos, books</div> </a> <a href="/admin-promote" class="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-6 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">👥</div> <div class="font-bold">User Management</div> <div class="text-sm opacity-90">Promote users to admin</div> </a> <a href="/api/test-supabase" class="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold py-6 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">🔗</div> <div class="font-bold">API Test</div> <div class="text-sm opacity-90">Check Supabase connection</div> </a> <a href="/api/health" class="bg-green-700 hover:bg-green-600 text-white font-semibold py-6 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">💚</div> <div class="font-bold">Health Check</div> <div class="text-sm opacity-90">System status</div> </a> </div> <!-- System Status --> <div class="grid md:grid-cols-2 gap-6 mb-12"> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h2 class="text-xl font-bold text-amber-100 mb-4">System Status</h2> <div class="space-y-3"> <div class="flex items-center justify-between text-sm"> <span class="text-neutral-300">Database Connection</span> <span class="text-green-400 font-semibold">✓ Connected</span> </div> <div class="flex items-center justify-between text-sm"> <span class="text-neutral-300">Authentication</span> <span class="text-green-400 font-semibold">✓ Active</span> </div> <div class="flex items-center justify-between text-sm"> <span class="text-neutral-300">Content Collections</span> <span class="text-green-400 font-semibold">✓ Ready</span> </div> <div class="flex items-center justify-between text-sm"> <span class="text-neutral-300">Admin Middleware</span> <span class="text-green-400 font-semibold">✓ Protected</span> </div> </div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h2 class="text-xl font-bold text-amber-100 mb-4">Quick Stats</h2> <div class="space-y-3"> <div class="flex items-center justify-between text-sm"> <span class="text-neutral-300">Total Content</span> <span class="text-amber-400 font-semibold">${postsCount + videosCount + booksCount + musicCount}</span> </div> <div class="flex items-center justify-between text-sm"> <span class="text-neutral-300">Active Users</span> <span class="text-blue-400 font-semibold">${usersCount}</span> </div> <div class="flex items-center justify-between text-sm"> <span class="text-neutral-300">Blog Posts</span> <span class="text-green-400 font-semibold">${postsCount}</span> </div> <div class="flex items-center justify-between text-sm"> <span class="text-neutral-300">Videos</span> <span class="text-purple-400 font-semibold">${videosCount}</span> </div> </div> </div> </div> <!-- Recent Activity --> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h2 class="text-xl font-bold text-amber-100 mb-4">Recent Activity</h2> <div class="space-y-3"> <div class="flex items-center gap-3 text-sm text-neutral-300"> <span class="w-2 h-2 bg-green-500 rounded-full"></span> <span>Admin dashboard loaded successfully</span> <span class="text-neutral-500 ml-auto">Just now</span> </div> <div class="flex items-center gap-3 text-sm text-neutral-300"> <span class="w-2 h-2 bg-blue-500 rounded-full"></span> <span>Content statistics updated</span> <span class="text-neutral-500 ml-auto">Just now</span> </div> <div class="flex items-center gap-3 text-sm text-neutral-300"> <span class="w-2 h-2 bg-amber-500 rounded-full"></span> <span>Admin middleware protection active</span> <span class="text-neutral-500 ml-auto">Just now</span> </div> </div> </div> <!-- Real-time Content Statistics --> <div class="mt-8"> ${renderComponent($$result2, "ContentStats", ContentStats, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/ContentStats", "client:component-export": "default" })} </div> <!-- User Management --> <div class="mt-8"> ${renderComponent($$result2, "UserManagement", UserManagement, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserManagement", "client:component-export": "default" })} </div> <!-- User Profile Component --> <div class="mt-8"> ${renderComponent($$result2, "UserProfile", UserProfile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserProfile", "client:component-export": "default" })} </div> </div> </div> ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/admin-dashboard.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/admin-dashboard.astro";
const $$url = "/admin-dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminDashboard,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
