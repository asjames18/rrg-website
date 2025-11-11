import { c as createComponent, a as createAstro, r as renderScript, b as renderHead, d as renderComponent, e as renderTemplate } from '../chunks/astro/server_C55dHw2B.mjs';
import 'kleur/colors';
import { s as supabaseServer } from '../chunks/supabase-server_CrvNcPIF.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const supabase = createClient(
  "https://lebumzszhhjlpflqgity.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYnVtenN6aGhqbHBmbHFnaXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTk5NjgsImV4cCI6MjA3NTA3NTk2OH0.2XeY7OXkEfXiG_qwlSRN5rNE2gbZde42v4KfTrmctSs"
);
function MediaPicker({ onSelect, onUpload }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    loadFiles();
  }, []);
  const loadFiles = async () => {
    try {
      const { data, error } = await supabase.storage.from("media").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" }
      });
      if (error) {
        console.error("Error loading files:", error);
        return;
      }
      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase.storage.from("media").getPublicUrl(file.name);
          return {
            id: file.id,
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || "unknown",
            created_at: file.created_at
          };
        })
      );
      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileUpload = async (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("media").upload(fileName, file);
        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }
        setUploadProgress((i + 1) / selectedFiles.length * 100);
      }
      await loadFiles();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) {
      return /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) });
    } else if (type.startsWith("video/")) {
      return /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) });
    } else if (type.startsWith("audio/")) {
      return /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" }) });
    } else {
      return /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) });
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors", children: [
      /* @__PURE__ */ jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", stroke: "currentColor", fill: "none", viewBox: "0 0 48 48", children: /* @__PURE__ */ jsx("path", { d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: "file-upload", className: "cursor-pointer", children: [
          /* @__PURE__ */ jsx("span", { className: "mt-2 block text-sm font-medium text-gray-900", children: isUploading ? "Uploading..." : "Upload files" }),
          /* @__PURE__ */ jsx("span", { className: "mt-1 block text-sm text-gray-500", children: "PNG, JPG, GIF, MP4, MP3 up to 50MB each" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "file-upload",
            name: "file-upload",
            type: "file",
            className: "sr-only",
            multiple: true,
            onChange: handleFileUpload,
            disabled: isUploading
          }
        )
      ] }),
      isUploading && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-amber-500 h-2 rounded-full transition-all duration-300",
            style: { width: `${uploadProgress}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-600", children: [
          Math.round(uploadProgress),
          "% complete"
        ] })
      ] })
    ] }),
    files.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: files.map((file) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-gray-100 flex items-center justify-center", children: [
        file.type.startsWith("image/") ? /* @__PURE__ */ jsx(
          "img",
          {
            src: file.url,
            alt: file.name,
            className: "w-full h-full object-cover",
            onError: (e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }
          }
        ) : null,
        /* @__PURE__ */ jsx("div", { className: `${file.type.startsWith("image/") ? "hidden" : ""} text-center p-4`, children: getFileIcon(file.type) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 truncate", title: file.name, children: file.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: formatFileSize(file.size) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => copyToClipboard(file.url),
              className: "flex-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors",
              children: "Copy URL"
            }
          ),
          onSelect && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onSelect(file.url),
              className: "flex-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition-colors",
              children: "Select"
            }
          )
        ] })
      ] })
    ] }, file.id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
      /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No media files" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Get started by uploading some files." })
    ] })
  ] });
}

function SupabaseContentEditor({ contentId, onSave, onCancel }) {
  const [content, setContent] = useState({
    title: "",
    slug: "",
    content_type: "blog",
    status: "draft",
    featured: false,
    summary: "",
    body_md: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: [],
    metadata: {
      platform: "youtube",
      videoId: "",
      series: [],
      topics: [],
      scriptures: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  useEffect(() => {
    if (contentId) {
      loadContent();
    }
    loadTags();
  }, [contentId]);
  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cms/content/${contentId}`);
      const data = await response.json();
      if (response.ok) {
        setContent({
          ...data,
          metadata: data.metadata || {
            platform: "youtube",
            videoId: "",
            series: [],
            topics: [],
            scriptures: []
          }
        });
        setSelectedTags(data.tags?.map((tag) => tag.id) || []);
      } else {
        setError(data.error || "Failed to load content");
      }
    } catch (err) {
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };
  const loadTags = async () => {
    try {
      const response = await fetch("/api/cms/tags");
      const data = await response.json();
      if (response.ok) {
        setTags(data.tags || []);
      }
    } catch (err) {
      console.error("Failed to load tags:", err);
    }
  };
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const response = await fetch(contentId ? `/api/cms/content/${contentId}` : "/api/cms/content", {
        method: contentId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...content,
          tags: selectedTags
        })
      });
      const data = await response.json();
      if (response.ok) {
        onSave?.(data);
      } else {
        setError(data.error || "Failed to save content");
      }
    } catch (err) {
      setError("Failed to save content");
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => {
    onCancel?.();
  };
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500" }),
      /* @__PURE__ */ jsx("div", { className: "text-amber-100 font-medium", children: "Loading content..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-8 py-6 border-b border-neutral-800 bg-neutral-800/50", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-amber-100", children: contentId ? "Edit Content" : "Create New Content" }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-sm mt-1", children: contentId ? "Update your content" : "Create a new piece of content" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
      error && /* @__PURE__ */ jsx("div", { className: "p-4 bg-red-900/20 border border-red-700/30 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-red-300 text-sm", children: error }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Title *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: content.title,
              onChange: (e) => {
                setContent({ ...content, title: e.target.value, slug: generateSlug(e.target.value) });
              },
              className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
              placeholder: "Enter content title"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Slug *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: content.slug,
              onChange: (e) => setContent({ ...content, slug: e.target.value }),
              className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
              placeholder: "url-friendly-slug"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Content Type *" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: content.content_type,
              onChange: (e) => setContent({ ...content, content_type: e.target.value }),
              className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "blog", children: "Blog Post" }),
                /* @__PURE__ */ jsx("option", { value: "video", children: "Video" }),
                /* @__PURE__ */ jsx("option", { value: "book", children: "Book" }),
                /* @__PURE__ */ jsx("option", { value: "music", children: "Music" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Status *" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: content.status,
              onChange: (e) => setContent({ ...content, status: e.target.value }),
              className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
                /* @__PURE__ */ jsx("option", { value: "published", children: "Published" }),
                /* @__PURE__ */ jsx("option", { value: "archived", children: "Archived" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: content.featured,
              onChange: (e) => setContent({ ...content, featured: e.target.checked }),
              className: "w-4 h-4 text-amber-600 bg-neutral-800 border-neutral-700 rounded focus:ring-amber-500"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-amber-100 text-sm", children: "Featured" })
        ] }) })
      ] }),
      content.content_type === "music" && /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700 rounded-lg p-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-amber-100 mb-4", children: "Music Information" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Music Type *" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: content.metadata?.type || "audio",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, type: e.target.value }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "audio", children: "🎵 Audio Track" }),
                  /* @__PURE__ */ jsx("option", { value: "video", children: "🎬 Music Video" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Audio Source URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "url",
                value: content.metadata?.audioSrc || "",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, audioSrc: e.target.value }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                placeholder: "https://example.com/audio/song.mp3"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-1", children: "Direct URL to audio file (MP3, WAV, etc.)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Platform (for video music)" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: content.metadata?.platform || "youtube",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, platform: e.target.value }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "youtube", children: "YouTube" }),
                  /* @__PURE__ */ jsx("option", { value: "vimeo", children: "Vimeo" }),
                  /* @__PURE__ */ jsx("option", { value: "facebook", children: "Facebook" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Video ID (for video music)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: content.metadata?.videoId || "",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, videoId: e.target.value }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                placeholder: "Video ID from platform"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Scriptures (comma-separated)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: Array.isArray(content.metadata?.scriptures) ? content.metadata.scriptures.join(", ") : content.metadata?.scriptures || "",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, scriptures: e.target.value.split(",").map((s) => s.trim()).filter((s) => s) }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                placeholder: "Revelation 12:11, Romans 8:37, 2 Timothy 2:3"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Genre/Style" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: content.metadata?.genre || "",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, genre: e.target.value }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                placeholder: "Worship, Anthem, Hymn, Teaching"
              }
            )
          ] })
        ] })
      ] }),
      content.content_type === "video" && /* @__PURE__ */ jsxs("div", { className: "bg-neutral-800/50 border border-neutral-700 rounded-lg p-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-amber-100 mb-4", children: "Video Information" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Platform *" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: content.metadata?.platform || "youtube",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, platform: e.target.value }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "youtube", children: "YouTube" }),
                  /* @__PURE__ */ jsx("option", { value: "tiktok", children: "TikTok" }),
                  /* @__PURE__ */ jsx("option", { value: "instagram", children: "Instagram" }),
                  /* @__PURE__ */ jsx("option", { value: "facebook", children: "Facebook" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Video ID *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: content.metadata?.videoId || "",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, videoId: e.target.value }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                placeholder: "Enter video ID from platform"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-500 mt-1", children: "YouTube: Extract from URL after v= | TikTok/Instagram: Post ID | Facebook: Video ID" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Series (comma-separated)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: Array.isArray(content.metadata?.series) ? content.metadata.series.join(", ") : content.metadata?.series || "",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, series: e.target.value.split(",").map((s) => s.trim()).filter((s) => s) }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                placeholder: "Spiritual Warfare Basics, Remnant Training"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Topics (comma-separated)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: Array.isArray(content.metadata?.topics) ? content.metadata.topics.join(", ") : content.metadata?.topics || "",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, topics: e.target.value.split(",").map((s) => s.trim()).filter((s) => s) }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                placeholder: "Spiritual Warfare, Deliverance, Repentance"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Scriptures (comma-separated)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: Array.isArray(content.metadata?.scriptures) ? content.metadata.scriptures.join(", ") : content.metadata?.scriptures || "",
                onChange: (e) => setContent({
                  ...content,
                  metadata: { ...content.metadata, scriptures: e.target.value.split(",").map((s) => s.trim()).filter((s) => s) }
                }),
                className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                placeholder: "Ephesians 6:12, James 4:7, 1 Peter 5:8"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Summary" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: content.summary,
            onChange: (e) => setContent({ ...content, summary: e.target.value }),
            className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
            rows: 3,
            placeholder: "Brief summary of the content"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Content (Markdown) *" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: content.body_md,
            onChange: (e) => setContent({ ...content, body_md: e.target.value }),
            className: "w-full h-96 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
            placeholder: "Write your content in Markdown..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "Tags" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: tags.map((tag) => /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: selectedTags.includes(tag.id),
              onChange: (e) => {
                if (e.target.checked) {
                  setSelectedTags([...selectedTags, tag.id]);
                } else {
                  setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                }
              },
              className: "w-4 h-4 text-amber-600 bg-neutral-800 border-neutral-700 rounded focus:ring-amber-500"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-amber-100 text-sm", children: tag.name })
        ] }, tag.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "SEO Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: content.seo_title,
              onChange: (e) => setContent({ ...content, seo_title: e.target.value }),
              className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
              placeholder: "SEO optimized title"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-amber-100 mb-2", children: "SEO Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: content.seo_description,
              onChange: (e) => setContent({ ...content, seo_description: e.target.value }),
              className: "w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
              rows: 2,
              placeholder: "SEO meta description"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-6 border-t border-neutral-800", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-neutral-400", children: [
          content.body_md.length,
          " characters"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleCancel,
              className: "px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-amber-100 rounded-lg transition-colors",
              disabled: saving,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleSave,
              disabled: saving || !content.title || !content.slug,
              className: "px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50",
              children: saving ? "Saving..." : contentId ? "Update Content" : "Create Content"
            }
          )
        ] })
      ] })
    ] })
  ] });
}

function StatCard({ icon, label, value, trend, color = "amber" }) {
  const colorClasses = {
    blue: "from-blue-900/30 to-blue-800/30 border-blue-700/50",
    green: "from-green-900/30 to-green-800/30 border-green-700/50",
    amber: "from-amber-900/30 to-amber-800/30 border-amber-700/50",
    purple: "from-purple-900/30 to-purple-800/30 border-purple-700/50",
    red: "from-red-900/30 to-red-800/30 border-red-700/50"
  };
  const iconColorClasses = {
    blue: "text-blue-400",
    green: "text-green-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
    red: "text-red-400"
  };
  return /* @__PURE__ */ jsxs("div", { className: `bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 hover:scale-105 transition-transform duration-200`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: `text-3xl ${iconColorClasses[color]}`, children: icon }),
      trend && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 text-sm font-medium ${trend.isPositive ? "text-green-400" : "text-red-400"}`, children: [
        /* @__PURE__ */ jsx("span", { children: trend.isPositive ? "↑" : "↓" }),
        /* @__PURE__ */ jsxs("span", { children: [
          Math.abs(trend.value),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-neutral-100 mb-1", children: value }),
    /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400 font-medium", children: label })
  ] });
}

function DashboardCharts({ contentGrowth, userGrowth, contentByType }) {
  const contentGrowthData = Object.entries(contentGrowth || {}).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    content: count
  }));
  const userGrowthData = Object.entries(userGrowth || {}).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    users: count
  }));
  const contentTypeData = [
    { name: "Blog Posts", value: contentByType.blog, color: "#F59E0B" },
    { name: "Videos", value: contentByType.videos, color: "#A855F7" },
    { name: "Books", value: contentByType.books, color: "#3B82F6" },
    { name: "Music", value: contentByType.music, color: "#10B981" }
  ];
  const COLORS = ["#F59E0B", "#A855F7", "#3B82F6", "#10B981"];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    contentGrowthData.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4", children: "Content Published (Last 30 Days)" }),
      /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: contentGrowthData, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#404040" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "date", stroke: "#a3a3a3" }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "#a3a3a3" }),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            contentStyle: {
              backgroundColor: "#171717",
              border: "1px solid #404040",
              borderRadius: "8px"
            },
            labelStyle: { color: "#fbbf24" }
          }
        ),
        /* @__PURE__ */ jsx(Legend, {}),
        /* @__PURE__ */ jsx(
          Line,
          {
            type: "monotone",
            dataKey: "content",
            stroke: "#F59E0B",
            strokeWidth: 2,
            name: "Content Published",
            dot: { fill: "#F59E0B" }
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4", children: "Content Distribution" }),
        /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: contentTypeData,
              cx: "50%",
              cy: "50%",
              labelLine: false,
              label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`,
              outerRadius: 80,
              fill: "#8884d8",
              dataKey: "value",
              children: contentTypeData.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              contentStyle: {
                backgroundColor: "#171717",
                border: "1px solid #404040",
                borderRadius: "8px"
              }
            }
          )
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4", children: "Content by Type" }),
        /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: contentTypeData, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#404040" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#a3a3a3" }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#a3a3a3" }),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              contentStyle: {
                backgroundColor: "#171717",
                border: "1px solid #404040",
                borderRadius: "8px"
              }
            }
          ),
          /* @__PURE__ */ jsx(Bar, { dataKey: "value", name: "Count", children: contentTypeData.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`)) })
        ] }) }) })
      ] })
    ] }),
    userGrowthData.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4", children: "User Growth (Last 30 Days)" }),
      /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: userGrowthData, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#404040" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "date", stroke: "#a3a3a3" }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "#a3a3a3" }),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            contentStyle: {
              backgroundColor: "#171717",
              border: "1px solid #404040",
              borderRadius: "8px"
            },
            labelStyle: { color: "#10B981" }
          }
        ),
        /* @__PURE__ */ jsx(Legend, {}),
        /* @__PURE__ */ jsx(
          Line,
          {
            type: "monotone",
            dataKey: "users",
            stroke: "#10B981",
            strokeWidth: 2,
            name: "New Users",
            dot: { fill: "#10B981" }
          }
        )
      ] }) }) })
    ] })
  ] });
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [contentGrowth, setContentGrowth] = useState({});
  const [userGrowth, setUserGrowth] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/dashboard/stats");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch dashboard stats");
      }
      setStats(data.stats);
      setContentGrowth(data.content_growth || {});
      setUserGrowth(data.user_growth || {});
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = /* @__PURE__ */ new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1e3 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };
  const getActivityIcon = (type) => {
    switch (type) {
      case "content_created":
        return "📝";
      case "content_published":
        return "✅";
      case "user_signup":
        return "👤";
      case "password_changed":
        return "🔒";
      case "preferences_updated":
        return "⚙️";
      case "admin_user_updated":
        return "👥";
      case "admin_bulk_action":
        return "⚡";
      default:
        return "📊";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "h-32 bg-neutral-800 rounded-xl" }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "h-64 bg-neutral-800 rounded-xl mb-8" }),
      /* @__PURE__ */ jsx("div", { className: "h-96 bg-neutral-800 rounded-xl" })
    ] }) });
  }
  if (error || !stats) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-400 text-lg mb-4", children: error || "Failed to load dashboard" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchDashboardStats,
          className: "bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors",
          children: "Retry"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-100 mb-6", children: "Overview" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: "📚",
            label: "Total Content",
            value: stats.total_content,
            color: "blue"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: "👥",
            label: "Total Users",
            value: stats.total_users,
            color: "green"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: "⚡",
            label: "Activity (30d)",
            value: stats.total_activity_30d,
            color: "purple"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: "✅",
            label: "System Status",
            value: "Healthy",
            color: "green"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-100 mb-6", children: "Content by Type" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: "📝",
            label: "Blog Posts",
            value: stats.content_by_type.blog,
            color: "amber"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: "🎥",
            label: "Videos",
            value: stats.content_by_type.videos,
            color: "purple"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: "📖",
            label: "Books",
            value: stats.content_by_type.books,
            color: "blue"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: "🎵",
            label: "Music",
            value: stats.content_by_type.music,
            color: "green"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-100 mb-6", children: "Analytics Charts" }),
      /* @__PURE__ */ jsx(
        DashboardCharts,
        {
          contentGrowth,
          userGrowth,
          contentByType: stats.content_by_type
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-100 mb-6", children: "Quick Actions" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.location.hash = "content",
            className: "flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-amber-700 rounded-xl transition-colors text-left",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "📝" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-neutral-200", children: "Create Blog Post" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Write new content" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.location.hash = "content",
            className: "flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-purple-700 rounded-xl transition-colors text-left",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "🎥" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-neutral-200", children: "Upload Video" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Add new video" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.location.hash = "content",
            className: "flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-blue-700 rounded-xl transition-colors text-left",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "📖" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-neutral-200", children: "Add Book" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Recommend a book" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.location.hash = "users",
            className: "flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-green-700 rounded-xl transition-colors text-left",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "👥" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-neutral-200", children: "Manage Users" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "User management" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.location.hash = "analytics",
            className: "flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-amber-700 rounded-xl transition-colors text-left",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "📊" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-neutral-200", children: "View Analytics" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Content insights" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.location.hash = "settings",
            className: "flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-red-700 rounded-xl transition-colors text-left",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "⚙️" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-neutral-200", children: "System Settings" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Configure site" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-100", children: "Recent Activity" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: fetchDashboardStats,
            className: "text-sm text-neutral-400 hover:text-neutral-200 transition-colors",
            children: "Refresh"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800", children: stats.recent_activity && stats.recent_activity.length > 0 ? stats.recent_activity.map((activity) => /* @__PURE__ */ jsx("div", { className: "p-4 hover:bg-neutral-800/50 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl", children: getActivityIcon(activity.activity_type) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-neutral-200 font-medium", children: activity.description }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-500 mt-1", children: formatTimestamp(activity.created_at) })
        ] })
      ] }) }, activity.id)) : /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-neutral-400", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "📊" }),
        /* @__PURE__ */ jsx("p", { children: "No recent activity" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-100 mb-6", children: "System Health" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neutral-400", children: "Database" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "●" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-neutral-100", children: "Online" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neutral-400", children: "Storage" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "●" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-neutral-100", children: "Available" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neutral-400", children: "API" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "●" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-neutral-100", children: "Normal" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neutral-400", children: "Errors (24h)" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "●" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-neutral-100", children: "0" })
        ] })
      ] })
    ] })
  ] });
}

function ContentAnalytics() {
  const [viewsByType, setViewsByType] = useState({});
  const [trending, setTrending] = useState([]);
  const [viewsOverTime, setViewsOverTime] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);
  useEffect(() => {
    fetchAnalytics();
  }, [days]);
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/analytics/overview?days=${days}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch analytics");
      }
      setViewsByType(data.views_by_type || {});
      setTrending(data.trending_content || []);
      setViewsOverTime(data.views_over_time || {});
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };
  const viewsByTypeData = Object.entries(viewsByType).map(([type, views]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    views
  }));
  const viewsTimeData = Object.entries(viewsOverTime).map(([date, views]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    views
  }));
  const getTypeIcon = (type) => {
    switch (type) {
      case "blog":
        return "📝";
      case "video":
        return "🎥";
      case "book":
        return "📖";
      case "music":
        return "🎵";
      default:
        return "📄";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-64 bg-neutral-800 rounded-xl" }),
      /* @__PURE__ */ jsx("div", { className: "h-96 bg-neutral-800 rounded-xl" })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-400 text-lg mb-4", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchAnalytics,
          className: "bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors",
          children: "Retry"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-100", children: "Content Analytics" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [7, 30, 90].map((d) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setDays(d),
          className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${days === d ? "bg-amber-700 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`,
          children: [
            d,
            " Days"
          ]
        },
        d
      )) })
    ] }),
    viewsByTypeData.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4", children: "Views by Content Type" }),
      /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: viewsByTypeData, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#404040" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#a3a3a3" }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "#a3a3a3" }),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            contentStyle: {
              backgroundColor: "#171717",
              border: "1px solid #404040",
              borderRadius: "8px"
            }
          }
        ),
        /* @__PURE__ */ jsx(Bar, { dataKey: "views", fill: "#F59E0B", name: "Total Views" })
      ] }) }) })
    ] }),
    viewsTimeData.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4", children: "Views Over Time" }),
      /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: viewsTimeData, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#404040" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "date", stroke: "#a3a3a3" }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "#a3a3a3" }),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            contentStyle: {
              backgroundColor: "#171717",
              border: "1px solid #404040",
              borderRadius: "8px"
            }
          }
        ),
        /* @__PURE__ */ jsx(Legend, {}),
        /* @__PURE__ */ jsx(
          Line,
          {
            type: "monotone",
            dataKey: "views",
            stroke: "#A855F7",
            strokeWidth: 2,
            name: "Views",
            dot: { fill: "#A855F7" }
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-amber-100 mb-4", children: "Trending Content (Last 7 Days)" }),
      /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800", children: trending && trending.length > 0 ? trending.map((item, index) => /* @__PURE__ */ jsx("div", { className: "p-4 hover:bg-neutral-800/50 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 text-3xl", children: getTypeIcon(item.content_type) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-amber-400", children: [
              "#",
              index + 1
            ] }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300", children: item.content_type })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-neutral-400 text-sm mt-1", children: [
            "ID: ",
            item.content_id
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-6 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-100", children: item.total_views }),
            /* @__PURE__ */ jsx("div", { className: "text-neutral-500 text-xs", children: "Views" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-400", children: item.total_visitors }),
            /* @__PURE__ */ jsx("div", { className: "text-neutral-500 text-xs", children: "Visitors" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-blue-400", children: [
              Math.round(item.avg_engagement),
              "s"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-neutral-500 text-xs", children: "Avg Time" })
          ] })
        ] })
      ] }) }, `${item.content_type}-${item.content_id}`)) : /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-neutral-400", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "📊" }),
        /* @__PURE__ */ jsx("p", { children: "No trending content yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: "Content views will appear here once tracked" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "📊" }),
          /* @__PURE__ */ jsx("div", { className: "text-amber-400 text-sm font-medium", children: "Total" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-neutral-100 mb-1", children: Object.values(viewsByType).reduce((sum, views) => sum + views, 0) }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Total Views" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "🔥" }),
          /* @__PURE__ */ jsx("div", { className: "text-red-400 text-sm font-medium", children: "Trending" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-neutral-100 mb-1", children: trending.length }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Trending Items" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl", children: "📈" }),
          /* @__PURE__ */ jsx("div", { className: "text-green-400 text-sm font-medium", children: "Average" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-neutral-100 mb-1", children: [
          trending.length > 0 ? Math.round(trending.reduce((sum, item) => sum + item.avg_engagement, 0) / trending.length) : 0,
          "s"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-400", children: "Engagement Time" })
      ] })
    ] })
  ] });
}

function SettingsPanel() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    fetchSettings();
  }, []);
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch settings");
      }
      setSettings(data.settings || {});
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async (key, value, category) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, category })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save setting");
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3e3);
      fetchSettings();
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Failed to save setting");
    } finally {
      setSaving(false);
    }
  };
  const categories = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "email", name: "Email", icon: "📧" },
    { id: "features", name: "Features", icon: "🔧" },
    { id: "seo", name: "SEO", icon: "🔍" },
    { id: "content", name: "Content", icon: "📝" }
  ];
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-12 bg-neutral-800 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-96 bg-neutral-800 rounded" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-100", children: "System Settings" }),
      success && /* @__PURE__ */ jsx("div", { className: "text-green-400 font-medium", children: "✓ Settings saved successfully" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 border-b border-neutral-800", children: categories.map((cat) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveCategory(cat.id),
        className: `flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${activeCategory === cat.id ? "border-amber-500 text-amber-100" : "border-transparent text-neutral-400 hover:text-neutral-200"}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-xl", children: cat.icon }),
          /* @__PURE__ */ jsx("span", { children: cat.name })
        ]
      },
      cat.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-xl p-6", children: [
      activeCategory === "general" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-neutral-400 mb-2", children: "Site Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              defaultValue: settings.site_name?.value || "Real & Raw Gospel",
              onBlur: (e) => handleSave("site_name", e.target.value, "general"),
              className: "w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-neutral-400 mb-2", children: "Tagline" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              defaultValue: settings.site_tagline?.value || "Training the Remnant",
              onBlur: (e) => handleSave("site_tagline", e.target.value, "general"),
              className: "w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-neutral-400 mb-2", children: "Contact Email" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              defaultValue: settings.contact_email?.value || "",
              onBlur: (e) => handleSave("contact_email", e.target.value, "general"),
              className: "w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
            }
          )
        ] })
      ] }),
      activeCategory === "features" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-neutral-800 rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-neutral-200", children: "Enable Comments" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-500", children: "Allow comments on blog posts" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleSave("enable_comments", !settings.enable_comments?.value, "features"),
              className: `px-4 py-2 rounded-lg font-medium ${settings.enable_comments?.value ? "bg-green-700 text-green-100" : "bg-neutral-700 text-neutral-400"}`,
              disabled: saving,
              children: settings.enable_comments?.value ? "Enabled" : "Disabled"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-neutral-800 rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-neutral-200", children: "User Registration" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-500", children: "Allow new users to register" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleSave("enable_registration", !settings.enable_registration?.value, "features"),
              className: `px-4 py-2 rounded-lg font-medium ${settings.enable_registration?.value ? "bg-green-700 text-green-100" : "bg-neutral-700 text-neutral-400"}`,
              disabled: saving,
              children: settings.enable_registration?.value ? "Enabled" : "Disabled"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-neutral-800 rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-neutral-200", children: "Maintenance Mode" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-500", children: "Show maintenance page to visitors" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleSave("maintenance_mode", !settings.maintenance_mode?.value, "features"),
              className: `px-4 py-2 rounded-lg font-medium ${settings.maintenance_mode?.value ? "bg-red-700 text-red-100" : "bg-neutral-700 text-neutral-400"}`,
              disabled: saving,
              children: settings.maintenance_mode?.value ? "On" : "Off"
            }
          )
        ] })
      ] }),
      activeCategory === "seo" && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-neutral-400 mb-2", children: "Default Meta Description" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            defaultValue: settings.default_meta_description?.value || "",
            onBlur: (e) => handleSave("default_meta_description", e.target.value, "seo"),
            className: "w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200",
            rows: 3
          }
        )
      ] }) }),
      activeCategory === "content" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-neutral-800 rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-neutral-200", children: "Content Approval Required" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-500", children: "Require admin approval before publishing" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleSave("content_approval_required", !settings.content_approval_required?.value, "content"),
              className: `px-4 py-2 rounded-lg font-medium ${settings.content_approval_required?.value ? "bg-amber-700 text-amber-100" : "bg-neutral-700 text-neutral-400"}`,
              disabled: saving,
              children: settings.content_approval_required?.value ? "Required" : "Not Required"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-neutral-400 mb-2", children: "Auto-save Interval (seconds)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              defaultValue: settings.autosave_interval?.value || 30,
              onBlur: (e) => handleSave("autosave_interval", parseInt(e.target.value), "content"),
              className: "w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200"
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400", children: error }),
      saving && /* @__PURE__ */ jsx("div", { className: "mt-4 text-center text-amber-400", children: "Saving..." })
    ] })
  ] });
}

function AdminShell({ userRole, userName, userEmail }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (!isHydrated) return;
    const hash = window.location.hash.replace("#", "");
    if (hash && ["dashboard", "content", "analytics", "media", "users", "settings"].includes(hash)) {
      setActiveTab(hash);
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("edit");
    if (editId) {
      setActiveTab("content");
      sessionStorage.setItem("editContentId", editId);
      window.history.replaceState({}, "", "/admin");
    }
  }, [isHydrated]);
  useEffect(() => {
    const handleIframeLoad = () => setIsLoading(false);
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.addEventListener("load", handleIframeLoad);
    });
    return () => {
      iframes.forEach((iframe) => {
        iframe.removeEventListener("load", handleIframeLoad);
      });
    };
  }, [activeTab]);
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊", description: "Overview and analytics" },
    { id: "content", label: "Content", icon: "📝", description: "Create and manage content" },
    { id: "analytics", label: "Analytics", icon: "📈", description: "Performance and insights" },
    { id: "media", label: "Media", icon: "📁", description: "Upload and manage files" },
    { id: "users", label: "Users", icon: "👥", description: "Manage team access" },
    { id: "settings", label: "Settings", icon: "⚙️", description: "System configuration" }
  ];
  if (!isHydrated) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-amber-700/30 border-t-amber-500" }),
      /* @__PURE__ */ jsx("div", { className: "text-amber-100 font-medium text-lg", children: "Loading Admin Center..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900", style: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    color: "#ffffff"
  }, children: [
    /* @__PURE__ */ jsx("header", { className: "bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 shadow-sm sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 sm:px-8 lg:px-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-amber-700/30", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xl tracking-tight", style: { fontFamily: "Cinzel, ui-serif, Georgia, serif" }, children: "RRG" }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-neutral-900" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-amber-100 tracking-tight", style: { fontFamily: "Cinzel, ui-serif, Georgia, serif" }, children: "Admin Center" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-400 font-medium", children: "Content Management System" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full flex items-center justify-center ring-2 ring-neutral-600", children: /* @__PURE__ */ jsx("span", { className: "text-amber-100 font-semibold text-sm", children: (userName || userEmail)?.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-amber-100", children: userName || userEmail }),
            userRole && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-700/20 text-amber-200 ring-1 ring-amber-700/50", children: userRole })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/",
            className: "inline-flex items-center px-4 py-2.5 text-sm font-semibold text-neutral-400 hover:text-amber-100 hover:bg-neutral-800 rounded-xl transition-all duration-200 group",
            target: "_blank",
            rel: "noopener noreferrer",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 mr-2 group-hover:scale-110 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }),
              "View Site"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/auth",
            className: "inline-flex items-center px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-100 rounded-xl text-sm font-semibold transition-all duration-200 group border border-neutral-700 hover:border-amber-700",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 mr-2 group-hover:scale-110 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }),
              "Sign Out"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("nav", { className: "bg-neutral-900/70 backdrop-blur-sm border-b border-neutral-800", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 sm:px-8 lg:px-10", children: /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          setActiveTab(tab.id);
          setIsLoading(true);
        },
        className: `group flex items-center space-x-3 py-5 px-8 rounded-t-2xl font-semibold text-sm transition-all duration-300 ${activeTab === tab.id ? "bg-neutral-800 text-amber-200 shadow-lg border-t-4 border-amber-700 transform -translate-y-1" : "text-neutral-400 hover:text-amber-100 hover:bg-neutral-800/50 hover:shadow-md hover:transform hover:-translate-y-0.5"}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: `text-2xl transition-all duration-300 ${activeTab === tab.id ? "scale-110 drop-shadow-sm" : "group-hover:scale-105 group-hover:drop-shadow-sm"}`, children: tab.icon }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-base", children: tab.label }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-neutral-500 hidden sm:block font-medium", children: tab.description })
          ] }),
          activeTab === tab.id && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-amber-700 rounded-full animate-pulse" })
        ]
      },
      tab.id
    )) }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 bg-neutral-950", children: [
      isLoading && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500" }),
        /* @__PURE__ */ jsx("div", { className: "text-amber-100 font-medium", children: "Loading..." })
      ] }) }),
      activeTab === "dashboard" && /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12", children: /* @__PURE__ */ jsx(Dashboard, {}) }),
      activeTab === "content" && /* @__PURE__ */ jsx(ContentTab, {}),
      activeTab === "analytics" && /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12", children: /* @__PURE__ */ jsx(ContentAnalytics, {}) }),
      activeTab === "media" && /* @__PURE__ */ jsx(MediaTab, {}),
      activeTab === "users" && /* @__PURE__ */ jsx(UsersTab, {}),
      activeTab === "settings" && /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12", children: /* @__PURE__ */ jsx(SettingsPanel, {}) })
    ] })
  ] });
}
function ContentTab() {
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  useEffect(() => {
    loadContent();
    const editId = sessionStorage.getItem("editContentId");
    if (editId) {
      setSelectedContent(editId);
      sessionStorage.removeItem("editContentId");
    }
  }, []);
  const loadContent = async () => {
    try {
      setLoading(true);
      console.log("Loading content from /api/cms/content...");
      const response = await fetch("/api/cms/content");
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Content data:", data);
      if (response.ok) {
        setContentList(data.content || []);
        console.log("Content loaded successfully:", data.content?.length || 0, "items");
      } else {
        console.error("API Error:", data);
        setContentList([]);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      setContentList([]);
    } finally {
      setLoading(false);
    }
  };
  const handleEditContent = (contentId) => {
    setSelectedContent(contentId);
    setShowCreateForm(false);
  };
  const handleCreateContent = () => {
    setShowCreateForm(true);
    setSelectedContent(null);
  };
  const handleSaveContent = () => {
    setSelectedContent(null);
    setShowCreateForm(false);
    loadContent();
  };
  const handleCancelEdit = () => {
    setSelectedContent(null);
    setShowCreateForm(false);
  };
  if (selectedContent || showCreateForm) {
    return /* @__PURE__ */ jsx("div", { className: "p-8 max-w-7xl mx-auto", children: /* @__PURE__ */ jsx(
      SupabaseContentEditor,
      {
        contentId: selectedContent || void 0,
        onSave: handleSaveContent,
        onCancel: handleCancelEdit
      }
    ) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-amber-100 mb-3", children: "Content Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-lg", children: "Manage your content with the Supabase CMS." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCreateContent,
          className: "px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium",
          children: "+ Create New Content"
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500" }),
      /* @__PURE__ */ jsx("div", { className: "text-amber-100 font-medium", children: "Loading content..." })
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-8 py-6 border-b border-neutral-800 bg-neutral-800/50", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-amber-100", children: [
          "Your Content (",
          contentList.length,
          " items)"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-sm mt-1", children: "Click on any content to edit it" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: contentList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx("p", { className: "text-neutral-400 mb-4", children: "No content found" }),
        /* @__PURE__ */ jsx("p", { className: "text-neutral-500 text-sm", children: "Check the browser console for any API errors" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: contentList.map((item) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-amber-500/50 transition-colors cursor-pointer",
          onClick: () => handleEditContent(item.id),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-amber-100 font-medium", children: item.title }),
                /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${item.status === "published" ? "bg-green-900/30 text-green-300 border border-green-700/50" : item.status === "draft" ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700/50" : "bg-gray-900/30 text-gray-300 border border-gray-700/50"}`, children: item.status }),
                item.featured && /* @__PURE__ */ jsx("span", { className: "px-2 py-1 rounded-full text-xs font-medium bg-amber-900/30 text-amber-300 border border-amber-700/50", children: "Featured" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-sm capitalize mb-1", children: item.content_type }),
              item.summary && /* @__PURE__ */ jsx("p", { className: "text-neutral-500 text-sm line-clamp-2", children: item.summary }),
              item.tags && item.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [
                item.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded", children: tag.name }, tag.id)),
                item.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded", children: [
                  "+",
                  item.tags.length - 3,
                  " more"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-neutral-400 text-sm ml-4", children: new Date(item.updated_at).toLocaleDateString() })
          ] })
        },
        item.id
      )) }) })
    ] })
  ] });
}
function MediaTab() {
  return /* @__PURE__ */ jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-amber-100 mb-3", children: "Media Library" }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-lg", children: "Upload and manage your media files. Click to copy URLs for use in content." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden", children: /* @__PURE__ */ jsx(MediaPicker, {}) })
  ] });
}
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/cms/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        } else {
          console.error("Failed to fetch users:", response.statusText);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);
  const promoteUser = async (userId, newRole) => {
    try {
      const response = await fetch("/api/cms/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          role: newRole
        })
      });
      if (response.ok) {
        setUsers((prev) => prev.map(
          (user) => user.id === userId ? { ...user, role: newRole } : user
        ));
        console.log(`User ${userId} promoted to ${newRole}`);
      } else {
        console.error("Failed to promote user:", response.statusText);
        alert("Failed to update user role. Please try again.");
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      alert("Error updating user role. Please try again.");
    }
  };
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-900/30 text-red-300 border border-red-700/50";
      case "editor":
        return "bg-blue-900/30 text-blue-300 border border-blue-700/50";
      case "viewer":
        return "bg-neutral-800 text-neutral-300 border border-neutral-700";
      default:
        return "bg-neutral-800 text-neutral-300 border border-neutral-700";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-amber-100 mb-3", children: "User Management" }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-lg", children: "Manage team access and permissions for your content management system." })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-500" }),
      /* @__PURE__ */ jsx("div", { className: "text-amber-100 font-medium", children: "Loading users..." })
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-8 py-6 border-b border-neutral-800 bg-neutral-800/50", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-amber-100", children: "Team Members" }),
        /* @__PURE__ */ jsx("p", { className: "text-neutral-400 text-sm mt-1", children: "Manage roles and permissions for your team" })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "divide-y divide-neutral-800", children: users.map((user) => /* @__PURE__ */ jsx("li", { className: "px-8 py-6 hover:bg-neutral-800/50 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-full flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx("span", { className: "text-amber-100 font-semibold text-lg", children: user.email.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-amber-100", children: user.email }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-neutral-400", children: [
              "Last active ",
              user.lastActive
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`, children: user.role }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: user.role,
              onChange: (e) => promoteUser(user.id, e.target.value),
              className: "text-sm border-neutral-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-neutral-800 text-amber-100 px-3 py-2 shadow-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "viewer", children: "Viewer" }),
                /* @__PURE__ */ jsx("option", { value: "editor", children: "Editor" }),
                /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" })
              ]
            }
          )
        ] })
      ] }) }, user.id)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 p-6 bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-700/30 rounded-2xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-amber-700 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-white", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-amber-100", children: "Need to add more users?" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-amber-200", children: /* @__PURE__ */ jsxs("p", { children: [
          "Use the ",
          /* @__PURE__ */ jsx("a", { href: "/admin-promote", className: "font-semibold underline hover:text-amber-300 transition-colors", children: "User Promotion Tool" }),
          " to invite new team members or promote existing users."
        ] }) })
      ] })
    ] }) })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  let user = null;
  let userRole = null;
  let isAdmin = false;
  let isEditor = false;
  try {
    const supabase = supabaseServer(Astro2.cookies);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      user = authUser;
      try {
        const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        if (profile && !profileError) {
          userRole = profile.role;
          isAdmin = userRole === "admin";
          isEditor = userRole === "editor" || isAdmin;
        } else {
          const { data: userRoles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
          if (userRoles && userRoles.length > 0 && !rolesError) {
            userRole = userRoles[0].role;
            isAdmin = userRole === "admin";
            isEditor = userRole === "editor" || isAdmin;
          } else {
            userRole = "user";
            isAdmin = false;
            isEditor = false;
          }
        }
      } catch (profileQueryError) {
        userRole = "user";
        isAdmin = false;
        isEditor = false;
      }
    }
  } catch (error) {
  }
  if (!user) {
    return Astro2.redirect("/auth?redirect=" + encodeURIComponent(Astro2.url.pathname));
  }
  if (!isEditor) {
    return Astro2.redirect("/auth?error=insufficient-permissions&redirect=" + encodeURIComponent(Astro2.url.pathname));
  }
  return renderTemplate`<html lang="en" data-astro-cid-2zp6q64z> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Center | Real & Raw Gospel</title><link rel="icon" href="/rrg-logo.jpg" type="image/jpeg"><link rel="stylesheet" href="/src/styles/global.css">${renderScript($$result, "/Users/asjames18/Development/RRG Website/src/pages/admin.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "/Users/asjames18/Development/RRG Website/src/pages/admin.astro?astro&type=script&index=1&lang.ts")}${renderHead()}</head> <body class="bg-neutral-950 text-amber-100" data-astro-cid-2zp6q64z> <div id="admin-root" data-astro-cid-2zp6q64z> ${renderComponent($$result, "AdminShell", AdminShell, { "userRole": userRole, "userName": user?.user_metadata?.full_name || user?.email, "userEmail": user?.email, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/admin/AdminShell", "client:component-export": "default", "data-astro-cid-2zp6q64z": true })} </div> </body></html>`;
}, "/Users/asjames18/Development/RRG Website/src/pages/admin.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
