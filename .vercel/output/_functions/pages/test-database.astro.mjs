import { c as createComponent, b as renderComponent, a as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../chunks/astro/server_Dkd2Gmz6.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CnD7KCS-.mjs';
import { s as supabase } from '../chunks/supabase_rylPBTzj.mjs';
export { renderers } from '../renderers.mjs';

const $$TestDatabase = createComponent(async ($$result, $$props, $$slots) => {
  const { data: posts, error: postsError } = await supabase.from("posts").select("*").eq("published", true).order("published_at", { ascending: false });
  const { data: videos, error: videosError } = await supabase.from("videos").select("*").eq("published", true).order("published_at", { ascending: false });
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Database Test" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 max-w-4xl"> <h1 class="text-4xl font-bold mb-8 text-amber-100">📊 Database Content Test</h1> <!-- Posts from Database --> <section class="mb-12"> <h2 class="text-2xl font-bold mb-4 text-amber-100">Blog Posts from Supabase</h2> ${postsError ? renderTemplate`<div class="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
Error: ${postsError.message} </div>` : posts && posts.length > 0 ? renderTemplate`<div class="space-y-4"> ${posts.map((post) => renderTemplate`<article class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h3 class="text-xl font-bold mb-2 text-amber-100">${post.title}</h3> <p class="text-neutral-300 mb-3">${post.summary}</p> <div class="flex gap-2 mb-3"> ${post.tags.map((tag) => renderTemplate`<span class="bg-amber-900/30 border border-amber-800 text-amber-200 text-xs px-2 py-1 rounded"> ${tag} </span>`)} </div> <a${addAttribute(`/blog/${post.slug}`, "href")} class="text-amber-400 hover:text-amber-300 underline">
Read more →
</a> </article>`)} </div>` : renderTemplate`<div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center"> <p class="text-neutral-400">No posts in database yet.</p> <p class="text-sm text-neutral-500 mt-2">
Add test data in Supabase SQL Editor to see it here!
</p> </div>`} </section> <!-- Videos from Database --> <section class="mb-12"> <h2 class="text-2xl font-bold mb-4 text-amber-100">Videos from Supabase</h2> ${videosError ? renderTemplate`<div class="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
Error: ${videosError.message} </div>` : videos && videos.length > 0 ? renderTemplate`<div class="space-y-4"> ${videos.map((video) => renderTemplate`<article class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h3 class="text-xl font-bold mb-2 text-amber-100">${video.title}</h3> <div class="flex flex-wrap gap-2 mb-3"> <span class="text-sm text-neutral-400">Platform: <strong>${video.platform}</strong></span> ${video.series.length > 0 && renderTemplate`<span class="text-sm text-amber-400">Series: ${video.series.join(", ")}</span>`} </div> <div class="flex gap-2"> ${video.topics.map((topic) => renderTemplate`<span class="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded"> ${topic} </span>`)} </div> </article>`)} </div>` : renderTemplate`<div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center"> <p class="text-neutral-400">No videos in database yet.</p> <p class="text-sm text-neutral-500 mt-2">
Add test data in Supabase SQL Editor to see it here!
</p> </div>`} </section> <!-- Info --> <div class="bg-amber-900/20 border border-amber-800/50 rounded-lg p-6"> <h3 class="text-lg font-bold text-amber-100 mb-2">✅ Database Connected!</h3> <p class="text-neutral-300 mb-4">
Your site is now reading from Supabase PostgreSQL database. You have two options:
</p> <ul class="list-disc list-inside text-neutral-300 space-y-2"> <li><strong>Hybrid:</strong> Keep MDX files for content + Supabase for user features</li> <li><strong>Full Database:</strong> Migrate all content to Supabase tables</li> </ul> <p class="text-sm text-neutral-400 mt-4">
Currently showing: ${posts?.length || 0} posts, ${videos?.length || 0} videos
</p> </div> </div> ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/test-database.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/test-database.astro";
const $$url = "/test-database";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestDatabase,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
