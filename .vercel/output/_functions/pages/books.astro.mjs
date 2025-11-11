import { c as createComponent, a as createAstro, d as renderComponent, e as renderTemplate, af as maybeRenderHead, ag as addAttribute, r as renderScript } from '../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_D7yHQtjk.mjs';
import { g as getCollection } from '../chunks/_astro_content_DCMt6BOx.mjs';
import { B as BookCard } from '../chunks/BookCard_B45yspGI.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const bookContent = await getCollection("books");
  const searchParams = Astro2.url.searchParams;
  const initialViewMode = searchParams.get("view") || "grid";
  const initialSearch = searchParams.get("q") || "";
  const initialTopics = searchParams.get("topics")?.split(",").filter(Boolean) || [];
  const initialCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const initialAuthors = searchParams.get("authors")?.split(",").filter(Boolean) || [];
  const initialLevels = searchParams.get("levels")?.split(",").filter(Boolean) || [];
  const initialSort = searchParams.get("sort") || "newest";
  const groupByCategory = searchParams.get("groupBy") === "category";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Recommended Books" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <div class="mb-12"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Recommended Books</h1> <p class="text-lg md:text-xl text-neutral-300 mb-6 max-w-3xl">
Essential reading for the remnant. These resources align with biblical truth and help train believers in righteousness.
</p> </div> <div id="books-app"${addAttribute(JSON.stringify(bookContent), "data-books")}${addAttribute(initialViewMode, "data-initial-view-mode")}${addAttribute(initialSearch, "data-initial-search")}${addAttribute(JSON.stringify(initialTopics), "data-initial-topics")}${addAttribute(JSON.stringify(initialCategories), "data-initial-categories")}${addAttribute(JSON.stringify(initialAuthors), "data-initial-authors")}${addAttribute(JSON.stringify(initialLevels), "data-initial-levels")}${addAttribute(initialSort, "data-initial-sort")}${addAttribute(groupByCategory, "data-group-by-category")}> <div class="space-y-8">  <div id="filters-container"></div>  <div class="flex items-center justify-between"> <div class="flex items-center gap-3"> <label class="flex items-center gap-2 text-neutral-300 cursor-pointer"> <input type="checkbox" id="group-by-category" class="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-amber-700 focus:ring-amber-500 focus:ring-offset-neutral-950"> <span>Group by Category</span> </label> </div> <div id="results-count" class="text-sm text-neutral-500"></div> </div>  <div id="books-container">  ${bookContent.length > 0 ? renderTemplate`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> ${bookContent.map((book) => renderTemplate`${renderComponent($$result2, "BookCard", BookCard, { "book": book, "viewMode": "grid", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/BookCard", "client:component-export": "default" })}`)} </div>` : renderTemplate`<div class="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center"> <svg class="w-16 h-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path> </svg> <p class="text-neutral-400 text-lg mb-2">No books available yet.</p> <p class="text-neutral-500 text-sm">Check back soon for recommended resources.</p> </div>`} </div> </div> </div>  <div class="mt-16 bg-amber-900/20 border border-amber-800/50 rounded-lg p-6 max-w-3xl mx-auto"> <p class="text-neutral-300 text-sm text-center"> <span class="text-amber-100 font-semibold">★ Links may support the mission at no extra cost.</span><br>
When you purchase through affiliate links, we may receive a small commission. 
        This helps support the ministry and keeps resources free. Your price stays the same.
</p> </div> </div> ${renderScript($$result2, "/Users/asjames18/Development/RRG Website/src/pages/books/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/books/index.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/books/index.astro";
const $$url = "/books";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
