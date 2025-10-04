import { c as createComponent, b as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DCtlZR10.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CLTBcQpW.mjs';
import { s as supabaseServer } from '../chunks/supabase-server_DNXtBe2A.mjs';
import { U as UserProfile } from '../chunks/UserProfile_Ber5OXdn.mjs';
import { U as UserManagement } from '../chunks/UserManagement_Bftlx0ze.mjs';
export { renderers } from '../renderers.mjs';

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
</p> </div> <!-- Stats Grid --> <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${postsCount || 0}</div> <div class="text-sm text-neutral-400">Blog Posts</div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${videosCount || 0}</div> <div class="text-sm text-neutral-400">Videos</div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${booksCount || 0}</div> <div class="text-sm text-neutral-400">Books</div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${musicCount || 0}</div> <div class="text-sm text-neutral-400">Music</div> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <div class="text-2xl font-bold text-amber-100">${usersCount || 0}</div> <div class="text-sm text-neutral-400">Users</div> </div> </div> <!-- Quick Actions --> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"> <a href="/admin" class="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-6 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">📝</div> <div class="font-bold">Content Management</div> <div class="text-sm opacity-90">Edit posts, videos, books</div> </a> <a href="/api/test-supabase" class="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold py-6 px-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black"> <div class="text-xl mb-2">🔗</div> <div class="font-bold">API Test</div> <div class="text-sm opacity-90">Check Supabase connection</div> </a> </div> <!-- Recent Activity --> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h2 class="text-xl font-bold text-amber-100 mb-4">Recent Activity</h2> <div class="space-y-3"> <div class="flex items-center gap-3 text-sm text-neutral-300"> <span class="w-2 h-2 bg-green-500 rounded-full"></span> <span>Supabase connection established</span> <span class="text-neutral-500 ml-auto">Just now</span> </div> <div class="flex items-center gap-3 text-sm text-neutral-300"> <span class="w-2 h-2 bg-blue-500 rounded-full"></span> <span>Admin dashboard loaded</span> <span class="text-neutral-500 ml-auto">Just now</span> </div> <div class="flex items-center gap-3 text-sm text-neutral-300"> <span class="w-2 h-2 bg-amber-500 rounded-full"></span> <span>Content collections configured</span> <span class="text-neutral-500 ml-auto">Recently</span> </div> </div> </div> <!-- User Management --> <div class="mt-8"> ${renderComponent($$result2, "UserManagement", UserManagement, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserManagement", "client:component-export": "default" })} </div> <!-- User Profile Component --> <div class="mt-8"> ${renderComponent($$result2, "UserProfile", UserProfile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UserProfile", "client:component-export": "default" })} </div> </div> </div> ` })}`;
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
