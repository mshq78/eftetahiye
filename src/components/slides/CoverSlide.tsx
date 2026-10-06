import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { EventConfig, LogoItem } from '../../types';
import { renderTemplate, isLightImage } from '../../utils/helpers';
import { Pin, Sparkles, Building2 } from 'lucide-react';
import { SlidePatterns } from '../common/SlidePatterns';

interface CoverSlideProps {
  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

const LogoCard: React.FC<{ logo: LogoItem; idx: number }> = ({ logo, idx }) => {
  const [autoLight, setAutoLight] = useState(false);
  const mode = logo.background ?? 'auto';

  useEffect(() => {
    let cancelled = false;
    if (mode === 'auto' && logo.imageDataUrl) {
      isLightImage(logo.imageDataUrl).then((light) => {
        if (!cancelled) setAutoLight(light);
      });
    } else {
      setAutoLight(false);
    }
    return () => {
      cancelled = true;
    };
  }, [logo.imageDataUrl, mode]);

  const darkCard = mode === 'dark' || (mode === 'auto' && autoLight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.45 + idx * 0.07 }}
      className={`relative rounded-2xl p-3 h-22 w-48 flex items-center justify-center shadow-xl border transition-transform hover:scale-105 ${
        darkCard
          ? 'bg-[var(--primary-bg-dark)] border-emerald-400/40'
          : 'bg-white/95 border-white/30'
      }`}
      title={logo.name}
    >
      {logo.pinned && (
        <div className="absolute -top-2.5 -right-2.5 bg-emerald-600 text-white rounded-full p-1.5 shadow-md">
          <Pin className="w-4 h-4" />
        </div>
      )}
      {logo.imageDataUrl ? (
        <img src={logo.imageDataUrl} alt={logo.name} className="max-h-16 max-w-40 object-contain" />
      ) : (
        <span
          className={`font-black text-center text-base leading-tight line-clamp-2 px-1 ${
            darkCard ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {logo.name}
        </span>
      )}
    </motion.div>
  );
};

export const CoverSlide: React.FC<CoverSlideProps> = ({ config }) => {
  const brandName = config.brand.name || 'همتا';
  const prefix = config.brand.prefix || 'بوت‌کمپ آموزشی';
  const subtitle = config.brand.subtitle || 'همدلی و توان‌افزایی';
  const intro = config.intro || 'این رویداد فرصتی است برای تقویت روحیه تیمی...';
  const organizerName = config.organizer?.name || 'پردیس نوآوری گرا';
  const organizerLabel = config.organizer?.label || 'برگزارکننده';
  const showOrganizerOnCover = config.organizer?.showOnCover !== false;

  // Dynamic font sizing for fit-text requirement:
  // Short names (e.g. "همتا") ~220px, longer names scale down gracefully.
  const getBrandFontSizeClass = (len: number) => {
    if (len <= 4) return 'text-[210px] leading-[1.05]';
    if (len <= 7) return 'text-[160px] leading-[1.1]';
    if (len <= 12) return 'text-[120px] leading-[1.15]';
    return 'text-[92px] leading-[1.2]';
  };

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden select-none bg-[var(--primary-bg-dark)] text-neutral-100 flex flex-col justify-between px-20 py-14">
      {/* Subtle Background Decorative Pattern Accent */}
      <SlidePatterns
        type="persian-star"
        isDark={true}
        opacity={0.16}
        position="top-right"
      />

      {/* Background radial atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[250px] -right-[150px] w-[950px] h-[950px] rounded-full blur-[170px]"
          style={{ backgroundColor: 'var(--primary-mint)', opacity: 0.22 }}
        />
        <div
          className="absolute -bottom-[300px] -left-[200px] w-[1100px] h-[1100px] rounded-full blur-[190px]"
          style={{ backgroundColor: 'var(--primary-brand)', opacity: 0.4 }}
        />
      </div>


      {/* Top Header: Bismillah + Organizer & Client Badges */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Right side: Bismillah */}
        <div className="text-right">
          {config.brand.showBismillah && (
            <motion.p
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-serif tracking-widest text-[var(--primary-mint)] drop-shadow font-bold"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </motion.p>
          )}
        </div>

        {/* Left side: Prominent Organizer & Client Badges */}
        <div className="flex items-center gap-4">
          {showOrganizerOnCover && organizerName && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex items-center gap-3 bg-emerald-500/20 border-2 border-emerald-400/50 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-[var(--primary-mint)] shrink-0" />
              <span className="text-emerald-200 text-xl font-medium">{organizerLabel}:</span>
              <span className="text-white text-2xl font-black tracking-wide drop-shadow-sm">
                {organizerName}
              </span>
            </motion.div>
          )}

          {config.clientOrg.name && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg"
            >
              <Building2 className="w-6 h-6 text-neutral-300 shrink-0" />
              <span className="text-emerald-300 text-xl font-medium">سازمان مخاطب:</span>
              <span className="text-white text-2xl font-black tracking-wide">
                {config.clientOrg.name}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Center Branding Area */}
      <div className="relative z-10 my-auto text-center space-y-7 max-w-[1600px] mx-auto">
        {/* Prefix */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="inline-flex items-center gap-4"
        >
          <div className="h-[3px] w-16 bg-gradient-to-r from-transparent to-[var(--primary-mint)]" />
          <span className="text-4xl font-extrabold tracking-wider text-[var(--primary-mint)] drop-shadow-sm">
            {prefix}
          </span>
          <div className="h-[3px] w-16 bg-gradient-to-l from-transparent to-[var(--primary-mint)]" />
        </motion.div>

        {/* Fit-text Giant Brand Name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={`font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-emerald-200 drop-shadow-2xl ${getBrandFontSizeClass(
            brandName.length
          )}`}
          style={{ wordBreak: 'keep-all' }}
        >
          {brandName}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-5xl font-black text-emerald-100 tracking-wide drop-shadow-md"
        >
          {subtitle}
        </motion.p>

        {/* Intro text - enlarged for hall projection legibility */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="text-3xl text-emerald-50 max-w-[1300px] mx-auto leading-relaxed font-semibold pt-2 drop-shadow-sm"
        >
          {renderTemplate(intro, config)}
        </motion.p>

        {/* Venue and Organizer Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.42 }}
          className="pt-2 flex items-center justify-center gap-4 flex-wrap"
        >
          {config.venue && (
            <span className="inline-block text-2xl text-emerald-200 bg-emerald-950/80 border-2 border-emerald-500/30 px-7 py-2.5 rounded-full font-bold shadow-md">
              محل میزبانی: <span className="text-white font-black">{config.venue}</span>
            </span>
          )}
          {showOrganizerOnCover && organizerName && (
            <span className="inline-block text-2xl text-[var(--primary-mint)] bg-emerald-950/80 border-2 border-emerald-500/30 px-7 py-2.5 rounded-full font-bold shadow-md">
              برگزارکننده و طراح رویداد: <span className="text-white font-black">{organizerName}</span>
            </span>
          )}
        </motion.div>
      </div>

      {/* Bottom Area: Logos Strip & Credit */}
      <div className="relative z-10 pt-5 flex items-end justify-between border-t border-emerald-900/50">
        {/* Logos container */}
        <div className="flex items-center gap-6 flex-wrap">
          {config.logos && config.logos.length > 0 ? (
            config.logos.map((logo, idx) => <LogoCard key={logo.id} logo={logo} idx={idx} />)
          ) : (
            <div className="text-emerald-200 text-2xl font-bold">
              {showOrganizerOnCover && organizerName ? `${organizerLabel}: ${organizerName} | ` : ''}
              {config.clientOrg.name} | {prefix} {brandName}
            </div>
          )}
        </div>

        {/* Right side: LinkedIn and Organizer Credit */}
        <div className="flex items-center gap-4">
          {showOrganizerOnCover && organizerName && (
            <div className="text-emerald-300/90 text-xl font-bold bg-emerald-950/70 border border-emerald-500/30 px-5 py-2.5 rounded-xl">
              {organizerName}
            </div>
          )}
          {config.linkedin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              dir="ltr"
              className="text-emerald-300 text-xl font-mono font-bold tracking-wider bg-black/40 border border-white/20 px-6 py-2.5 rounded-xl"
            >
              {config.linkedin}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
