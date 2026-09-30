import React from 'react';
import { motion } from 'motion/react';
import { EventConfig } from '../../types';
import { SlideLayout } from './SlideLayout';
import { renderTemplate, toPersianDigits } from '../../utils/helpers';
import { Users, GraduationCap, MessagesSquare, Sparkles } from 'lucide-react';

interface IntroSlideProps {

  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({ config, slideNumber, totalSlides }) => {
  const hasVenue = Boolean(config.venue && config.venue.trim().length > 0);

  const introParagraph = hasVenue
    ? renderTemplate(
        'این رویداد که در فضای دلنشین {{venue}} برگزار می‌شود، فرصتی استثنایی است تا با شرکت در چالش‌های تیمی، کارگاه آموزشی-عملی و کافه گفتگو، نه تنها مهارت‌های فردی و گروهی خود را تقویت کنید، بلکه با رویکردهای نوین توسعه و تحول سازمانی آشنا شوید.',
        config
      )
    : renderTemplate(
        'این رویداد فرصتی استثنایی است تا با شرکت در چالش‌های تیمی، کارگاه آموزشی-عملی و کافه گفتگو، نه تنها مهارت‌های فردی و گروهی خود را تقویت کنید، بلکه با رویکردهای نوین توسعه و تحول سازمانی آشنا شوید.',
        config
      );

  // Dynamic tiles based on active modules:
  const tiles = [
    {
      id: 'team-challenges',
      title: 'چالش‌های تیمی',
      subtitle: 'مسابقات جذاب، یادگیری از طریق تجربه و بازآفرینی ارتباطات',
      icon: Users,
      badge: 'پویایی گروهی',
      enabled: true, // Always present
    },
    {
      id: 'workshop',
      title: 'کارگاه آموزشی-عملی',
      subtitle: config.workshop?.topic
        ? config.workshop.topic
        : 'تمرین مهارت‌های کاربردی و توسعه ظرفیت‌های حل مسئله در محیط کار',
      icon: GraduationCap,
      badge: 'دانش‌افزایی',
      enabled: config.modules.workshop,
    },
    {
      id: 'cafe',
      title: 'کافه گفتگو',
      subtitle: 'هم‌اندیشی صمیمانه، انتقال تجربه و تبادل دیدگاه با مدیران ارشد',
      icon: MessagesSquare,
      badge: 'همدلی سازمانی',
      enabled: config.modules.cafe,
    },
  ].filter((t) => t.enabled);

  return (
    <SlideLayout
      config={config}
      isDark={false}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      headerTitle="آماده اتفاقات تازه باشید!"
      headerSubtitle={introParagraph}
      badge="معرفی محورهای رویداد"
      patternType="architectural-grid"
    >
      <div className="w-full max-w-[1600px] mx-auto pt-6">
        <div
          className={`grid gap-8 ${
            tiles.length === 3
              ? 'grid-cols-3'
              : tiles.length === 2
              ? 'grid-cols-2 max-w-[1200px] mx-auto'
              : 'grid-cols-1 max-w-[800px] mx-auto'
          }`}
        >
          {tiles.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.id}
                initial={{ opacity: 0, y: 35, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: 0.12 + idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative bg-white rounded-3xl p-10 shadow-lg border border-emerald-900/10 flex flex-col justify-between overflow-hidden group hover:border-emerald-700/30 transition-all duration-300"
              >
                {/* Decorative accent top line */}
                <div
                  className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l"
                  style={{
                    backgroundImage: `linear-gradient(to left, var(--primary-brand), var(--primary-mint))`,
                  }}
                />


                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-22 h-22 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 shadow-sm">
                      <Icon className="w-11 h-11 stroke-[2.2]" />
                    </div>
                    <span className="text-xl font-black px-5 py-2 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                      {tile.badge}
                    </span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-3xl xl:text-4xl font-black text-neutral-950 leading-snug">
                      {tile.title}
                    </h3>
                    <p className="text-2xl text-neutral-800 leading-relaxed font-medium">
                      {tile.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex items-center gap-3 text-emerald-900 text-xl font-black">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                  <span>محور شماره {toPersianDigits(idx + 1)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideLayout>
  );
};
