import { useState, useEffect, useRef, ReactNode } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export default function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull-to-refresh if scrolled to top
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        setCanPull(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      // Only track downward pulls
      if (diff > 0 && container.scrollTop === 0) {
        const distance = Math.min(diff / resistance, threshold * 1.5);
        setPullDistance(distance);

        // Prevent default scrolling when pulling
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!canPull || isRefreshing) return;

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        setPullDistance(threshold);

        try {
          await onRefresh();
        } catch (error) {
          console.error('[PTR] Refresh error:', error);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }

      setCanPull(false);
      startY.current = 0;
      currentY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, canPull, isRefreshing, pullDistance, threshold, resistance, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);
  const spinnerRotation = progress * 360;
  const showSpinner = pullDistance > 20;

  return (
    <div 
      ref={containerRef}
      className="pull-to-refresh-container relative h-full overflow-y-auto"
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: canPull ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Pull-to-Refresh Indicator */}
      {showSpinner && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center"
          style={{
            height: `${pullDistance}px`,
            marginTop: `-${pullDistance}px`
          }}
        >
          <div className="flex flex-col items-center gap-2">
            {/* Spinner */}
            <div 
              className="relative"
              style={{
                transform: `rotate(${spinnerRotation}deg)`,
                transition: isRefreshing ? 'none' : 'transform 0.1s linear'
              }}
            >
              {isRefreshing ? (
                <svg 
                  className="animate-spin h-8 w-8 text-amber-500" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg 
                  className="h-8 w-8 text-amber-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{
                    opacity: progress
                  }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              )}
            </div>

            {/* Status Text */}
            <div className="text-xs font-medium text-amber-500">
              {isRefreshing ? (
                'Refreshing...'
              ) : pullDistance >= threshold ? (
                'Release to refresh'
              ) : (
                'Pull to refresh'
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pull-to-refresh-content">
        {children}
      </div>
    </div>
  );
}

