import { c as createComponent, b as renderComponent, a as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../chunks/astro/server_Dkd2Gmz6.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CnD7KCS-.mjs';
import { g as getCollection } from '../chunks/_astro_content_CE37nYmy.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const bookContent = await getCollection("books");
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Recommended Books" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Recommended Books</h1> <p class="text-lg md:text-xl text-neutral-300 mb-12 max-w-3xl">
Essential reading for the remnant. These resources align with biblical truth and help train believers in righteousness.
</p> ${bookContent.length > 0 ? renderTemplate`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"> ${bookContent.map((book) => renderTemplate`<article class="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors flex flex-col">  <div class="bg-gradient-to-br from-neutral-800 to-neutral-900 h-64 flex items-center justify-center border-b border-neutral-800"> <div class="text-center p-6"> <svg class="w-16 h-16 mx-auto mb-4 text-amber-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path> </svg> <p class="text-sm text-neutral-500">Book Cover</p> </div> </div>  <div class="p-6 flex-1 flex flex-col"> <h2 class="text-xl font-bold mb-2 text-amber-100"> <a${addAttribute(`/books/${book.data.slug || book.slug}`, "href")} class="hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"> ${book.data.title} </a> </h2> <p class="text-sm text-neutral-400 mb-3">by ${book.data.author}</p> ${book.data.topics.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-4"> ${book.data.topics.map((topic) => renderTemplate`<span class="inline-block bg-amber-900/30 border border-amber-800 text-amber-200 text-xs px-2 py-1 rounded"> ${topic} </span>`)} </div>`} <a${addAttribute(book.data.affiliate.url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 mt-auto"> <span>${book.data.affiliate.label}</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a> <p class="text-xs text-neutral-500 mt-2 text-center">via ${book.data.affiliate.merchant}</p> </div> </article>`)} </div>` : renderTemplate`<div class="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center mb-12"> <p class="text-neutral-400">No books available yet. Check back soon for recommended resources.</p> </div>`}  <div class="bg-amber-900/20 border border-amber-800/50 rounded-lg p-6 max-w-3xl mx-auto"> <p class="text-neutral-300 text-sm text-center"> <span class="text-amber-100 font-semibold">★ Links may support the mission at no extra cost.</span><br>
When you purchase through affiliate links, we may receive a small commission. 
        This helps support the ministry and keeps resources free. Your price stays the same.
</p> </div> </div> ` })}`;
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
