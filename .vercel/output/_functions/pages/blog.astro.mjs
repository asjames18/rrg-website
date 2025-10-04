import { c as createComponent, b as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CtqYzVrK.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_Dqt0Kjdn.mjs';
import { g as getCollection } from '../chunks/_astro_content_EZvVieB_.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const blogPosts = await getCollection("blog");
  const sortedPosts = blogPosts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Blog" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Blog</h1> <p class="text-lg md:text-xl text-neutral-300 mb-12 max-w-3xl">
Articles, teachings, and insights for the remnant. No fluff—just truth from the Word of YAHUAH.
</p> ${sortedPosts.length > 0 ? renderTemplate`<div class="space-y-6 max-w-4xl"> ${sortedPosts.map((post) => renderTemplate`<article class="bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8 hover:border-amber-700 transition-colors"> <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4"> <div class="flex-1"> <h2 class="text-2xl md:text-3xl font-bold mb-3 text-amber-100"> <a${addAttribute(`/blog/${post.slug}`, "href")} class="hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"> ${post.data.title} </a> </h2> <p class="text-neutral-300 leading-relaxed mb-4"> ${post.data.summary} </p> <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500"> <time${addAttribute(post.data.publishedAt.toISOString(), "datetime")}> ${post.data.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> <span>•</span> <span>${post.data.readingTime} min read</span> </div> </div> </div> ${post.data.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2"> ${post.data.tags.map((tag) => renderTemplate`<span class="inline-block bg-amber-900/30 border border-amber-800 text-amber-200 text-xs font-medium px-3 py-1 rounded-full"> ${tag} </span>`)} </div>`} </article>`)} </div>` : renderTemplate`<div class="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center"> <p class="text-neutral-400">No blog posts available yet. Check back soon for raw truth and real teaching.</p> </div>`} <div class="mt-12 bg-amber-900/20 border border-amber-800/50 rounded-lg p-6 max-w-4xl"> <p class="text-neutral-300 text-sm"> <strong class="text-amber-100">Want to contribute?</strong> If you have a teaching, testimony, or word from YAHUAH 
        that aligns with our mission, we'd love to hear from you. All content must honor the sacred Names and be rooted in Scripture.
</p> </div> </div> ` })}`;
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
