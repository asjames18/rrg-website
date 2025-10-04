import { jsx } from 'react/jsx-runtime';

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

export { UniversalVideoEmbed as U };
