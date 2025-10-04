import { c as createComponent, d as createAstro, b as renderComponent, a as renderTemplate, m as maybeRenderHead, f as addAttribute, e as Fragment } from '../../chunks/astro/server_ClRe6QG4.mjs';
import 'kleur/colors';
import { g as getCollection } from '../../chunks/_astro_content_tkZut0qg.mjs';
import { $ as $$Base } from '../../chunks/Base_Cyjh60mP.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  const blogPosts = await getCollection("blog");
  return blogPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { post } = Astro2.props;
  const { Content } = await post.render();
  const formattedDate = post.data.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": post.data.title, "description": post.data.summary }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="container mx-auto px-4 py-12 md:py-16 max-w-4xl"> <!-- Header --> <header class="mb-8 md:mb-12"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100"> ${post.data.title} </h1> <p class="text-lg md:text-xl text-neutral-300 mb-6 leading-relaxed"> ${post.data.summary} </p> <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500 pb-6 border-b border-neutral-800"> <time${addAttribute(post.data.publishedAt.toISOString(), "datetime")}> ${formattedDate} </time> <span>•</span> <span>${post.data.readingTime} min read</span> ${post.data.tags.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span>•</span> <div class="flex flex-wrap gap-2"> ${post.data.tags.map((tag) => renderTemplate`<span class="inline-block bg-amber-900/30 border border-amber-800 text-amber-200 text-xs font-medium px-3 py-1 rounded-full"> ${tag} </span>`)} </div> ` })}`} </div> </header> <!-- MDX Content --> <div class="prose prose-lg prose-invert max-w-none"> ${renderComponent($$result2, "Content", Content, {})} </div> <!-- Footer / CTA --> <footer class="mt-12 pt-8 border-t border-neutral-800"> <div class="bg-amber-900/20 border border-amber-800/50 rounded-lg p-6 md:p-8"> <h3 class="text-xl font-bold text-amber-100 mb-3">Share This Message</h3> <p class="text-neutral-300 mb-4">
If this teaching blessed you, share it with others who need to hear the raw truth of YAHUAH's Word.
</p> <div class="flex gap-3"> <a href="/blog" class="inline-block bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
← Back to Blog
</a> <a href="/start-here" class="inline-block bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
Get Started
</a> </div> </div> </footer> </article> ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/blog/[...slug].astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/blog/[...slug].astro";
const $$url = "/blog/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
