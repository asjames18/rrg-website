import { c as createComponent, b as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_DCtlZR10.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CLTBcQpW.mjs';
import { U as UniversalVideoEmbed } from '../chunks/UniversalVideoEmbed_vRksbGrn.mjs';
import { g as getCollection } from '../chunks/_astro_content_BOCDX7x3.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const videoContent = await getCollection("videos");
  const sortedVideos = videoContent.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Videos" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Videos</h1> <p class="text-lg md:text-xl text-neutral-300 mb-12 max-w-3xl">
Watch powerful teachings, testimonies, and training from the remnant. No fluff—just raw truth.
</p> ${sortedVideos.length > 0 ? renderTemplate`<div class="grid md:grid-cols-2 gap-8 max-w-6xl"> ${sortedVideos.map((video) => renderTemplate`<article class="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors"> ${renderComponent($$result2, "UniversalVideoEmbed", UniversalVideoEmbed, { "platform": video.data.platform, "videoId": video.data.videoId, "title": video.data.title, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UniversalVideoEmbed", "client:component-export": "default" })} <div class="p-6"> <h2 class="text-xl font-bold mb-2 text-amber-100"> <a${addAttribute(`/videos/${video.slug}`, "href")} class="hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"> ${video.data.title} </a> </h2> ${video.data.series.length > 0 && renderTemplate`<p class="text-sm text-amber-400 mb-2">
Series: ${video.data.series.join(", ")} </p>`} <div class="flex flex-wrap gap-2 mb-3"> ${video.data.topics.map((topic) => renderTemplate`<span class="inline-block bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs px-2 py-1 rounded"> ${topic} </span>`)} </div> ${video.data.scriptures.length > 0 && renderTemplate`<p class="text-xs text-neutral-500">
Scriptures: ${video.data.scriptures.join(", ")} </p>`} </div> </article>`)} </div>` : renderTemplate`<div class="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center"> <p class="text-neutral-400">No videos available yet. Check back soon for teachings and testimonies.</p> </div>`} <div class="mt-12 bg-amber-900/20 border border-amber-800/50 rounded-lg p-6 max-w-3xl"> <p class="text-neutral-300"> <strong class="text-amber-100">Note:</strong> More video content coming soon. 
        This page will feature teachings on spiritual warfare, the Feasts of YAHUAH, end-times prophecy, and more.
</p> </div> </div> ` })}`;
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
