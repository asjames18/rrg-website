import { c as createComponent, a as createAstro, d as renderComponent, e as renderTemplate, af as maybeRenderHead, r as renderScript, ag as addAttribute } from '../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_BI6EUuN9.mjs';
import { S as SupabaseCMSAPI } from '../chunks/supabase-cms-api_dv2hqhP9.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let videos = [];
  let error = null;
  try {
    const result = await SupabaseCMSAPI.getContent({
      type: "video",
      status: "published",
      limit: 200,
      // Fetch more for client-side filtering
      sortBy: "published_at",
      sortOrder: "desc"
    });
    videos = result.content || [];
  } catch (e) {
    error = e;
    videos = [];
  }
  const searchParams = Astro2.url.searchParams;
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialViewMode = searchParams.get("view") || "grid";
  const initialSearch = searchParams.get("q") || "";
  const initialSeries = searchParams.get("series")?.split(",").filter(Boolean) || [];
  const initialTopics = searchParams.get("topics")?.split(",").filter(Boolean) || [];
  const initialPlatforms = searchParams.get("platforms")?.split(",").filter(Boolean) || [];
  const initialSort = searchParams.get("sort") || "newest";
  const groupBySeries = searchParams.get("groupBy") === "series";
  Array.from(new Set(
    videos.flatMap((v) => v.metadata?.series || [])
  )).sort();
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Videos" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <div class="mb-12"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Videos</h1> <p class="text-lg md:text-xl text-neutral-300 mb-6 max-w-3xl">
Watch powerful teachings, testimonies, and training from the remnant. No fluff—just raw truth.
</p> </div> ${error ? renderTemplate`<div class="bg-red-900/20 border border-red-800/50 rounded-lg p-8 text-center"> <p class="text-red-400 mb-4">Error loading videos. Please try again later.</p> <button onclick="window.location.reload()" class="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors">
Retry
</button> </div>` : renderTemplate`<div id="videos-app"${addAttribute(JSON.stringify(videos), "data-videos")}${addAttribute(initialPage, "data-initial-page")}${addAttribute(initialViewMode, "data-initial-view-mode")}${addAttribute(initialSearch, "data-initial-search")}${addAttribute(JSON.stringify(initialSeries), "data-initial-series")}${addAttribute(JSON.stringify(initialTopics), "data-initial-topics")}${addAttribute(JSON.stringify(initialPlatforms), "data-initial-platforms")}${addAttribute(initialSort, "data-initial-sort")}${addAttribute(groupBySeries, "data-group-by-series")}> <div class="space-y-8">  <div id="filters-container"></div>  <div class="flex items-center justify-between"> <div class="flex items-center gap-3"> <label class="flex items-center gap-2 text-neutral-300 cursor-pointer"> <input type="checkbox" id="group-by-series" class="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-amber-700 focus:ring-amber-500 focus:ring-offset-neutral-950"> <span>Group by Series</span> </label> </div> <div id="results-count" class="text-sm text-neutral-500"></div> </div>  <div id="videos-container">  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> ${renderComponent($$result2, "VideoSkeleton", null, { "count": 6, "viewMode": "grid", "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/VideoSkeleton", "client:component-export": "default" })} </div> </div>  <div id="pagination-container"></div> </div> </div>`}  <div class="mt-16 bg-neutral-950 border border-neutral-800 rounded-lg p-8"> <h3 class="text-2xl font-bold text-amber-100 mb-6 text-center">Continue Your Training</h3> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> <a href="/start-here" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Start Here</h4> <p class="text-neutral-400 text-sm">Begin your journey with the 7-Day Reset</p> </a> <a href="/spiritual-warfare" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Spiritual Warfare</h4> <p class="text-neutral-400 text-sm">Put on the armor and close spiritual doorways</p> </a> <a href="/feasts" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Feasts of YAH</h4> <p class="text-neutral-400 text-sm">Honor the appointed times and understand prophecy</p> </a> </div> </div> </div> ${renderScript($$result2, "/Users/asjames18/Development/RRG Website/src/pages/videos/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/videos/index.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/videos/index.astro";
const $$url = "/videos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
