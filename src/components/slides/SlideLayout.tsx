import React from 'react';
import { motion } from 'motion/react';
import { EventConfig } from '../../types';
import { toPersianDigits, renderTemplate } from '../../utils/helpers';
import { SlidePatterns, PatternType } from '../common/SlidePatterns';

interface SlideLayoutProps {
  config: EventConfig;
  isDark: boolean;
  slideNumber: number;
  totalSlides: number;
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  badge?: string;
  showFooter?: boolean;
  patternType?: PatternType;
}

export const SlideLayout: React.FC<SlideLayoutProps> = ({
  config,
  isDark,
  slideNumber,
  totalSlides,
  children,
  headerTitle,
  headerSubtitle,
  badge,
  showFooter = true,
  patternType,
}) => {
  const brandName = config.brand.name;
  const brandPrefix = config.brand.prefix;
  const footerText = `${brandPrefix} ${brandName}`.trim();
  const organizerName = config.organizer?.name || 'پردیس نوآوری گرا';
  const organizerLabel = config.organizer?.label || 'برگزارکننده';
  const showOrganizerInHeader = config.organizer?.showInHeader !== false;
  const showOrganizerInFooter = config.organizer?.showInFooter !== false;

  // Smart default pattern selection if not specified
  const effectivePattern: PatternType =
    patternType || (isDark ? 'persian-star' : 'architectural-grid');

  return (
    <div
      className={`relative w-[1920px] h-[1080px] overflow-hidden select-none flex flex-col justify-between transition-colors duration-300 ${
        isDark
          ? 'bg-[var(--primary-bg-dark)] text-neutral-100'
          : 'bg-[var(--primary-bg-light)] text-[var(--primary-text-light)]'
      }`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Subtle Geometric Pattern Accent (Localized in corners to avoid clutter) */}
      <SlidePatterns
        type={effectivePattern}
        isDark={isDark}
        position="corner-split"
      />

      {/* Atmospheric Ambient Glows */}
      {isDark ? (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-[250px] -left-[250px] w-[850px] h-[850px] rounded-full blur-[160px]"
            style={{ backgroundColor: 'var(--primary-brand)', opacity: 0.45 }}
          />
          <div
            className="absolute -bottom-[200px] -right-[200px] w-[800px] h-[800px] rounded-full blur-[170px]"
            style={{ backgroundColor: 'var(--primary-mint)', opacity: 0.22 }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-[250px] -right-[150px] w-[750px] h-[750px] rounded-full blur-[160px]"
            style={{ backgroundColor: 'var(--primary-mint)', opacity: 0.3 }}
          />
          <div
            className="absolute -bottom-[200px] -left-[150px] w-[700px] h-[700px] rounded-full blur-[150px]"
            style={{ backgroundColor: 'var(--primary-brand)', opacity: 0.12 }}
          />
        </div>
      )}


      {/* Optional Top Slide Header (when headerTitle is provided) */}
      {headerTitle ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 pt-14 px-20 flex items-center justify-between shrink-0"
        >
          <div className="space-y-3.5 max-w-[1380px]">
            {badge && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`inline-block text-2xl font-black tracking-wide px-6 py-2 rounded-full ${
                  isDark
                    ? 'bg-emerald-500/25 text-[var(--primary-mint)] border border-emerald-400/40 shadow-sm'
                    : 'bg-emerald-800/12 text-emerald-950 font-black border border-emerald-800/25 shadow-sm'
                }`}
              >
                {badge}
              </motion.span>
            )}
            <h2
              className={`text-7xl font-black tracking-tight leading-[1.25] ${
                isDark ? 'text-white' : 'text-neutral-950'
              }`}
            >
              {headerTitle}
            </h2>
            {headerSubtitle && (
              <p
                className={`text-3xl leading-relaxed max-w-[1300px] ${
                  isDark ? 'text-emerald-100/90 font-medium' : 'text-neutral-800 font-semibold'
                }`}
              >
                {renderTemplate(headerSubtitle, config)}
              </p>
            )}
          </div>

          {/* Organizer & Client Org Badges in top header */}
          <div className="flex flex-col items-end gap-2.5 shrink-0">
            {showOrganizerInHeader && organizerName && (
              <div
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-xl border text-xl font-bold ${
                  isDark
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-[var(--primary-mint)]'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                }`}
              >
                <span className="opacity-75 text-lg font-medium">{organizerLabel}:</span>
                <span className="font-black">{organizerName}</span>
              </div>
            )}
            {config.clientOrg.name && (
              <div
                className={`flex items-center gap-2 px-3.5 py-1 rounded-xl text-lg font-semibold ${
                  isDark
                    ? 'text-neutral-300/80'
                    : 'text-neutral-600 bg-neutral-100/70'
                }`}
              >
                <span className="opacity-70 text-base">مخاطب:</span>
                <span className="font-bold">{config.clientOrg.name}</span>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}

      {/* Main Slide Content Area with staggered animation */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex-1 px-20 py-5 flex flex-col justify-center"
      >
        {children}
      </motion.div>

      {/* Footer (all slides except cover when turned off) */}
      {showFooter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className={`relative z-10 px-20 py-5 flex items-center justify-between border-t shrink-0 ${
            isDark
              ? 'border-emerald-900/50 text-emerald-200/90'
              : 'border-emerald-800/20 text-emerald-950'
          }`}
        >
          <div className="flex items-center gap-6 text-2xl font-bold tracking-wide">
            <span className="font-black">{footerText}</span>
            {showOrganizerInFooter && organizerName && (
              <>
                <span className="opacity-40 font-normal">|</span>
                <span className={isDark ? 'text-[var(--primary-mint)] font-bold' : 'text-emerald-900 font-bold'}>
                  {organizerLabel}: {organizerName}
                </span>
              </>
            )}
            {config.clientOrg.name && (
              <>
                <span className="opacity-40 font-normal">|</span>
                <span className="font-semibold">{config.clientOrg.name}</span>
              </>
            )}
            {config.venue && (
              <>
                <span className="opacity-40 font-normal">|</span>
                <span className="font-medium opacity-90">{config.venue}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-2xl font-black">
            <span>
              {toPersianDigits(slideNumber)} از {toPersianDigits(totalSlides)}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
