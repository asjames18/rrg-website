import { c as createComponent, a as createAstro, d as renderComponent, e as renderTemplate, aq as Fragment$1, af as maybeRenderHead, ag as addAttribute, ak as unescapeHTML } from '../../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../../chunks/Base_Eh043Jls.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { S as SupabaseCMSAPI } from '../../chunks/supabase-cms-api_CUOvopCO.mjs';
export { renderers } from '../../renderers.mjs';

function UniversalVideoEmbed({
  platform,
  videoId,
  title = "Video Player",
  className = ""
}) {
  const getEmbedUrl = () => {
    switch (platform) {
      case "youtube":
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      case "tiktok":
        return `https://www.tiktok.com/embed/v2/${videoId}`;
      case "instagram":
        return `https://www.instagram.com/p/${videoId}/embed`;
      case "facebook":
        const encodedUrl = encodeURIComponent(`https://www.facebook.com/watch/?v=${videoId}`);
        return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false`;
      default:
        return "";
    }
  };
  const embedUrl = getEmbedUrl();
  if (!embedUrl) {
    return /* @__PURE__ */ jsx("div", { className: `bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center ${className}`, children: /* @__PURE__ */ jsx("p", { className: "text-neutral-500", children: "Unsupported platform" }) });
  }
  const isVertical = platform === "tiktok" || platform === "instagram";
  const aspectRatio = isVertical ? "pb-[177.78%]" : "pb-[56.25%]";
  const maxHeight = isVertical ? "max-h-[600px]" : "";
  return /* @__PURE__ */ jsx("div", { className: `relative ${aspectRatio} ${maxHeight} h-0 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800 ${className}`, children: /* @__PURE__ */ jsx(
    "iframe",
    {
      src: embedUrl,
      title,
      className: "absolute top-0 left-0 w-full h-full border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowFullScreen: true,
      loading: "lazy",
      tabIndex: 0
    }
  ) });
}

function getVideoThumbnail(platform, videoId) {
  switch (platform) {
    case "youtube":
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    case "tiktok":
      return "/video-placeholder-vertical.jpg";
    case "instagram":
      return "/video-placeholder-square.jpg";
    case "facebook":
      return "/video-placeholder.jpg";
    default:
      return "/video-placeholder.jpg";
  }
}
function getVideoThumbnailFallback(platform) {
  switch (platform) {
    case "youtube":
      return "/video-placeholder.jpg";
    case "tiktok":
      return "/video-placeholder-vertical.jpg";
    case "instagram":
      return "/video-placeholder-square.jpg";
    default:
      return "/video-placeholder.jpg";
  }
}
function getPlatformIcon(platform) {
  switch (platform) {
    case "youtube":
      return "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z";
    case "tiktok":
      return "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.11-4.89 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z";
    case "instagram":
      return "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z";
    case "facebook":
      return "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
    default:
      return "M15 10l-4.5 4.5L9 13";
  }
}
function getPlatformName(platform) {
  switch (platform) {
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    default:
      return platform;
  }
}

function VideoCard({ video, viewMode = "grid" }) {
  const [imgError, setImgError] = useState(false);
  const platform = video.metadata?.platform || "youtube";
  const videoId = video.metadata?.videoId || "";
  const thumbnailUrl = imgError ? getVideoThumbnailFallback(platform) : getVideoThumbnail(platform, videoId);
  const formattedDate = new Date(video.published_at || video.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  if (viewMode === "list") {
    return /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/videos/${video.slug}`,
        className: "group flex gap-4 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors p-4",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-48 h-28 flex-shrink-0 bg-neutral-800 rounded overflow-hidden", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: thumbnailUrl,
                alt: video.title,
                className: "w-full h-full object-cover",
                onError: () => setImgError(true),
                loading: "lazy"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-amber-700/90 group-hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white ml-1", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: getPlatformIcon(platform) }) }),
              /* @__PURE__ */ jsx("span", { children: getPlatformName(platform) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-amber-100 group-hover:text-amber-200 transition-colors mb-2 line-clamp-2", children: video.title }),
            video.summary && /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-400 mb-2 line-clamp-2", children: video.summary }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-neutral-500", children: [
              /* @__PURE__ */ jsx("time", { children: formattedDate }),
              video.metadata?.series && video.metadata.series.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { className: "text-amber-400", children: Array.isArray(video.metadata.series) ? video.metadata.series[0] : video.metadata.series })
              ] })
            ] }),
            video.metadata?.topics && video.metadata.topics.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: (Array.isArray(video.metadata.topics) ? video.metadata.topics.slice(0, 3) : [video.metadata.topics]).map((topic, i) => /* @__PURE__ */ jsx("span", { className: "inline-block bg-neutral-800 text-neutral-400 text-xs px-2 py-0.5 rounded", children: topic }, i)) })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("article", { className: "group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-amber-700 transition-colors", children: [
    /* @__PURE__ */ jsxs("a", { href: `/videos/${video.slug}`, className: "block relative aspect-video bg-neutral-800", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: thumbnailUrl,
          alt: video.title,
          className: "w-full h-full object-cover",
          onError: () => setImgError(true),
          loading: "lazy"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-amber-700/90 group-hover:bg-amber-600 group-hover:scale-110 rounded-full flex items-center justify-center transition-all", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-white ml-1", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: getPlatformIcon(platform) }) }),
        /* @__PURE__ */ jsx("span", { children: getPlatformName(platform) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold mb-2 text-amber-100 line-clamp-2", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: `/videos/${video.slug}`,
          className: "hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded",
          children: video.title
        }
      ) }),
      video.metadata?.series && video.metadata.series.length > 0 && /* @__PURE__ */ jsxs("p", { className: "text-sm text-amber-400 mb-2", children: [
        "Series: ",
        Array.isArray(video.metadata.series) ? video.metadata.series.join(", ") : video.metadata.series
      ] }),
      video.metadata?.topics && video.metadata.topics.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-3", children: [
        (Array.isArray(video.metadata.topics) ? video.metadata.topics.slice(0, 3) : [video.metadata.topics]).map((topic, i) => /* @__PURE__ */ jsx("span", { className: "inline-block bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs px-2 py-1 rounded", children: topic }, i)),
        Array.isArray(video.metadata.topics) && video.metadata.topics.length > 3 && /* @__PURE__ */ jsxs("span", { className: "inline-block text-neutral-500 text-xs px-2 py-1", children: [
          "+",
          video.metadata.topics.length - 3,
          " more"
        ] })
      ] }),
      video.summary && /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-400 line-clamp-2", children: video.summary }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 text-xs text-neutral-500", children: /* @__PURE__ */ jsx("time", { children: formattedDate }) })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
async function getStaticPaths() {
  try {
    const result = await SupabaseCMSAPI.getContent({
      type: "video",
      status: "published",
      limit: 100
    });
    return result.content.map((video) => ({
      params: { slug: video.slug },
      props: { video }
    }));
  } catch (error) {
    return [];
  }
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  let { video } = Astro2.props;
  if (!video) {
    const slugParam = Array.isArray(Astro2.params.slug) ? Astro2.params.slug.join("/") : Astro2.params.slug || "";
    if (slugParam) {
      try {
        const fetched = await SupabaseCMSAPI.getContentBySlug(slugParam, { type: "video", status: "published" });
        if (fetched) {
          video = fetched;
        } else {
          Astro2.response.status = 404;
        }
      } catch {
        Astro2.response.status = 404;
      }
    } else {
      Astro2.response.status = 404;
    }
  }
  const formattedDate = video ? new Date(video.published_at || video.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";
  const hasBody = !!(video && (video.body_html && video.body_html.trim().length > 0 || video.body_md && video.body_md.trim().length > 0));
  function escapeHtml(input) {
    return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function renderBasicMarkdown(markdown) {
    if (!markdown) return "";
    let md = markdown.replace(/\r\n/g, "\n");
    md = md.replace(/```([\s\S]*?)```/g, (_m, code) => {
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    });
    md = md.replace(/`([^`]+)`/g, (_m, code) => `<code>${escapeHtml(code)}</code>`);
    md = md.replace(/^\s*######\s+(.*)$/gm, "<h6>$1</h6>").replace(/^\s*#####\s+(.*)$/gm, "<h5>$1</h5>").replace(/^\s*####\s+(.*)$/gm, "<h4>$1</h4>").replace(/^\s*###\s+(.*)$/gm, "<h3>$1</h3>").replace(/^\s*##\s+(.*)$/gm, "<h2>$1</h2>").replace(/^\s*#\s+(.*)$/gm, "<h1>$1</h1>");
    md = md.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/__([^_]+)__/g, "<strong>$1</strong>").replace(/_([^_]+)_/g, "<em>$1</em>");
    md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    md = md.replace(/(?:^\s*[-*]\s+.*(?:\n|$))+?/gm, (block) => {
      const items = block.trim().split("\n").map((line) => line.replace(/^\s*[-*]\s+/, "").trim()).filter(Boolean).map((item) => `<li>${item}</li>`).join("");
      return items ? `<ul>${items}</ul>
` : block;
    });
    md = md.split(/\n{2,}/).map((chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return "";
      if (/^<h\d|^<ul|^<pre|^<blockquote|^<table|^<p|^<code/.test(trimmed)) {
        return trimmed;
      }
      const joined = trimmed.replace(/\n+/g, " ");
      return `<p>${joined}</p>`;
    }).join("\n");
    return md;
  }
  let relatedVideos = [];
  try {
    const allVideosResult = await SupabaseCMSAPI.getContent({
      type: "video",
      status: "published",
      limit: 50
    });
    relatedVideos = (video ? allVideosResult.content.filter((v) => v.id !== video.id) : allVideosResult.content).map((v) => {
      let relevanceScore = 0;
      if (video?.metadata?.series && v.metadata?.series) {
        const matchingSeries = video.metadata.series.filter(
          (s) => v.metadata.series.includes(s)
        );
        relevanceScore += matchingSeries.length * 10;
      }
      if (video?.metadata?.topics && v.metadata?.topics) {
        const matchingTopics = video.metadata.topics.filter(
          (t) => v.metadata.topics.includes(t)
        );
        relevanceScore += matchingTopics.length * 5;
      }
      return { ...v, relevanceScore };
    }).filter((v) => v.relevanceScore > 0).sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
  } catch (error) {
    relatedVideos = [];
  }
  let seriesNav = { prev: null, next: null };
  if (video?.metadata?.series && video.metadata.series.length > 0) {
    try {
      const seriesName = video.metadata.series[0];
      const seriesResult = await SupabaseCMSAPI.getContent({
        type: "video",
        status: "published",
        limit: 100
      });
      const seriesVideos = seriesResult.content.filter((v) => v.metadata?.series?.includes(seriesName)).sort(
        (a, b) => new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime()
      );
      const currentIndex = seriesVideos.findIndex((v) => v.id === video.id);
      if (currentIndex > 0) {
        seriesNav.prev = seriesVideos[currentIndex - 1];
      }
      if (currentIndex < seriesVideos.length - 1) {
        seriesNav.next = seriesVideos[currentIndex + 1];
      }
    } catch (error) {
    }
  }
  return renderTemplate`${video ? renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": video.title, "description": `Watch: ${video.title}` }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<article class="container mx-auto px-4 py-12 md:py-16 max-w-5xl"><!-- Header --><header class="mb-8"><h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">${video.title}</h1><div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-6"><time${addAttribute(new Date(video.published_at || video.created_at).toISOString(), "datetime")}>${formattedDate}</time>${video.metadata?.series && video.metadata.series.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate`<span>•</span><span class="text-amber-400">
Series: ${Array.isArray(video.metadata.series) ? video.metadata.series.join(", ") : video.metadata.series}</span>` })}`}</div>${video.metadata?.topics && video.metadata.topics.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-4">${Array.isArray(video.metadata.topics) ? video.metadata.topics.map((topic) => renderTemplate`<span class="inline-block bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm px-3 py-1.5 rounded">${topic}</span>`) : renderTemplate`<span class="inline-block bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm px-3 py-1.5 rounded">${video.metadata.topics}</span>`}</div>`}</header><!-- Video Embed --><div class="mb-8 md:mb-12">${renderComponent($$result2, "UniversalVideoEmbed", UniversalVideoEmbed, { "platform": video.metadata?.platform || "youtube", "videoId": video.metadata?.videoId || "", "title": video.title, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/UniversalVideoEmbed", "client:component-export": "default" })}</div><!-- Scripture References -->${video.metadata?.scriptures && video.metadata.scriptures.length > 0 && renderTemplate`<div class="mb-8 bg-amber-900/20 border border-amber-800/50 rounded-lg p-6"><h2 class="text-lg font-bold text-amber-100 mb-3">Scripture References</h2><div class="flex flex-wrap gap-2">${Array.isArray(video.metadata.scriptures) ? video.metadata.scriptures.map((scripture) => renderTemplate`<span class="inline-block bg-neutral-900 border border-amber-800 text-amber-200 text-sm font-medium px-3 py-1.5 rounded">${scripture}</span>`) : renderTemplate`<span class="inline-block bg-neutral-900 border border-amber-800 text-amber-200 text-sm font-medium px-3 py-1.5 rounded">${video.metadata.scriptures}</span>`}</div></div>`}<!-- Teaching Notes Content -->${hasBody && renderTemplate`<div class="prose prose-lg prose-invert max-w-none mb-8"><h2 class="text-2xl font-bold text-amber-100 mb-4">Teaching Notes</h2>${video.body_html && video.body_html.trim().length > 0 ? renderTemplate`<div>${unescapeHTML(video.body_html)}</div>` : renderTemplate`<div>${unescapeHTML(renderBasicMarkdown(video.body_md))}</div>`}</div>`}<!-- Series Navigation -->${(seriesNav.prev || seriesNav.next) && renderTemplate`<div class="mt-8 pt-8 border-t border-neutral-800"><h3 class="text-lg font-bold text-amber-100 mb-4">Series Navigation</h3><div class="grid md:grid-cols-2 gap-4">${seriesNav.prev ? renderTemplate`<a${addAttribute(`/videos/${seriesNav.prev.slug}`, "href")} class="group flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-amber-700 rounded-lg transition-colors"><svg class="w-6 h-6 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg><div class="flex-1 min-w-0"><div class="text-xs text-neutral-500 mb-1">Previous in Series</div><div class="font-semibold text-amber-100 group-hover:text-amber-200 transition-colors line-clamp-2">${seriesNav.prev.title}</div></div></a>` : renderTemplate`<div></div>`}${seriesNav.next && renderTemplate`<a${addAttribute(`/videos/${seriesNav.next.slug}`, "href")} class="group flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-amber-700 rounded-lg transition-colors md:ml-auto"><div class="flex-1 min-w-0 text-right"><div class="text-xs text-neutral-500 mb-1">Next in Series</div><div class="font-semibold text-amber-100 group-hover:text-amber-200 transition-colors line-clamp-2">${seriesNav.next.title}</div></div><svg class="w-6 h-6 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>`}</div></div>`}<!-- Share Buttons --><div class="mt-8 pt-8 border-t border-neutral-800"><h3 class="text-lg font-bold text-amber-100 mb-4">Share This Video</h3><div class="flex gap-3"><button${addAttribute(`navigator.share ? navigator.share({title: '${video.title}', url: window.location.href}) : navigator.clipboard.writeText(window.location.href)`, "onclick")} class="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-700 text-neutral-300 hover:text-amber-200 rounded-lg transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg><span>Share</span></button><button${addAttribute(`navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))`, "onclick")} class="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-700 text-neutral-300 hover:text-amber-200 rounded-lg transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span>Copy Link</span></button></div></div><!-- Related Videos -->${relatedVideos.length > 0 && renderTemplate`<div class="mt-12 pt-8 border-t border-neutral-800"><h3 class="text-2xl font-bold text-amber-100 mb-6">Related Videos</h3><div class="grid md:grid-cols-3 gap-6">${relatedVideos.map((relatedVideo) => renderTemplate`${renderComponent($$result2, "VideoCard", VideoCard, { "video": relatedVideo, "viewMode": "grid", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/VideoCard", "client:component-export": "default" })}`)}</div></div>`}<!-- Footer / Continue Training --><footer class="mt-12 pt-8 border-t border-neutral-800"><div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8"><h3 class="text-xl font-bold text-amber-100 mb-3">Continue Training</h3><p class="text-neutral-300 mb-4">
Keep pressing forward in your walk with YAHUSHA. Explore more teachings and resources.
</p><div class="flex flex-wrap gap-3"><a href="/videos" class="inline-block bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
← All Videos
</a><a href="/spiritual-warfare" class="inline-block bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
Train for War
</a><a href="/blog" class="inline-block bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
Read the Blog
</a></div></div></footer></article>` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": async ($$result2) => renderTemplate`${Astro2.response.status = 404}${renderComponent($$result2, "Base", $$Base, { "title": "Not Found", "description": "Video not found" }, { "default": async ($$result3) => renderTemplate`<article class="container mx-auto px-4 py-12 md:py-16 max-w-3xl"><h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Video not found</h1><p class="text-neutral-300 mb-6">The video you’re looking for may have been unpublished or the link is incorrect.</p><a href="/videos" class="inline-block bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black">
← Back to Videos
</a></article>` })}` })}`}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/videos/[...slug].astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/videos/[...slug].astro";
const $$url = "/videos/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
