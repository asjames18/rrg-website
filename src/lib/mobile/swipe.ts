// Swipe Gesture Detection for Mobile PWA

export interface SwipeOptions {
  threshold?: number; // Minimum distance for swipe (default: 50px)
  velocity?: number; // Minimum velocity for swipe (default: 0.3)
  restraint?: number; // Maximum perpendicular distance (default: 100px)
  allowedTime?: number; // Maximum time for swipe (default: 500ms)
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | 'none';

export interface SwipeEvent {
  direction: SwipeDirection;
  distance: number;
  velocity: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type SwipeCallback = (event: SwipeEvent) => void;

const defaultOptions: Required<SwipeOptions> = {
  threshold: 50,
  velocity: 0.3,
  restraint: 100,
  allowedTime: 500
};

export class SwipeDetector {
  private element: HTMLElement;
  private options: Required<SwipeOptions>;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;
  private touchStartTime: number = 0;
  private onSwipe: SwipeCallback | null = null;

  constructor(element: HTMLElement, options: SwipeOptions = {}) {
    this.element = element;
    this.options = { ...defaultOptions, ...options };
    this.init();
  }

  private init() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  private handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
  }

  private handleTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  }

  private handleTouchEnd(e: TouchEvent) {
    const distX = this.touchEndX - this.touchStartX;
    const distY = this.touchEndY - this.touchStartY;
    const elapsedTime = Date.now() - this.touchStartTime;
    
    // Calculate absolute distances
    const absDistX = Math.abs(distX);
    const absDistY = Math.abs(distY);
    
    // Calculate velocity
    const velocity = Math.sqrt(distX * distX + distY * distY) / elapsedTime;

    // Determine direction
    let direction: SwipeDirection = 'none';
    
    if (elapsedTime <= this.options.allowedTime) {
      if (absDistX >= this.options.threshold && absDistY <= this.options.restraint) {
        // Horizontal swipe
        direction = distX < 0 ? 'left' : 'right';
      } else if (absDistY >= this.options.threshold && absDistX <= this.options.restraint) {
        // Vertical swipe
        direction = distY < 0 ? 'up' : 'down';
      }
    }

    // Only trigger if we have a valid direction and sufficient velocity
    if (direction !== 'none' && velocity >= this.options.velocity) {
      const swipeEvent: SwipeEvent = {
        direction,
        distance: direction === 'left' || direction === 'right' ? absDistX : absDistY,
        velocity,
        duration: elapsedTime,
        startX: this.touchStartX,
        startY: this.touchStartY,
        endX: this.touchEndX,
        endY: this.touchEndY
      };

      if (this.onSwipe) {
        this.onSwipe(swipeEvent);
      }

      // Dispatch custom event
      this.element.dispatchEvent(new CustomEvent('swipe', { 
        detail: swipeEvent,
        bubbles: true,
        cancelable: true
      }));
    }

    // Reset
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
  }

  public setCallback(callback: SwipeCallback) {
    this.onSwipe = callback;
  }

  public destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.onSwipe = null;
  }
}

// Utility function for easy setup
export function enableSwipe(
  element: HTMLElement | string,
  callback: SwipeCallback,
  options?: SwipeOptions
): SwipeDetector {
  const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
  
  if (!el) {
    throw new Error('Element not found');
  }

  const detector = new SwipeDetector(el, options);
  detector.setCallback(callback);
  return detector;
}

// React Hook for Swipe Detection
export function useSwipe(
  ref: React.RefObject<HTMLElement>,
  callback: SwipeCallback,
  options?: SwipeOptions
) {
  if (typeof window === 'undefined') return;

  const detector = ref.current ? new SwipeDetector(ref.current, options) : null;
  if (detector) {
    detector.setCallback(callback);
  }

  return () => {
    detector?.destroy();
  };
}

// Helper: Detect swipe-to-navigate
export function enableSwipeNavigation(
  element: HTMLElement,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
) {
  return enableSwipe(element, (event) => {
    if (event.direction === 'left' && onSwipeLeft) {
      onSwipeLeft();
    } else if (event.direction === 'right' && onSwipeRight) {
      onSwipeRight();
    }
  });
}

// Helper: Enable swipe-to-dismiss
export function enableSwipeToDismiss(
  element: HTMLElement,
  onDismiss: () => void,
  direction: 'left' | 'right' | 'up' | 'down' = 'down'
) {
  return enableSwipe(element, (event) => {
    if (event.direction === direction) {
      onDismiss();
    }
  }, { threshold: 80 });
}

