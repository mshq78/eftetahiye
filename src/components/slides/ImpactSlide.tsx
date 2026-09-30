import React from 'react';
import { motion } from 'motion/react';
import { EventConfig } from '../../types';
import { SlideLayout } from './SlideLayout';
import { Quote } from 'lucide-react';

interface ImpactSlideProps {
  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

export const ImpactSlide: React.FC<ImpactSlideProps> = ({ config, slideNumber, totalSlides }) => {
  return (
    <SlideLayout
      config={config}
      isDark={true}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      patternType="concentric-rings"
    >
      <div className="relative max-w-[1550px] mx-auto text-center space-y-12">
        {/* Subtle quote icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: 160 }}
          animate={{ opacity: 1, scale: 1, rotate: 180 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/5 border border-white/10 text-[var(--primary-mint)] shadow-xl"
        >
          <Quote className="w-12 h-12 stroke-[1.8]" />
        </motion.div>

        {/* Impact Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h2 className="text-6xl xl:text-7xl font-black leading-[1.45] text-neutral-100 max-w-[1500px] mx-auto tracking-tight">
            ما اینجا هستیم تا در کنار یکدیگر، با انرژی مضاعف و روحیه‌ای تازه، به سوی اهداف مشترک سازمانی حرکت کنیم{' '}
            <span className="text-[var(--primary-mint)] drop-shadow-md font-black">
              و بستر رشد و نوآوری را برای آینده‌ای روشن‌تر فراهم آوریم.
            </span>
          </h2>
        </motion.div>

        {/* Minimal citation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="pt-6 inline-flex items-center gap-4 text-emerald-200 text-3xl font-bold"
        >
          <span>{config.brand.prefix} {config.brand.name}</span>
          {config.organizer?.name && (
            <>
              <span className="opacity-40 font-normal">•</span>
              <span className="text-[var(--primary-mint)] font-black">
                {config.organizer.label || 'برگزارکننده'}: {config.organizer.name}
              </span>
            </>
          )}
          {config.clientOrg.name && (
            <>
              <span className="opacity-40 font-normal">•</span>
              <span>{config.clientOrg.name}</span>
            </>
          )}
        </motion.div>
      </div>
    </SlideLayout>
  );
};
