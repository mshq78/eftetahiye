import React from 'react';
import { motion } from 'motion/react';
import { EventConfig } from '../../types';
import { SlideLayout } from './SlideLayout';
import { AlertTriangle, ChefHat, Flame, Sparkles } from 'lucide-react';

interface LunchSlideProps {
  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

export const LunchSlide: React.FC<LunchSlideProps> = ({ config, slideNumber, totalSlides }) => {
  const title = config.lunch?.title || 'امروز ناهار ما دست‌پخت خود شماست!';
  const description =
    config.lunch?.description ||
    'در این بخش هیجان‌انگیز از برنامه، هر تیم فرصت دارد تا مهارت‌های آشپزی خود را به نمایش بگذارد. این فعالیت نه تنها سرگرم‌کننده است، بلکه نیازمند همکاری، برنامه‌ریزی و خلاقیت گروهی است.';
  const note =
    config.lunch?.note ||
    'نکته مهم: رتبه تیم شما در بازی‌های صبحگاهی، در انتخاب مواد اولیه تأثیرگذار خواهد بود؛ پس در فعالیت‌های صبح تلاش کنید برنده باشید!';

  const pillars = [
    {
      title: 'همکاری و تقسیم کار',
      desc: 'مدیریت وظایف، هم‌افزایی و تکیه بر استعدادهای متنوع اعضای گروه',
      icon: ChefHat,
    },
    {
      title: 'خلاقیت و نوآوری',
      desc: 'طعم‌آرایی متمایز، تزیین سفره و طراحی منوی اختصاصی تیم',
      icon: Flame,
    },
    {
      title: 'داوری و امتیازدهی',
      desc: 'ارزیابی دست‌پخت‌ها بر اساس هماهنگی، کیفیت و زیبایی ارائه',
      icon: Sparkles,
    },
  ];

  return (
    <SlideLayout
      config={config}
      isDark={true}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      headerTitle={title}
      headerSubtitle={description}
      badge="چالش ویژه نیمروزی"
      patternType="isometric-nodes"
    >
      <div className="w-full max-w-[1550px] mx-auto pt-2 space-y-8">
        {/* 3 Pillars of Cooking Challenge with staggered motion */}
        <div className="grid grid-cols-3 gap-7">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: 0.1 + idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-[var(--primary-surface-dark)] border-2 border-emerald-500/30 rounded-3xl p-7 flex items-center gap-6 hover:border-emerald-500/50 transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-[var(--primary-mint)] shrink-0"
                >
                  <Icon className="w-10 h-10" />
                </motion.div>
                <div>
                  <h4 className="text-3xl font-black text-white mb-1.5">{p.title}</h4>
                  <p className="text-xl text-emerald-100 font-medium leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Distinctive Amber Note Box (Crucial user requirement: amber callout) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.38,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative rounded-3xl p-8 bg-amber-500/20 border-2 border-amber-400 backdrop-blur-md shadow-2xl flex items-center gap-8"
        >
          <div className="w-22 h-22 rounded-2xl bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
            <AlertTriangle className="w-12 h-12 stroke-[2.2]" />
          </div>
          <div className="flex-1 space-y-1.5">
            <span className="text-amber-300 font-black text-2xl tracking-wider inline-block">
              نکته استراتژیک چالش
            </span>
            <p className="text-3xl font-black text-amber-50 leading-relaxed drop-shadow-sm">
              {note}
            </p>
          </div>
        </motion.div>
      </div>
    </SlideLayout>
  );
};


