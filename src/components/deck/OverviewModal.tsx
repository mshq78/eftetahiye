import React, { useEffect } from 'react';
import { SlideItem } from '../../types';
import { toPersianDigits } from '../../utils/helpers';
import { X, Check } from 'lucide-react';

interface OverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideItem[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
}

export const OverviewModal: React.FC<OverviewModalProps> = ({
  isOpen,
  onClose,
  slides,
  currentIndex,
  onSelectSlide,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-8 overflow-y-auto no-print">
      {/* Top bar */}
      <div className="flex items-center justify-between max-w-7xl w-full mx-auto pb-6 border-b border-neutral-800">
        <div>
          <h3 className="text-2xl font-black text-white">نمای مرور اسلایدهای رویداد</h3>
          <p className="text-neutral-400 text-sm mt-1">
            مجموعاً {toPersianDigits(slides.length)} اسلاید فعال — روی هر اسلاید برای پرش به آن کلیک کنید
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
          title="بستن (Esc / G)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Grid of Slides */}
      <div className="max-w-7xl w-full mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {slides.map((slide, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  onSelectSlide(idx);
                  onClose();
                }}
                className={`group relative rounded-2xl p-4 flex flex-col justify-between aspect-video transition-all duration-200 text-right ${
                  slide.isDark
                    ? 'bg-neutral-900 border-neutral-800 hover:border-emerald-500'
                    : 'bg-neutral-100 text-neutral-900 border-neutral-300 hover:border-emerald-600'
                } border-2 ${
                  isCurrent
                    ? 'ring-4 ring-emerald-500 shadow-2xl scale-[1.03] border-emerald-500'
                    : 'hover:scale-[1.02]'
                }`}
              >
                {/* Top Badge: Slide Number */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-bold text-xs px-2.5 py-1 rounded-full font-sans ${
                      slide.isDark ? 'bg-neutral-800 text-emerald-400' : 'bg-neutral-200 text-emerald-800'
                    }`}
                  >
                    اسلاید {toPersianDigits(idx + 1)}
                  </span>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" />
                      <span>در حال نمایش</span>
                    </span>
                  )}
                </div>

                {/* Center Title */}
                <div className="my-auto py-2">
                  <h4
                    className={`font-extrabold text-base leading-snug line-clamp-2 ${
                      slide.isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {slide.title}
                  </h4>
                </div>

                {/* Footer Tag */}
                <div className="flex items-center justify-between text-xs opacity-60">
                  <span>{slide.isDark ? 'تم تیره' : 'تم روشن'}</span>
                  {slide.part && slide.totalParts && slide.totalParts > 1 && (
                    <span>
                      بخش {toPersianDigits(slide.part)}/{toPersianDigits(slide.totalParts)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
