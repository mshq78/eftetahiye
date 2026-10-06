import React from 'react';
import { motion } from 'motion/react';
import { EventConfig } from '../../types';
import { SlideLayout } from './SlideLayout';
import { Coffee, MessageCircle, Lightbulb, Users2 } from 'lucide-react';

interface CafeSlideProps {
  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

export const CafeSlide: React.FC<CafeSlideProps> = ({ config, slideNumber, totalSlides }) => {
  const pillars = [
    {
      title: 'گفتگوی آزاد',
      subtitle: 'طرح دیدگاه‌ها، دغدغه‌ها و ایده‌ها بدون موانع سلسله‌مراتبی و در فضایی سرشار از اعتماد و احترام متقابل',
      icon: MessageCircle,
    },
    {
      title: 'هم‌اندیشی',
      subtitle: 'هم‌فکری برای بازآفرینی فرایندها، کشف فرصت‌های نوآورانه و طراحی راهکارهای تحول‌ساز در محیط کار',
      icon: Lightbulb,
    },
    {
      title: 'با حضور مدیران',
      subtitle: 'شنیدن بی‌واسطه صدای همکاران، تبادل تجربیات زیسته و ساخت درک مشترک از آینده سازمان',
      icon: Users2,
    },
  ];

  return (
    <SlideLayout
      config={config}
      isDark={true}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      headerTitle={config.sectionTitles?.cafe || 'کافه گفتگو: فرصتی برای شنیده شدن'}
      headerSubtitle="در پایان روز پرانرژی امروز، فرصتی فراهم شده تا در فضایی صمیمی و دوستانه با مدیران ارشد خود گفتگو کنید. این بخش از برنامه با هدف ایجاد ارتباط مستقیم میان کارکنان و مدیران طراحی شده است."
      badge="اختتامیه و ارتباط بی‌واسطه"
      patternType="concentric-rings"
    >
      <div className="w-full max-w-[1550px] mx-auto pt-6">
        <div className="grid grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 35, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: 0.12 + idx * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-[var(--primary-surface-dark)] border-2 border-emerald-500/30 rounded-3xl p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[var(--primary-mint)]/60 transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-22 h-22 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-[var(--primary-mint)] shadow-md"
                    >
                      <Icon className="w-11 h-11 stroke-[2]" />
                    </motion.div>
                    <span className="text-base font-black text-[var(--primary-mint)] bg-emerald-950/95 px-5 py-2 rounded-full border border-emerald-500/40 font-sans">
                      محور ۰{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-3xl xl:text-4xl font-black text-white">{pillar.title}</h3>
                    <p className="text-2xl text-emerald-100 font-medium leading-relaxed">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-emerald-900/50 flex items-center gap-2.5 text-emerald-300 text-xl font-bold">
                  <Coffee className="w-6 h-6 text-[var(--primary-mint)]" />
                  <span>فضایی آرام و الهام‌بخش</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideLayout>
  );
};


