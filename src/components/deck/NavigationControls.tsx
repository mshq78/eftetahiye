import React, { useState, useEffect, useRef } from 'react';
import { toPersianDigits } from '../../utils/helpers';
import {
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Grid,
  Settings,
  Printer,
  HelpCircle,
  X,
  EyeOff,
} from 'lucide-react';

interface NavigationControlsProps {
  currentIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onToggleOverview: () => void;
  onToggleEditor: () => void;
  isEditorOpen: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentIndex,
  totalSlides,
  onNext,
  onPrev,
  onToggleOverview,
  onToggleEditor,
  isEditorOpen,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls after 2.2 seconds of no mouse movement
  const scheduleHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    if (!showHelp && !isEditorOpen) {
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2200);
    }
  };

  useEffect(() => {
    // Show briefly on initial mount for 1.8 seconds so user discovers it, then hide
    setIsVisible(true);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    let lastMouseX = -1;
    let lastMouseY = -1;

    const handleMouseMove = (e: MouseEvent) => {
      if (lastMouseX === -1 && lastMouseY === -1) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        return;
      }
      const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
      // Only unhide if user actually moves the mouse cursor significantly (> 6px)
      if (dist > 6) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        setIsVisible(true);
        scheduleHide();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle visibility strictly with 'h' or 'H', do NOT unhide on other keys (like arrow keys/space)!
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape') setShowHelp(false);
      if (e.key === 'h' || e.key === 'H' || e.code === 'KeyH') {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return;
        }
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [showHelp, isEditorOpen]);

  // Handlers for Next / Prev that keep toolbar hidden until mouse is moved
  const handleNextClick = () => {
    setIsVisible(false);
    onNext();
  };

  const handlePrevClick = () => {
    setIsVisible(false);
    onPrev();
  };

  // Calculate percentage for thin progress bar
  const progressPercent = ((currentIndex + 1) / totalSlides) * 100;

  // Determine if the toolbar should be displayed
  const shouldShow = isVisible && !isEditorOpen;

  return (
    <>
      {/* Thin Top Progress Bar (auto-fades when controls are hidden) */}
      <div
        className={`fixed top-0 right-0 left-0 h-1.5 bg-neutral-900/60 z-40 no-print transition-opacity duration-500 ${
          shouldShow ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="h-full bg-gradient-to-l from-[var(--primary-brand)] to-[var(--primary-mint)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Floating Bottom Control Bar (Hidden during presentation until mouse moves) */}
      <nav
        aria-label="کنترل‌های ناوبری ارائه"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 no-print transition-all duration-500 ease-out transform ${
          shouldShow
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xl text-neutral-200 transition-all duration-300">
          {/* Previous Slide Button (Right Arrow in RTL) */}
          <button
            type="button"
            onClick={handlePrevClick}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="اسلاید قبلی (کلید راست / PageUp)"
            aria-label="اسلاید قبلی"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator in Persian - matching page footer font */}
          <div className="px-3 py-1 text-sm font-bold tracking-wider text-emerald-400 select-none whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0">
            <span>{toPersianDigits(currentIndex + 1)}</span>
            <span className="text-neutral-500 font-normal text-xs">از</span>
            <span>{toPersianDigits(totalSlides)}</span>
          </div>

          {/* Next Slide Button (Left Arrow in RTL) */}
          <button
            type="button"
            onClick={handleNextClick}
            disabled={currentIndex === totalSlides - 1}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="اسلاید بعدی (کلید چپ / Space / PageDown)"
            aria-label="اسلاید بعدی"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-6 bg-neutral-700 mx-1" />

          {/* Overview Grid (G) */}
          <button
            type="button"
            onClick={onToggleOverview}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors text-neutral-300 hover:text-white"
            title="نمای شبکه اسلایدها (کلید G)"
            aria-label="نمای شبکه اسلایدها"
          >
            <Grid className="w-5 h-5" />
          </button>

          {/* Fullscreen (F) */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors text-neutral-300 hover:text-white"
            title={isFullscreen ? 'خروج از تمام‌صفحه (کلید F / Esc)' : 'حالت تمام‌صفحه (کلید F)'}
            aria-label="حالت تمام‌صفحه"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Print PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors text-neutral-300 hover:text-white"
            title="چاپ یا دریافت خروجی PDF"
            aria-label="خروجی PDF"
          >
            <Printer className="w-5 h-5" />
          </button>

          {/* Editor Drawer Toggle (E) */}
          <button
            type="button"
            onClick={onToggleEditor}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium text-xs shadow-md transition-colors"
            title="پنل تنظیمات رویداد (کلید E)"
            aria-label="تنظیمات رویداد"
          >
            <Settings className="w-4 h-4" />
            <span>تنظیمات</span>
          </button>

          {/* Instant Hide Button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            title="مخفی کردن نوار کنترل (کلید H)"
            aria-label="مخفی کردن نوار کنترل"
          >
            <EyeOff className="w-4 h-4" />
          </button>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            title="راهنمای کلیدهای میانبر"
            aria-label="راهنمای کلیدهای میانبر"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Floating Gear Button in Top-Left Corner (also auto-hides with controls) */}
      <button
        type="button"
        onClick={onToggleEditor}
        className={`fixed top-5 left-5 z-40 p-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-700/80 text-emerald-400 hover:text-emerald-300 hover:bg-neutral-800 transition-all duration-500 shadow-xl no-print ${
          shouldShow ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        title="پنل تنظیمات رویداد (کلید E)"
        aria-label="باز کردن تنظیمات"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 no-print">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>کلیدهای میانبر ارائه</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/50">
                <span className="text-neutral-400">اسلاید بعدی:</span>
                <span className="font-mono bg-neutral-800 px-2.5 py-1 rounded text-emerald-400 text-xs">
                  ← / Space / PageDown
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/50">
                <span className="text-neutral-400">اسلاید قبلی:</span>
                <span className="font-mono bg-neutral-800 px-2.5 py-1 rounded text-emerald-400 text-xs">
                  → / PageUp
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/50">
                <span className="text-neutral-400">مخفی / نمایش نوار کنترل:</span>
                <span className="font-mono bg-neutral-800 px-2.5 py-1 rounded text-emerald-400 text-xs">
                  H
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/50">
                <span className="text-neutral-400">نمای شبکه اسلایدها:</span>
                <span className="font-mono bg-neutral-800 px-2.5 py-1 rounded text-emerald-400 text-xs">
                  G
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/50">
                <span className="text-neutral-400">حالت تمام‌صفحه:</span>
                <span className="font-mono bg-neutral-800 px-2.5 py-1 rounded text-emerald-400 text-xs">
                  F
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/50">
                <span className="text-neutral-400">پنل ویرایش رویداد:</span>
                <span className="font-mono bg-neutral-800 px-2.5 py-1 rounded text-emerald-400 text-xs">
                  E
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-neutral-400">خروجی PDF / پرینت:</span>
                <span className="font-mono bg-neutral-800 px-2.5 py-1 rounded text-emerald-400 text-xs">
                  Ctrl + P
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </>
  );
};

