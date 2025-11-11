import { c as createComponent, d as renderComponent, e as renderTemplate, af as maybeRenderHead, ag as addAttribute } from '../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_BI6EUuN9.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { S as SupabaseCMSAPI } from '../chunks/supabase-cms-api_dv2hqhP9.mjs';
export { renderers } from '../renderers.mjs';

function AudioPlayer({ tracks, className = "" }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex, tracks.length]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);
  const goToPrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1);
    }
  };
  const goToNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1);
    }
  };
  if (tracks.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: `bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center ${className}`, children: /* @__PURE__ */ jsx("p", { className: "text-neutral-500", children: "No tracks available" }) });
  }
  const currentTrack = tracks[currentTrackIndex];
  return /* @__PURE__ */ jsxs("div", { className: `bg-neutral-900 border border-neutral-800 rounded-lg p-6 ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-amber-100 mb-1", children: currentTrack.title }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-500", children: [
        "Track ",
        currentTrackIndex + 1,
        " of ",
        tracks.length
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "audio",
      {
        ref: audioRef,
        controls: true,
        className: "w-full mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded",
        preload: "metadata",
        children: [
          /* @__PURE__ */ jsx("source", { src: currentTrack.src, type: "audio/mpeg" }),
          "Your browser does not support the audio element."
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: goToPrevious,
          disabled: currentTrackIndex === 0,
          className: "flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed text-neutral-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
          "aria-label": "Previous track",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6h2v12H6zm3.5 6l8.5 6V6z" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Previous" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: goToNext,
          disabled: currentTrackIndex === tracks.length - 1,
          className: "flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed text-neutral-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
          "aria-label": "Next track",
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Next" }),
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M16 18h2V6h-2zm-11.5-6L13 6v12z" }) })
          ]
        }
      )
    ] }),
    tracks.length > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-6 border-t border-neutral-800", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-neutral-400 mb-3", children: "Playlist" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: tracks.map((track, index) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setCurrentTrackIndex(index),
          className: `w-full text-left px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${index === currentTrackIndex ? "bg-amber-900/30 text-amber-100 border border-amber-700" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-transparent"}`,
          children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: track.title })
        },
        index
      )) })
    ] })
  ] });
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let musicContent = [];
  let audioTracks = [];
  try {
    const result = await SupabaseCMSAPI.getContent({
      type: "music",
      status: "published",
      limit: 50,
      sortBy: "published_at",
      sortOrder: "desc"
    });
    musicContent = result.content || [];
    audioTracks = musicContent.filter((item) => item.metadata?.type === "audio" && item.metadata?.audioSrc).map((item) => ({
      title: item.title,
      src: item.metadata.audioSrc
    }));
  } catch (error) {
    musicContent = [];
    audioTracks = [];
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Music" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Music</h1> <p class="text-lg md:text-xl text-neutral-300 mb-12 max-w-3xl">
Worship music that honors the sacred Names and glorifies YAHUAH.
</p> <div class="max-w-3xl mx-auto"> ${audioTracks.length > 0 ? renderTemplate`<div class="mb-12"> ${renderComponent($$result2, "AudioPlayer", AudioPlayer, { "tracks": audioTracks, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/AudioPlayer", "client:component-export": "default" })} </div>` : renderTemplate`<div class="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center mb-12"> <p class="text-neutral-400">No music tracks available yet. Check back soon for worship songs and teachings.</p> </div>`}  ${musicContent.length > 0 && renderTemplate`<div class="space-y-6 mb-12"> <h2 class="text-2xl font-bold text-amber-100">All Music</h2> ${musicContent.map((item) => renderTemplate`<article class="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-amber-700 transition-colors"> <h3 class="text-xl font-bold mb-2 text-amber-100"> <a${addAttribute(`/music/${item.slug}`, "href")} class="hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"> ${item.title} </a> </h3> <p class="text-sm text-neutral-400 mb-3">
Type: ${item.metadata?.type === "audio" ? "\u{1F3B5} Audio" : "\u{1F3AC} Video"} </p> ${item.metadata?.scriptures && item.metadata.scriptures.length > 0 && renderTemplate`<p class="text-xs text-neutral-500">
Scriptures: ${Array.isArray(item.metadata.scriptures) ? item.metadata.scriptures.join(", ") : item.metadata.scriptures} </p>`} ${item.summary && renderTemplate`<p class="text-sm text-neutral-400 mt-3"> ${item.summary} </p>`} </article>`)} </div>`} <div class="bg-amber-900/20 border border-amber-800/50 rounded-lg p-6"> <p class="text-neutral-300 text-sm"> <strong class="text-amber-100">Note:</strong> Music content coming soon. 
          This player will feature worship songs, hymns, and audio teachings that honor the sacred Names of YAHUAH, YAHUSHA, and RUACH HAQODESH.
</p> </div> <!-- Continue Your Training --> <div class="mt-12 bg-neutral-950 border border-neutral-800 rounded-lg p-8"> <h3 class="text-2xl font-bold text-amber-100 mb-6 text-center">Continue Your Training</h3> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> <a href="/walk-in-the-spirit" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Walk in the Spirit</h4> <p class="text-neutral-400 text-sm">Daily self-check and Spirit-led living</p> </a> <a href="/prayer-and-fasting" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Prayer & Fasting</h4> <p class="text-neutral-400 text-sm">Sharpen your spiritual weapons</p> </a> <a href="/videos" class="group block p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-700 transition-colors"> <h4 class="text-lg font-bold text-amber-100 group-hover:text-amber-200 mb-2">Videos</h4> <p class="text-neutral-400 text-sm">Watch teachings and testimonies</p> </a> </div> </div> </div> </div> ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/music/index.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/music/index.astro";
const $$url = "/music";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
