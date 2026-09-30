import React from 'react';
import { motion } from 'motion/react';
import { EventConfig, ScheduleItem } from '../../types';
import { SlideLayout } from './SlideLayout';
import { toPersianDigits, getScheduleIconKey } from '../../utils/helpers';
import {
  Flag,
  Gamepad2,
  UtensilsCrossed,
  Coffee,
  GraduationCap,
  MessagesSquare,
  Sparkles,
  Target,
  Users,
  Award,
  BookOpen,
  Clock,
  Heart,
  Shield,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface ScheduleSlideProps {


  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
  itemsSubset?: ScheduleItem[];
  part?: number;
  totalParts?: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Flag,
  Gamepad2,
  UtensilsCrossed,
  Coffee,
  GraduationCap,
  MessagesSquare,
  Sparkles,
  Target,
  Users,
  Award,
  BookOpen,
  Clock,
  Heart,
  Shield,
  Activity,
  CheckCircle2,
};

export const ScheduleSlide: React.FC<ScheduleSlideProps> = ({
  config,
  slideNumber,
  totalSlides,
  itemsSubset,
  part = 1,
  totalParts = 1,
}) => {
  const items = itemsSubset || config.schedule || [];
  const title =
    part > 1
      ? `${config.sectionTitles.schedule || 'برنامه زمانی روز ما'} (ادامه)`
      : config.sectionTitles.schedule || 'برنامه زمانی روز ما';

  // Check if at least one item has a specified time
  const anyHasTime = items.some((item) => item.time && item.time.trim().length > 0);

  // Render icon based on key or auto match
  const renderItemIcon = (item: ScheduleItem) => {
    const iconKey = getScheduleIconKey(item.title, item.icon);
    const IconComponent = ICON_MAP[iconKey] || Sparkles;
    return <IconComponent className="w-8 h-8 stroke-[2.2]" />;
  };

  // Layout choice based on item count:
  // 3 to 6 items: Stepping horizontal timeline / stations
  // 7 to 10 items: 2-row / 2-column grid
  const isHorizontalStepped = items.length <= 6;

  return (
    <SlideLayout
      config={config}
      isDark={false}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      headerTitle={title}
      headerSubtitle="جدول گام‌به‌گام فعالیت‌های امروز؛ از آغاز پرشور تا هم‌اندیشی و اختتامیه."
      badge={totalParts > 1 ? `بخش ${toPersianDigits(part)} از ${toPersianDigits(totalParts)}` : 'زمان‌بندی رویداد'}
      patternType="architectural-grid"
    >
      <div className="w-full max-w-[1680px] mx-auto pt-2">
        {isHorizontalStepped ? (
          /* Horizontal Stepped Timeline (3 to 6 items) */
          <div className="relative pt-6">
            {/* Connecting horizontal path line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-[80px] right-16 left-16 h-1.5 bg-emerald-200/80 -z-0 rounded-full origin-right"
            />

            <div
              className="grid gap-6 items-stretch relative z-10"
              style={{
                gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
              }}
            >
              {items.map((item, idx) => {
                const stepNum = (part - 1) * 6 + idx + 1;
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1 + idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex flex-col items-center text-center group"
                  >
                    {/* Circle Node with Icon */}
                    <div className="relative mb-5">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-28 h-28 rounded-full bg-white border-4 border-emerald-600 shadow-xl flex items-center justify-center text-emerald-800 transition-transform"
                      >
                        {renderItemIcon(item)}
                      </motion.div>
                      {/* Step Number Tag - using same Vazirmatn font as page number */}
                      <span className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-emerald-950 text-white font-black text-lg flex items-center justify-center shadow-lg border-2 border-white">
                        {toPersianDigits(stepNum)}
                      </span>
                    </div>

                    {/* Station Card with safe padding and responsive typography */}
                    <div className="w-full bg-white rounded-3xl p-5 shadow-lg border-2 border-emerald-900/10 flex-1 flex flex-col justify-between hover:shadow-2xl hover:border-emerald-600/40 transition-all duration-300">
                      <div>
                        {anyHasTime && item.time && (
                          <div className="inline-block bg-emerald-100 text-emerald-950 font-black text-2xl px-5 py-1.5 rounded-full mb-3 shadow-sm border border-emerald-300">
                            {toPersianDigits(item.time)}
                          </div>
                        )}
                        <h4 className="text-2xl xl:text-3xl font-black text-neutral-950 leading-snug">
                          {item.title}
                        </h4>
                      </div>

                      {item.description && (
                        <p className="text-xl text-neutral-800 font-medium leading-relaxed mt-3 pt-3 border-t border-neutral-200">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 2-Column / 2-Row Grid for 7 to 10 items */
          <div className="grid grid-cols-2 gap-7 max-w-[1600px] mx-auto">
            {items.map((item, idx) => {
              const stepNum = (part - 1) * 6 + idx + 1;
              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.42,
                    delay: 0.08 + idx * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="bg-white rounded-3xl p-7 shadow-lg border-2 border-emerald-900/10 flex items-center gap-6 hover:shadow-2xl hover:border-emerald-600/40 transition-all"
                >
                  {/* Icon & Step Number */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 shadow-sm">
                      {renderItemIcon(item)}
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 w-10 h-10 rounded-full bg-emerald-900 text-white font-black text-base flex items-center justify-center shadow-md border-2 border-white">
                      {toPersianDigits(stepNum)}
                    </span>
                  </div>

                  {/* Station Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h4 className="text-3xl font-black text-neutral-950">
                        {item.title}
                      </h4>
                      {item.time && (
                        <span className="bg-emerald-100 text-emerald-950 font-black text-2xl px-4 py-1.5 rounded-full shrink-0 border border-emerald-300">
                          {toPersianDigits(item.time)}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-2xl text-neutral-800 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </SlideLayout>
  );
};
