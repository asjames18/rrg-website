import { c as createComponent, d as createAstro, b as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute, F as Fragment } from '../../chunks/astro/server_CtqYzVrK.mjs';
import 'kleur/colors';
import { g as getCollection } from '../../chunks/_astro_content_EZvVieB_.mjs';
import { $ as $$Base } from '../../chunks/Base_Dqt0Kjdn.mjs';
import { U as UniversalVideoEmbed } from '../../chunks/UniversalVideoEmbed_vRksbGrn.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  const videos = await getCollection("videos");
  return videos.map((video) => ({
    params: { slug: video.slug },
    props: { video }
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { video } = Astro2.props;
  const { Content } = await video.render();
  const formattedDate = video.data.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const hasBody = video.body && video.body.trim().length > 0;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": video.data.title, "description": `Watch: ${video.data.title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="container mx-auto px-4 py-12 md:py-16 max-w-5xl"> <!-- Header --> <header class="mb-8"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100"> ${video.data.title} </h1> <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-6"> <time${addAttribute(video.data.publishedAt.toISOString(), "datetime")}> ${formattedDate} </time> ${video.data.series.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span>•</span> <span class="text-amber-400">
Series: ${video.data.series.join(", ")} </span> ` })}`} </div> ${video.data.topics.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-4"> ${video.data.topics.map((topic) => renderTemplate`<span class="inline-block bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm px-3 py-1.5 rounded"> ${topic} </span>`)} </div>`} </header> <!-- Video Embed --> <div class="mb-8 md:mb-12"> ${renderComponent($$result2, "UniversalVideoEmbed", UniversalVideoEmbed, { "platform": video.data.platform, "videoId": video.data.videoId, "title": video.data.title, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UniversalVideoEmbed", "client:component-export": "default" })} </div> <!-- Scripture References --> ${video.data.scriptures.length > 0 && renderTemplate`<div class="mb-8 bg-amber-900/20 border border-amber-800/50 rounded-lg p-6"> <h2 class="text-lg font-bold text-amber-100 mb-3">Scripture References</h2> <div class="flex flex-wrap gap-2"> ${video.data.scriptures.map((scripture) => renderTemplate`<span class="inline-block bg-neutral-900 border border-amber-800 text-amber-200 text-sm font-medium px-3 py-1.5 rounded"> ${scripture} </span>`)} </div> </div>`} <!-- MDX Content (Teaching Notes) --> ${hasBody && renderTemplate`<div class="prose prose-lg prose-invert max-w-none mb-8"> <h2 class="text-2xl font-bold text-amber-100 mb-4">Teaching Notes</h2> ${renderComponent($$result2, "Content", Content, {})} </div>`} <!-- Footer / Related --> <footer class="mt-12 pt-8 border-t border-neutral-800"> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8"> <h3 class="text-xl font-bold text-amber-100 mb-3">Continue Training</h3> <p class="text-neutral-300 mb-4">
Keep pressing forward in your walk with YAHUSHA. Explore more teachings and resources.
</p> <div class="flex gap-3"> <a href="/videos" class="inline-block bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
← All Videos
</a> <a href="/spiritual-warfare" class="inline-block bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
Train for War
</a> </div> </div> </footer> </article> ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/videos/[...slug].astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/videos/[...slug].astro";
const $$url = "/videos/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
