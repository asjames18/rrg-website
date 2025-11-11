import { c as createComponent, a as createAstro, d as renderComponent, e as renderTemplate, af as maybeRenderHead, ag as addAttribute, r as renderScript } from '../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_pSiMxjTU.mjs';
import { g as getCollection } from '../chunks/_astro_content_hPKHaW2I.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
export { renderers } from '../renderers.mjs';

function BlogCard({ post, viewMode = "list", featured = false }) {
  const formattedDate = post.data.publishedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  if (viewMode === "grid") {
    return /* @__PURE__ */ jsxs("article", { className: "group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors flex flex-col h-full", children: [
      post.data.coverImage && /* @__PURE__ */ jsx("a", { href: `/blog/${post.slug}`, className: "block aspect-video bg-neutral-800 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 text-amber-700/30", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z", clipRule: "evenodd" }) }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-neutral-500 mb-3", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-amber-900/30 border border-amber-800 text-amber-200 px-2 py-1 rounded", children: post.data.category }),
          /* @__PURE__ */ jsx("span", { children: "•" }),
          /* @__PURE__ */ jsx("time", { dateTime: post.data.publishedAt.toISOString(), children: formattedDate }),
          /* @__PURE__ */ jsx("span", { children: "•" }),
          /* @__PURE__ */ jsxs("span", { children: [
            post.data.readingTime,
            " min"
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-3 group-hover:text-amber-200 transition-colors line-clamp-2", children: /* @__PURE__ */ jsx("a", { href: `/blog/${post.slug}`, className: "focus:outline-none focus:ring-2 focus:ring-amber-500 rounded", children: post.data.title }) }),
        /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1", children: post.data.excerpt || post.data.summary }),
        post.data.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-auto", children: post.data.tags.slice(0, 3).map((tag, i) => /* @__PURE__ */ jsx("span", { className: "text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded", children: tag }, i)) })
      ] })
    ] });
  }
  if (viewMode === "compact") {
    return /* @__PURE__ */ jsx("article", { className: "group border-b border-neutral-800 pb-4 last:border-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-amber-100 group-hover:text-amber-200 transition-colors line-clamp-1 mb-2", children: /* @__PURE__ */ jsx("a", { href: `/blog/${post.slug}`, className: "focus:outline-none focus:ring-2 focus:ring-amber-500 rounded", children: post.data.title }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-neutral-500", children: [
          /* @__PURE__ */ jsx("span", { className: "text-amber-400", children: post.data.category }),
          /* @__PURE__ */ jsx("span", { children: "•" }),
          /* @__PURE__ */ jsx("time", { dateTime: post.data.publishedAt.toISOString(), children: formattedDate }),
          /* @__PURE__ */ jsx("span", { children: "•" }),
          /* @__PURE__ */ jsxs("span", { children: [
            post.data.readingTime,
            " min"
          ] })
        ] })
      ] }),
      post.data.featured && /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 text-xs bg-amber-900/30 border border-amber-800 text-amber-200 px-2 py-1 rounded", children: "Featured" })
    ] }) });
  }
  return /* @__PURE__ */ jsx("article", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-bold", children: "RRG" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-neutral-500 mb-2", children: [
        /* @__PURE__ */ jsx("span", { children: post.data.author }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsx("time", { dateTime: post.data.publishedAt.toISOString(), children: formattedDate }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxs("span", { children: [
          post.data.readingTime,
          " min read"
        ] }),
        post.data.featured && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { children: "•" }),
          /* @__PURE__ */ jsx("span", { className: "text-amber-400", children: "★ Featured" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-neutral-100 mb-3 group-hover:text-amber-200 transition-colors leading-tight", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: `/blog/${post.slug}`,
          className: "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black rounded",
          children: post.data.title
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-400 leading-relaxed mb-4 line-clamp-2", children: post.data.summary }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: post.data.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        post.data.tags.slice(0, 2).map((tag, i) => /* @__PURE__ */ jsx("span", { className: "text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded", children: tag }, i)),
        post.data.tags.length > 2 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-neutral-500", children: [
          "+",
          post.data.tags.length - 2
        ] })
      ] }) }) })
    ] })
  ] }) });
}

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const blogPosts = await getCollection("blog");
  const sortedPosts = blogPosts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
  const featuredPosts = sortedPosts.filter((p) => p.data.featured);
  const regularPosts = sortedPosts.filter((p) => !p.data.featured);
  const searchParams = Astro2.url.searchParams;
  const initialViewMode = searchParams.get("view") || "list";
  const initialSearch = searchParams.get("q") || "";
  const initialTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const initialCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const postsPerPage = 15;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Blog - Real & Raw Gospel" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-6xl mx-auto px-4 py-8"> <!-- Header --> <div class="mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-neutral-100 mb-4">Real & Raw Gospel</h1> <p class="text-lg md:text-xl text-neutral-400 mb-6">Training the remnant in the ways of YAHUAH</p> </div> <div id="blog-app"${addAttribute(JSON.stringify(sortedPosts), "data-posts")}${addAttribute(JSON.stringify(featuredPosts), "data-featured-posts")}${addAttribute(initialViewMode, "data-initial-view-mode")}${addAttribute(initialSearch, "data-initial-search")}${addAttribute(JSON.stringify(initialTags), "data-initial-tags")}${addAttribute(JSON.stringify(initialCategories), "data-initial-categories")}${addAttribute(initialSort, "data-initial-sort")}${addAttribute(initialPage, "data-initial-page")}${addAttribute(postsPerPage, "data-posts-per-page")}> ${sortedPosts.length > 0 ? renderTemplate`<div class="space-y-12">  <div id="filters-container"></div>  ${featuredPosts.length > 0 && renderTemplate`<div id="featured-section"> <h2 class="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-2"> <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>
Featured Posts
</h2> <div class="grid md:grid-cols-2 gap-6 mb-12"> ${featuredPosts.slice(0, 2).map((post) => renderTemplate`${renderComponent($$result2, "BlogCard", BlogCard, { "post": post, "viewMode": "grid", "featured": true, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/BlogCard", "client:component-export": "default" })}`)} </div> </div>`}  <div class="flex items-center justify-between"> <div id="results-count" class="text-sm text-neutral-500"></div> </div>  <div id="posts-container">  <div class="space-y-8"> ${regularPosts.slice(0, postsPerPage).map((post) => renderTemplate`${renderComponent($$result2, "BlogCard", BlogCard, { "post": post, "viewMode": "list", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/BlogCard", "client:component-export": "default" })}`)} </div> </div>  <div id="pagination-container"></div> </div>` : renderTemplate`<div class="text-center py-16"> <div class="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6"> <svg class="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> <h3 class="text-xl font-bold text-neutral-100 mb-3">Coming Soon</h3> <p class="text-neutral-400 mb-6 max-w-md mx-auto">Raw truth and real teaching are on the way. Check back soon for articles that will challenge, equip, and prepare the remnant.</p> <a href="/start-here" class="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
Start Your Training
</a> </div>`} </div>  <div class="mt-16 bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-700/50 rounded-xl p-8 max-w-4xl mx-auto"> <div class="text-center"> <h3 class="text-2xl font-bold text-amber-100 mb-4">Stay Connected</h3> <p class="text-neutral-300 mb-6">
Get the latest teachings, testimonies, and training directly in your inbox. No spam—just raw truth for the remnant.
</p> <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"> <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"> <button class="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
Subscribe
</button> </div> <p class="text-xs text-neutral-500 mt-3">
We respect your privacy. Unsubscribe at any time.
</p> </div> </div>  <div class="mt-12 bg-neutral-950 border border-neutral-800 rounded-lg p-8"> <h3 class="text-2xl font-bold text-amber-100 mb-6 text-center">Continue Your Training</h3> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> <a href="/start-here" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Start Here</h4> <p class="text-neutral-400 text-sm">Begin your journey with the 7-Day Reset</p> </a> <a href="/videos" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Videos</h4> <p class="text-neutral-400 text-sm">Watch powerful teachings and testimonies</p> </a> <a href="/books" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Books</h4> <p class="text-neutral-400 text-sm">Essential reading for the remnant</p> </a> </div> </div> </div> ${renderScript($$result2, "/Users/asjames18/Development/RRG Website/src/pages/blog/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/blog/index.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
