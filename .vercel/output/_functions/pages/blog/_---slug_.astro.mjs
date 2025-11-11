import { c as createComponent, a as createAstro, d as renderComponent, e as renderTemplate, aq as Fragment, af as maybeRenderHead, ag as addAttribute, r as renderScript } from '../../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../../chunks/Base_D7yHQtjk.mjs';
import { a as getEntry, g as getCollection } from '../../chunks/_astro_content_DCMt6BOx.mjs';
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
  let { post } = Astro2.props;
  if (!post) {
    const slugParam = Array.isArray(Astro2.params.slug) ? Astro2.params.slug.join("/") : Astro2.params.slug || "";
    if (slugParam) {
      try {
        try {
          post = await getEntry("blog", slugParam);
        } catch {
          const all = await getCollection("blog");
          post = all.find((p) => p.slug === slugParam);
        }
        if (!post) {
          Astro2.response.status = 404;
        }
      } catch {
        Astro2.response.status = 404;
      }
    } else {
      Astro2.response.status = 404;
    }
  }
  let Content = null;
  let headings = [];
  if (post) {
    const rendered = await post.render();
    Content = rendered.Content;
    headings = rendered.headings;
  }
  const allPosts = await getCollection("blog");
  function getRelatedPosts(currentPost, limit = 3) {
    const related = allPosts.filter((p) => p.slug !== currentPost.slug).map((p) => {
      let score = 0;
      if (p.data.category === currentPost.data.category) score += 10;
      const sharedTags = p.data.tags.filter((tag) => currentPost.data.tags.includes(tag));
      score += sharedTags.length * 3;
      if (currentPost.data.relatedPosts?.includes(p.slug)) score += 20;
      return { post: p, score };
    }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(({ post: post2 }) => post2);
    return related;
  }
  const relatedPosts = getRelatedPosts(post);
  const publishDate = new Date(post.data.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const updateDate = post.data.updatedAt ? new Date(post.data.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : null;
  const pageUrl = encodeURIComponent(Astro2.url.href);
  const pageTitle = encodeURIComponent(post.data.title);
  const shareText = encodeURIComponent(post.data.excerpt || post.data.summary);
  return renderTemplate`${post ? renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${post.data.title} - Real & Raw Gospel` }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<article class="max-w-4xl mx-auto px-4 py-8"><!-- Back button --><a href="/blog" class="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors mb-6 group"><svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
Back to Blog
</a><!-- Header --><header class="mb-10"><!-- Category badge --><div class="mb-4"><span class="inline-block px-3 py-1 bg-amber-900/30 border border-amber-700/50 text-amber-200 text-sm font-semibold rounded-full">${post.data.category}</span></div><!-- Title --><h1 class="text-3xl md:text-5xl font-bold text-neutral-100 mb-4 leading-tight">${post.data.title}</h1><!-- Summary/Excerpt --><p class="text-lg md:text-xl text-neutral-400 mb-6">${post.data.excerpt || post.data.summary}</p><!-- Meta information --><div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-6"><div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><time${addAttribute(post.data.publishedAt.toISOString(), "datetime")}>${publishDate}</time></div>${updateDate && renderTemplate`<div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg><span>Updated ${updateDate}</span></div>`}<div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${post.data.readingTime} min read</span></div><div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg><span>${post.data.author}</span></div></div><!-- Tags -->${post.data.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-6">${post.data.tags.map((tag) => renderTemplate`<a${addAttribute(`/blog?tags=${encodeURIComponent(tag)}`, "href")} class="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-700 text-neutral-400 hover:text-amber-400 text-sm rounded-full transition-colors">
#${tag}</a>`)}</div>`}<!-- Social share buttons --><div class="flex flex-wrap items-center gap-3 pt-6 border-t border-neutral-800"><span class="text-sm text-neutral-500 mr-2">Share:</span><button id="share-twitter"${addAttribute(pageUrl, "data-url")}${addAttribute(pageTitle, "data-title")} class="share-btn flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-blue-600 border border-neutral-800 hover:border-blue-600 text-neutral-400 hover:text-white rounded-lg transition-all" aria-label="Share on Twitter"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg><span class="text-sm font-medium">Twitter</span></button><button id="share-facebook"${addAttribute(pageUrl, "data-url")} class="share-btn flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-blue-700 border border-neutral-800 hover:border-blue-700 text-neutral-400 hover:text-white rounded-lg transition-all" aria-label="Share on Facebook"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg><span class="text-sm font-medium">Facebook</span></button><button id="share-email"${addAttribute(pageTitle, "data-title")}${addAttribute(pageUrl, "data-url")}${addAttribute(shareText, "data-body")} class="share-btn flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-700 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white rounded-lg transition-all" aria-label="Share via Email"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span class="text-sm font-medium">Email</span></button><button id="copy-link"${addAttribute(Astro2.url.href, "data-url")} class="share-btn flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-amber-700 border border-neutral-800 hover:border-amber-700 text-neutral-400 hover:text-white rounded-lg transition-all" aria-label="Copy link"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span class="text-sm font-medium">Copy Link</span></button><span id="copy-feedback" class="text-sm text-green-500 opacity-0 transition-opacity">Copied!</span></div></header><!-- Main content with sidebar --><div class="grid lg:grid-cols-[1fr_300px] gap-8"><!-- Article content --><div class="min-w-0">${post.data.scriptures && post.data.scriptures.length > 0 && renderTemplate`<div class="mb-8 p-6 bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-l-4 border-amber-600 rounded-r-lg"><h3 class="text-lg font-bold text-amber-200 mb-3 flex items-center gap-2"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>
Key Scriptures
</h3><ul class="space-y-2">${post.data.scriptures.map((scripture) => renderTemplate`<li class="text-neutral-300 flex items-start gap-2"><svg class="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg><span>${scripture}</span></li>`)}</ul></div>`}${post.data.coverImage && renderTemplate`<div class="mb-8 rounded-lg overflow-hidden"><img${addAttribute(post.data.coverImage, "src")}${addAttribute(post.data.title, "alt")} class="w-full h-auto" loading="eager"></div>`}${Content && renderTemplate`<div class="prose prose-invert prose-lg max-w-none prose-headings:text-neutral-100 prose-p:text-neutral-300 prose-a:text-amber-500 hover:prose-a:text-amber-400 prose-strong:text-neutral-200 prose-code:text-amber-400 prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800">${renderComponent($$result2, "Content", Content, {})}</div>`}${post.data.authorBio && renderTemplate`<div class="mt-12 p-6 bg-neutral-900 border border-neutral-800 rounded-lg"><div class="flex items-start gap-4"><div class="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">${post.data.author.charAt(0)}</div><div class="flex-1"><h3 class="text-lg font-bold text-neutral-100 mb-2">About ${post.data.author}</h3><p class="text-neutral-400 text-sm leading-relaxed">${post.data.authorBio}</p></div></div></div>`}</div><!-- Sidebar --><aside class="space-y-6">${headings && headings.length > 0 && renderTemplate`<div class="sticky top-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg"><h3 class="text-lg font-bold text-neutral-100 mb-4 flex items-center gap-2"><svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
Table of Contents
</h3><nav id="toc" class="space-y-2">${headings.filter((h) => h.depth <= 3).map((heading) => renderTemplate`<a${addAttribute(`#${heading.slug}`, "href")} class="toc-link block text-sm text-neutral-400 hover:text-amber-400 transition-colors"${addAttribute(`padding-left: ${(heading.depth - 1) * 12}px`, "style")}${addAttribute(heading.slug, "data-heading-id")}>${heading.text}</a>`)}</nav></div>`}<div class="p-6 bg-neutral-900 border border-neutral-800 rounded-lg"><h3 class="text-lg font-bold text-neutral-100 mb-4">Quick Links</h3><div class="space-y-2"><a href="/start-here" class="block text-sm text-neutral-400 hover:text-amber-400 transition-colors">
→ Start Your Journey
</a><a href="/videos" class="block text-sm text-neutral-400 hover:text-amber-400 transition-colors">
→ Watch Videos
</a><a href="/books" class="block text-sm text-neutral-400 hover:text-amber-400 transition-colors">
→ Recommended Books
</a><a href="/blog" class="block text-sm text-neutral-400 hover:text-amber-400 transition-colors">
→ More Articles
</a></div></div></aside></div>${relatedPosts.length > 0 && renderTemplate`<section class="mt-16 pt-12 border-t border-neutral-800"><h2 class="text-2xl font-bold text-amber-100 mb-8 flex items-center gap-2"><svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
Continue Reading
</h2><div class="grid md:grid-cols-3 gap-6">${relatedPosts.map((relatedPost) => {
    const relatedPublishDate = new Date(relatedPost.data.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    return renderTemplate`<a${addAttribute(`/blog/${relatedPost.slug}`, "href")} class="group block p-6 bg-neutral-900 border border-neutral-800 hover:border-amber-700 rounded-lg transition-all hover:transform hover:scale-105"><span class="inline-block px-2 py-1 bg-amber-900/30 text-amber-300 text-xs font-semibold rounded mb-3">${relatedPost.data.category}</span><h3 class="text-lg font-bold text-neutral-100 group-hover:text-amber-200 mb-2 line-clamp-2">${relatedPost.data.title}</h3><p class="text-sm text-neutral-400 mb-4 line-clamp-2">${relatedPost.data.excerpt || relatedPost.data.summary}</p><div class="flex items-center justify-between text-xs text-neutral-500"><span>${relatedPublishDate}</span><span>${relatedPost.data.readingTime} min read</span></div></a>`;
  })}</div></section>`}<div class="mt-16 bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-700/50 rounded-xl p-8 text-center"><h3 class="text-2xl font-bold text-amber-100 mb-4">Ready to Go Deeper?</h3><p class="text-neutral-300 mb-6 max-w-2xl mx-auto">
This is just the beginning. Start your 7-day journey with real, raw truth that will transform your walk with YAHUAH.
</p><a href="/start-here" class="inline-block bg-amber-700 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full transition-colors">
Start Your 7-Day Reset
</a></div></article>${renderScript($$result2, "/Users/asjames18/Development/RRG Website/src/pages/blog/[...slug].astro?astro&type=script&index=0&lang.ts")}` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${Astro2.response.status = 404}${renderComponent($$result2, "Base", $$Base, { "title": "Not Found - Real & Raw Gospel" }, { "default": async ($$result3) => renderTemplate`<article class="max-w-3xl mx-auto px-4 py-12"><h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Article not found</h1><p class="text-neutral-300 mb-6">This post may have been moved or the link is incorrect.</p><a href="/blog" class="inline-block bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-6 py-3 rounded-lg transition-colors">← Back to Blog</a></article>` })}` })}`}`;
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
