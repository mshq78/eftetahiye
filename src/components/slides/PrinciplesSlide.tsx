import React from 'react';
import { motion } from 'motion/react';
import { EventConfig } from '../../types';
import { SlideLayout } from './SlideLayout';
import { Heart, Smile, Compass, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface PrinciplesSlideProps {
  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

export const PrinciplesSlide: React.FC<PrinciplesSlideProps> = ({
  config,
  slideNumber,
  totalSlides,
}) => {
  const brandName = config.brand.name || 'همتا';
  const principles = config.principlesList || [];

  // Default icon mapping for principles
  const getIconForPrinciple = (title: string, index: number) => {
    if (title.includes('احترام')) return Heart;
    if (title.includes('مثبت') || title.includes('روحیه')) return Smile;
    if (title.includes('لحظه') || title.includes('حضور')) return Compass;
    if (title.includes('زمان') || title.includes('وقت')) return Clock;
    if (title.includes('محیط') || title.includes('طبیعت')) return ShieldCheck;
    const fallbacks = [Heart, Smile, Compass, Clock, ShieldCheck];
    return fallbacks[index % fallbacks.length];
  };

  return (
    <SlideLayout
      config={config}
      isDark={true}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      headerTitle={`اصول ما در ${brandName}`}
      headerSubtitle="برای داشتن تجربه‌ای مطلوب و لذت‌بخش، رعایت اصول زیر ضروری است. این قوانین به ما کمک می‌کنند تا در کنار یکدیگر روزی پر از خاطرات خوش را رقم بزنیم."
      badge="منشور همدلی و رفتار گروهی"
      patternType="persian-star"
    >
      <div className="w-full max-w-[1600px] mx-auto pt-1">
        {/* Asymmetrical Bento Grid with staggered motion */}
        <div className="grid grid-cols-12 grid-rows-2 gap-6 h-[540px]">
          {/* Card 1: Large Bento (احترام متقابل) - 6 cols, spans full 2 rows */}
          {principles[0] && (
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.48, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-6 row-span-2 bg-[var(--primary-surface-dark)] border-2 border-emerald-500/40 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
            >
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
                style={{ backgroundColor: 'var(--primary-mint)', opacity: 0.15 }}
              />

              <div className="flex items-center justify-between shrink-0">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="w-20 h-20 rounded-2xl bg-emerald-500/25 border-2 border-emerald-500/50 flex items-center justify-center text-[var(--primary-mint)] shadow-lg"
                >
                  {React.createElement(getIconForPrinciple(principles[0].title, 0), {
                    className: 'w-10 h-10 stroke-[2.2]',
                  })}
                </motion.div>
                <span className="text-lg font-black tracking-widest text-[var(--primary-mint)] bg-emerald-950/90 px-5 py-2 rounded-full border border-emerald-500/40 shadow-sm">
                  اصل بنیادین
                </span>
              </div>

              <div className="space-y-4 z-10 my-auto py-2">
                <h3 className="text-5xl font-black text-white tracking-tight leading-snug">
                  {principles[0].title}
                </h3>
                <p className="text-2xl text-emerald-100 font-medium leading-relaxed">
                  {principles[0].description ||
                    'پذیرش دیدگاه‌های متفاوت، گوش سپردن فعال و ایجاد بستری امن برای مشارکت همه اعضا'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[var(--primary-mint)] text-xl font-bold shrink-0 pt-4 border-t border-emerald-500/25">
                <Sparkles className="w-6 h-6 shrink-0" />
                <span>پایه و اساس تمامی فعالیت‌های امروز</span>
              </div>
            </motion.div>
          )}

          {/* Card 2: Medium Bento (روحیه مثبت) - 6 cols, 1 row */}
          {principles[1] && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-6 row-span-1 bg-[var(--primary-surface-dark)] border-2 border-white/15 rounded-3xl p-7 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
                  {React.createElement(getIconForPrinciple(principles[1].title, 1), {
                    className: 'w-7 h-7 stroke-[2.2]',
                  })}
                </div>
                <span className="text-base font-bold text-emerald-300 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                  اصل شماره ۲
                </span>
              </div>

              <div className="space-y-2 z-10 my-auto">
                <h3 className="text-3xl font-black text-white">{principles[1].title}</h3>
                <p className="text-2xl text-emerald-100 font-medium leading-relaxed">
                  {principles[1].description ||
                    'تمرکز بر راهکارها، اشتیاق به یادگیری و انرژی‌بخشی به جمع'}
                </p>
              </div>

              <div className="text-emerald-300 text-sm font-bold shrink-0">هم‌افزایی و انگیزه جمعی</div>
            </motion.div>
          )}

          {/* Card 3: Small Bento (حضور در لحظه) - 2 cols, row 2 */}
          {principles[2] && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-2 row-span-1 bg-[var(--primary-surface-dark)] border-2 border-white/15 rounded-3xl p-5 flex flex-col justify-between shadow-lg hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between shrink-0">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                  {React.createElement(getIconForPrinciple(principles[2].title, 2), {
                    className: 'w-6 h-6 stroke-[2]',
                  })}
                </div>
                <span className="text-sm font-bold text-emerald-300">اصل ۳</span>
              </div>
              <div className="space-y-1.5 my-auto">
                <h3 className="text-2xl font-black text-white">{principles[2].title}</h3>
                <p className="text-lg text-emerald-100/90 leading-relaxed font-medium line-clamp-3">
                  {principles[2].description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Card 4: Small Bento (قانون زمان) - 2 cols, row 2 */}
          {principles[3] && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-2 row-span-1 bg-[var(--primary-surface-dark)] border-2 border-white/15 rounded-3xl p-5 flex flex-col justify-between shadow-lg hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between shrink-0">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                  {React.createElement(getIconForPrinciple(principles[3].title, 3), {
                    className: 'w-6 h-6 stroke-[2]',
                  })}
                </div>
                <span className="text-sm font-bold text-emerald-300">اصل ۴</span>
              </div>
              <div className="space-y-1.5 my-auto">
                <h3 className="text-2xl font-black text-white">{principles[3].title}</h3>
                <p className="text-lg text-emerald-100/90 leading-relaxed font-medium line-clamp-3">
                  {principles[3].description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Card 5: Small Bento (مراقبت از محیط) - 2 cols, row 2 */}
          {principles[4] && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.46, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-2 row-span-1 bg-[var(--primary-surface-dark)] border-2 border-white/15 rounded-3xl p-5 flex flex-col justify-between shadow-lg hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between shrink-0">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                  {React.createElement(getIconForPrinciple(principles[4].title, 4), {
                    className: 'w-6 h-6 stroke-[2]',
                  })}
                </div>
                <span className="text-sm font-bold text-emerald-300">اصل ۵</span>
              </div>
              <div className="space-y-1.5 my-auto">
                <h3 className="text-2xl font-black text-white">{principles[4].title}</h3>
                <p className="text-lg text-emerald-100/90 leading-relaxed font-medium line-clamp-3">
                  {principles[4].description}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </SlideLayout>
  );
};
