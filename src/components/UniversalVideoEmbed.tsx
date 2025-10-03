import React from 'react';

interface UniversalVideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

/**
 * Universal video embed component that supports YouTube, Vimeo, and direct video URLs.
 * Maintains 16:9 aspect ratio by default.
 */
export default function UniversalVideoEmbed({ url, title = 'Video Player', className = '' }: UniversalVideoEmbedProps) {
  const getEmbedUrl = (videoUrl: string): string | null => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = videoUrl.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
    const vimeoMatch = videoUrl.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct video URL (mp4, webm, ogg)
    if (/\.(mp4|webm|ogg)$/i.test(videoUrl)) {
      return videoUrl;
    }

    return null;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className={`bg-neutral-100 dark:bg-neutral-800 rounded-lg p-8 text-center ${className}`}>
        <p className="text-neutral-600 dark:text-neutral-400">Invalid video URL</p>
      </div>
    );
  }

  // Direct video file
  if (/\.(mp4|webm|ogg)$/i.test(embedUrl)) {
    return (
      <div className={`relative pb-[56.25%] h-0 overflow-hidden rounded-lg ${className}`}>
        <video
          className="absolute top-0 left-0 w-full h-full"
          controls
          aria-label={title}
        >
          <source src={embedUrl} type={`video/${embedUrl.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Embedded iframe (YouTube, Vimeo)
  return (
    <div className={`relative pb-[56.25%] h-0 overflow-hidden rounded-lg ${className}`}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

