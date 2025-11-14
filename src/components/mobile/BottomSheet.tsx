import { useEffect, useRef, ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  snapPoints?: number[]; // Array of snap heights in pixels
  defaultSnap?: number; // Index of default snap point
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [300, 600],
  defaultSnap = 0
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only start drag from handle
      const target = e.target as HTMLElement;
      if (target.closest('.bottom-sheet-handle')) {
        startY.current = e.touches[0].clientY;
        isDragging.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      // Only allow dragging down
      if (diff > 0) {
        sheet.style.transform = `translateY(${diff}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;

      const diff = currentY.current - startY.current;

      // Close if dragged down more than 100px
      if (diff > 100) {
        onClose();
      }

      // Reset
      sheet.style.transform = '';
      isDragging.current = false;
      startY.current = 0;
      currentY.current = 0;
    };

    sheet.addEventListener('touchstart', handleTouchStart);
    sheet.addEventListener('touchmove', handleTouchMove);
    sheet.addEventListener('touchend', handleTouchEnd);

    return () => {
      sheet.removeEventListener('touchstart', handleTouchStart);
      sheet.removeEventListener('touchmove', handleTouchMove);
      sheet.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed left-0 right-0 bottom-0 z-50 md:hidden
          bg-neutral-900 border-t border-neutral-800
          rounded-t-3xl shadow-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          maxHeight: '90vh'
        }}
      >
        {/* Handle */}
        <div className="bottom-sheet-handle flex justify-center py-3 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-neutral-700 rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-6 pb-4">
            <h2 className="text-xl font-bold text-amber-100">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
          {children}
        </div>
      </div>
    </>
  );
}

