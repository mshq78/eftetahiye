import React from 'react';
import { motion } from 'motion/react';
import { EventConfig } from '../../types';
import { SlideLayout } from './SlideLayout';
import { BookOpen, Target, Lightbulb, Compass, Award } from 'lucide-react';

interface WorkshopSlideProps {
  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

export const WorkshopSlide: React.FC<WorkshopSlideProps> = ({
  config,
  slideNumber,
  totalSlides,
}) => {
  const topic = config.workshop?.topic;

  return (
    <SlideLayout
      config={config}
      isDark={false}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      headerTitle="آموزش و توسعه، ابزارهایی برای موفقیت شما"
      headerSubtitle="در این کارگاه آموزشی، به موضوعاتی خواهیم پرداخت که به طور مستقیم با محیط کار و رشد شغلی شما مرتبط است. این بخش از برنامه با هدف ارتقای مهارت‌های حرفه‌ای و توسعه توانمندی‌های فردی و سازمانی طراحی شده است."
      badge="کارگاه توان‌افزایی"
      patternType="drafting-cross"
    >
      <div className="w-full max-w-[1550px] mx-auto pt-4 space-y-8">
        {/* Prominent Workshop Topic Badge if set */}
        {topic && topic.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-emerald-950 text-white rounded-3xl p-8 shadow-2xl flex items-center gap-8 border-2 border-emerald-500/50"
          >
            <div className="w-22 h-22 rounded-2xl bg-white/10 flex items-center justify-center text-[var(--primary-mint)] shrink-0">
              <Compass className="w-12 h-12" />
            </div>
            <div>
              <span className="text-emerald-300 font-black text-2xl block mb-1.5">
                محور اختصاصی کارگاه این دوره:
              </span>
              <h3 className="text-4xl font-black tracking-tight leading-snug">
                {topic}
              </h3>
            </div>
          </motion.div>
        )}

        {/* The Two Distinct Blocks */}
        <div className="grid grid-cols-2 gap-8">
          {/* Block 1: محتوای کاربردی */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-10 shadow-xl border-2 border-emerald-900/10 flex flex-col justify-between hover:border-emerald-600/40 hover:shadow-2xl transition-all"
          >
            <div className="space-y-4">
              <div className="w-22 h-22 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-800">
                <Target className="w-11 h-11 stroke-[2.2]" />
              </div>
              <h4 className="text-4xl font-black text-neutral-950">محتوای کاربردی</h4>
              <p className="text-2xl text-neutral-800 leading-relaxed font-medium">
                موضوع دقیق کارگاه با توجه به نیاز سازمان شما تعیین شده و کاملاً کاربردی است. تمرکز بر راهکارهای عملی و چالش‌های واقعی محیط کار، یادگیری ماندگاری را تضمین می‌کند.
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-200 flex items-center gap-3 text-emerald-900 font-black text-xl">
              <Award className="w-6 h-6 text-emerald-600" />
              <span>طراحی شده بر اساس نیازسنجی سازمانی</span>
            </div>
          </motion.div>

          {/* Block 2: فرصت یادگیری */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-10 shadow-xl border-2 border-emerald-900/10 flex flex-col justify-between hover:border-emerald-600/40 hover:shadow-2xl transition-all"
          >
            <div className="space-y-4">
              <div className="w-22 h-22 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-800">
                <Lightbulb className="w-11 h-11 stroke-[2.2]" />
              </div>
              <h4 className="text-4xl font-black text-neutral-950">فرصت یادگیری</h4>
              <p className="text-2xl text-neutral-800 leading-relaxed font-medium">
                این یک فرصت عالی برای یادگیری و بهبود مهارت‌هاست که می‌تواند در پیشرفت شغلی شما تأثیرگذار باشد. فرصتی برای آزمودن ایده‌ها، تمرین حل مسئله و دریافت بازخورد سازنده.
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-200 flex items-center gap-3 text-emerald-900 font-black text-xl">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              <span>همراه با تمرین‌های تعاملی و گروهی</span>
            </div>
          </motion.div>
        </div>
      </div>
    </SlideLayout>
  );
};


