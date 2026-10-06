import React from 'react';
import { motion } from 'motion/react';
import { EventConfig, TeamMember } from '../../types';
import { SlideLayout } from './SlideLayout';
import { toPersianDigits } from '../../utils/helpers';

interface TeamSlideProps {

  config: EventConfig;
  slideNumber: number;
  totalSlides: number;
  itemsSubset?: TeamMember[];
  part?: number;
  totalParts?: number;
}

export const TeamSlide: React.FC<TeamSlideProps> = ({
  config,
  slideNumber,
  totalSlides,
  itemsSubset,
  part = 1,
  totalParts = 1,
}) => {
  const members = itemsSubset || config.team || [];
  const organizerName = config.organizer?.name || 'پردیس نوآوری گرا';
  const baseTitle = config.sectionTitles?.team || 'معرفی اعضای تیم';
  const slideTitle = totalParts > 1 ? `${baseTitle} (بخش ${toPersianDigits(part)})` : baseTitle;

  // Compute grid layout based on members count:
  const count = members.length;

  // Balanced rows: 1-4 members -> one row, 5-8 -> two rows, 9+ -> three rows.
  // The last (shorter) row is centered, so 5 members become 3 + 2, never 4 + 1.
  const rows = count <= 4 ? 1 : count <= 8 ? 2 : 3;
  const cols = Math.max(1, Math.ceil(count / rows));
  const GAP = rows === 1 ? 28 : 20;
  const compact = rows === 3; // 9+ members: horizontal cards so everything fits
  const cardWidth = `calc((100% - ${GAP * (cols - 1)}px) / ${cols})`;
  const containerMaxWidth = count <= 3 ? [0, 520, 820, 1160][count] : 1580;

  let avatarSizeClass = 'w-32 h-32 text-4xl';
  let nameSizeClass = 'text-3xl';
  let roleSizeClass = 'text-2xl';
  let cardPaddingClass = 'p-6';

  if (count === 1) {
    avatarSizeClass = 'w-56 h-56 text-7xl';
    nameSizeClass = 'text-5xl';
    roleSizeClass = 'text-3xl';
  } else if (count === 2) {
    avatarSizeClass = 'w-48 h-48 text-6xl';
    nameSizeClass = 'text-4xl';
    roleSizeClass = 'text-2xl';
  } else if (count === 3) {
    avatarSizeClass = 'w-44 h-44 text-5xl';
    nameSizeClass = 'text-3xl xl:text-4xl';
    roleSizeClass = 'text-2xl';
  } else if (count === 4) {
    avatarSizeClass = 'w-36 h-36 text-4xl';
  } else if (rows === 2) {
    avatarSizeClass = 'w-28 h-28 text-4xl';
    nameSizeClass = 'text-2xl xl:text-3xl';
    roleSizeClass = 'text-xl';
    cardPaddingClass = 'p-5';
  } else {
    avatarSizeClass = 'w-20 h-20 text-3xl';
    nameSizeClass = 'text-2xl';
    roleSizeClass = 'text-lg';
    cardPaddingClass = 'p-3.5';
  }

  // Get initial letter of name for gradient avatar fallback
  const getInitial = (name: string) => {
    if (!name || name.trim().length === 0) return '؟';
    const trimmed = name.trim();
    // In Persian, "دکتر" or "سید" might precede name, but taking the first letter works well
    return trimmed[0];
  };

  return (
    <SlideLayout
      config={config}
      isDark={false}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
      headerTitle={slideTitle}
      headerSubtitle={`همراهان، راهبران و تسهیل‌گران «${organizerName}» در طراحی، آموزش و هدایت چالش‌های این رویداد سازمانی.`}
      badge={`تیم برگزارکننده (${organizerName})`}
      patternType="hexagonal"
    >
      <div className="w-full max-w-[1640px] mx-auto pt-2">
        {count === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-dashed border-emerald-300 max-w-lg mx-auto shadow-md my-8">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
              👥
            </div>
            <h4 className="text-3xl font-black text-neutral-900 mb-2">
              عضوی برای این رویداد فعال نشده است
            </h4>
            <p className="text-neutral-700 text-lg leading-relaxed">
              برای نمایش اعضای تیم در این اسلاید، از پنل تنظیمات (کلید E) اعضای حاضر در این رویداد را انتخاب نمایید.
            </p>
          </div>
        ) : (
          <div
            className="flex flex-wrap justify-center items-stretch mx-auto"
            style={{ gap: GAP, maxWidth: containerMaxWidth }}
          >
            {members.map((member, index) => {
              return (
                <motion.div
                  key={member.id || index}
                  initial={{ opacity: 0, y: 28, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.38,
                    delay: 0.06 + index * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ width: cardWidth }}
                  className={`bg-white rounded-3xl ${cardPaddingClass} shadow-lg border-2 border-emerald-900/10 ${compact ? 'flex-row items-center gap-4 text-right' : 'flex-col items-center text-center justify-between'} flex hover:shadow-2xl hover:border-emerald-600/40 transition-all duration-300`}
                >
                  {/* Circular photo or Gradient Avatar with first letter */}
                  <div className={`relative shrink-0 ${compact ? '' : 'mb-4'}`}>
                    {member.photoDataUrl ? (
                      <img
                        src={member.photoDataUrl}
                        alt={member.name}
                        className={`${avatarSizeClass} rounded-full object-cover border-4 border-emerald-600 shadow-xl`}
                      />
                    ) : (
                      <div
                        className={`${avatarSizeClass} rounded-full bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-500 text-white font-black flex items-center justify-center border-4 border-white shadow-xl`}
                      >
                        {getInitial(member.name)}
                      </div>
                    )}
                  </div>

                  {/* Name & Role */}
                  <div className={`space-y-2 ${compact ? 'flex-1 min-w-0' : 'w-full'}`}>
                    <h4 className={`${nameSizeClass} font-black text-neutral-950 leading-snug tracking-tight line-clamp-2`}>
                      {member.name}
                    </h4>
                    {/* NEVER hallucinate roles: only display if filled */}
                    {member.role && member.role.trim().length > 0 && (
                      <p className={`${roleSizeClass} font-bold text-emerald-950 leading-snug bg-emerald-100/90 py-1.5 px-4 rounded-2xl border border-emerald-300 inline-block max-w-full line-clamp-2 shadow-sm`}>
                        {member.role}
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

