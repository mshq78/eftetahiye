import React, { useEffect, useRef, useState } from 'react';

interface DeckFrameProps {
  children: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
  isEditorOpen: boolean;
}

export const DeckFrame: React.FC<DeckFrameProps> = ({
  children,
  onNext,
  onPrev,
  isEditorOpen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const touchStartXRef = useRef<number | null>(null);

  // Re-calculate 16:9 scale factor whenever window or editor drawer changes
  useEffect(() => {
    const handleResize = () => {
      // In desktop when editor is open, consider available width
      const availWidth = window.innerWidth;
      const availHeight = window.innerHeight;

      // 1920 x 1080 canvas
      const scaleX = availWidth / 1920;
      const scaleY = availHeight / 1080;
      const targetScale = Math.min(scaleX, scaleY);
      setScale(Math.max(targetScale, 0.15));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isEditorOpen]);

  // Handle Touch Swipes (RTL aware: swipe left = next, swipe right = prev)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;

    // Minimum swipe threshold 50px
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        // Swiped left in RTL = go to next slide
        onNext();
      } else {
        // Swiped right in RTL = go to previous slide
        onPrev();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-neutral-950 no-print"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 16:9 Canvas Wrapper */}
      <div
        className="w-[1920px] h-[1080px] shrink-0 shadow-2xl relative transition-transform duration-200 origin-center"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>

      {/* Invisible Click Zones for quick navigation on mouse hover (Right = Previous in RTL, Left = Next) */}
      <button
        type="button"
        aria-label="اسلاید قبلی"
        onClick={onPrev}
        className="absolute top-0 bottom-0 right-0 w-[5%] z-20 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-l from-black/20 to-transparent flex items-center justify-start pr-4 text-white/50 hover:text-white group focus:outline-none"
      >
        <span className="sr-only">اسلاید قبلی</span>
      </button>

      <button
        type="button"
        aria-label="اسلاید بعدی"
        onClick={onNext}
        className="absolute top-0 bottom-0 left-0 w-[5%] z-20 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-black/20 to-transparent flex items-center justify-end pl-4 text-white/50 hover:text-white group focus:outline-none"
      >
        <span className="sr-only">اسلاید بعدی</span>
      </button>
    </div>
  );
};
