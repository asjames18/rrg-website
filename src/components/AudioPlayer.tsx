import { useState, useRef, useEffect } from 'react';

interface Track {
  title: string;
  src: string;
}

interface AudioPlayerProps {
  tracks: Track[];
  className?: string;
}

/**
 * Audio player component with track navigation.
 * Supports keyboard controls and multiple tracks.
 * 
 * TODO: Add playback speed control (0.5x, 1x, 1.25x, 1.5x, 2x)
 * TODO: Add shuffle and repeat modes
 * TODO: Add volume control with persistence
 * TODO: Add download track option
 */
export default function AudioPlayer({ tracks, className = '' }: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Auto-play next track if available
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, tracks.length]);

  // Update audio source when track changes
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
      setCurrentTrackIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  };

  if (tracks.length === 0) {
    return (
      <div className={`bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center ${className}`}>
        <p className="text-neutral-500">No tracks available</p>
      </div>
    );
  }

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-lg p-6 ${className}`}>
      {/* Current Track Info */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-amber-100 mb-1">
          {currentTrack.title}
        </h3>
        <p className="text-sm text-neutral-500">
          Track {currentTrackIndex + 1} of {tracks.length}
        </p>
      </div>

      {/* Native Audio Player */}
      <audio
        ref={audioRef}
        controls
        className="w-full mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
        preload="metadata"
      >
        <source src={currentTrack.src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Track Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={goToPrevious}
          disabled={currentTrackIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed text-neutral-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          aria-label="Previous track"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
          <span className="text-sm font-medium">Previous</span>
        </button>

        <button
          onClick={goToNext}
          disabled={currentTrackIndex === tracks.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed text-neutral-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          aria-label="Next track"
        >
          <span className="text-sm font-medium">Next</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 18h2V6h-2zm-11.5-6L13 6v12z"/>
          </svg>
        </button>
      </div>

      {/* Track List */}
      {tracks.length > 1 && (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <h4 className="text-sm font-semibold text-neutral-400 mb-3">Playlist</h4>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <button
                key={index}
                onClick={() => setCurrentTrackIndex(index)}
                className={`w-full text-left px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                  index === currentTrackIndex
                    ? 'bg-amber-900/30 text-amber-100 border border-amber-700'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-transparent'
                }`}
              >
                <span className="text-sm font-medium">{track.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
