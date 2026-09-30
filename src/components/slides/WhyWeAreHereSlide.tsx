import React from 'react';
import { motion } from 'motion/react';
import { EventConfig } from '../../types';
import { SlideLayout } from './SlideLayout';
import { toPersianDigits } from '../../utils/helpers';
import { TrendingUp, Users, HeartHandshake, Zap } from 'lucide-react';

interface WhyWeAreHereSlideProps {
  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

export const WhyWeAreHereSlide: React.FC<WhyWeAreHereSlideProps> = ({
  config,
  slideNumber,
  totalSlides,
}) => {
  const items = [
    {
      title: 'آموزش و توسعه فردی و گروهی',
      description: 'کسب مهارت‌های کاربردی و ارتقای شایستگی‌های حرفه‌ای متناسب با نیازهای سازمان',
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      title: 'تقویت کار گروهی',
      description: 'هماهنگی بیشتر، تفکر تیمی در حل چالش‌ها و پیوند عمیق‌تر میان واحدهای مختلف',
      icon: Users,
      color: 'from-teal-600 to-emerald-800',
    },
    {
      title: 'افزایش همدلی',
      description: 'شنیدن صدای یکدیگر در فضایی امن و سرشار از احترام، درک متقابل و صمیمیت',
      icon: HeartHandshake,
      color: 'from-emerald-700 to-teal-800',
    },
    {
      title: 'افزایش انگیزه',
      description: 'تزریق نشاط و امید سازمانی، تقویت تعلق خاطر و تجدید قوای روحی برای اهداف پیش‌رو',
      icon: Zap,
      color: 'from-teal-700 to-emerald-900',
    },
  ];

  return (
    <SlideLayout
      config={config}
      isDark={false}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      headerTitle="چرا اینجاییم؟"
      headerSubtitle="فعالیت‌های امروز صرفاً سرگرمی نیستند، بلکه ابزاری هدفمند برای دستیابی به اهداف بزرگتر سازمانی هستند."
      badge="اهداف استراتژیک روز"
      patternType="topographic"
    >
      <div className="w-full max-w-[1600px] mx-auto pt-4">
        <div className="grid grid-cols-2 gap-8">
          {items.map((item, index) => {
            const Icon = item.icon;
            const indexStr = toPersianDigits(index + 1);

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 35, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: 0.1 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-emerald-900/10 flex items-start gap-7 hover:border-emerald-600/40 hover:shadow-2xl transition-all duration-300"
              >
                {/* Index numeral container */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-22 h-22 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 shadow-sm"
                  >
                    <Icon className="w-11 h-11 stroke-[2.2]" />
                  </motion.div>
                  <span className="text-2xl font-black text-emerald-900 font-sans">
                    ۰{indexStr}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3 pt-1">
                  <h3 className="text-3xl xl:text-4xl font-black text-neutral-950 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-2xl text-neutral-800 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideLayout>
  );
};


