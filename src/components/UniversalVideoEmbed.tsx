interface UniversalVideoEmbedProps {
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook';
  videoId: string;
  title?: string;
  className?: string;
}

/**
 * Universal video embed component supporting YouTube, TikTok, Instagram, and Facebook.
 * All embeds lazy-load and maintain proper aspect ratios to prevent CLS.
 */
export default function UniversalVideoEmbed({ 
  platform, 
  videoId, 
  title = 'Video Player',
  className = '' 
}: UniversalVideoEmbedProps) {
  
  const getEmbedUrl = (): string => {
    switch (platform) {
      case 'youtube':
        // Use youtube-nocookie for privacy
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      
      case 'tiktok':
        return `https://www.tiktok.com/embed/v2/${videoId}`;
      
      case 'instagram':
        return `https://www.instagram.com/p/${videoId}/embed`;
      
      case 'facebook':
        // Facebook requires encoded URL
        const encodedUrl = encodeURIComponent(`https://www.facebook.com/watch/?v=${videoId}`);
        return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false`;
      
      default:
        return '';
    }
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className={`bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center ${className}`}>
        <p className="text-neutral-500">Unsupported platform</p>
      </div>
    );
  }

  // Different aspect ratios for different platforms
  // TikTok and Instagram Reels are typically 9:16 (vertical)
  // YouTube and Facebook are typically 16:9 (horizontal)
  const isVertical = platform === 'tiktok' || platform === 'instagram';
  const aspectRatio = isVertical ? 'pb-[177.78%]' : 'pb-[56.25%]';
  const maxHeight = isVertical ? 'max-h-[600px]' : '';

  return (
    <div className={`relative ${aspectRatio} ${maxHeight} h-0 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800 ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="absolute top-0 left-0 w-full h-full border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        tabIndex={0}
      />
    </div>
  );
}
