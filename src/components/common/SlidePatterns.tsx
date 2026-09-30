import React from 'react';

export type PatternType =
  | 'persian-star'
  | 'architectural-grid'
  | 'topographic'
  | 'hexagonal'
  | 'isometric-nodes'
  | 'concentric-rings'
  | 'dots-matrix'
  | 'drafting-cross';

interface SlidePatternsProps {
  type?: PatternType;
  isDark?: boolean;
  opacity?: number;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'corner-split' | 'sides';
}

/**
 * SlidePatterns: Elegant, subtle, localized background pattern accents.
 * Designed to gracefully eliminate the feeling of empty negative space
 * without cluttering or covering the entire screen like a wallpaper.
 */
export const SlidePatterns: React.FC<SlidePatternsProps> = ({
  type = 'persian-star',
  isDark = false,
  opacity,
  className = '',
  position = 'top-left',
}) => {
  // Very subtle opacity so it never distracts or overpowers
  const defaultOpacity = isDark ? 0.14 : 0.10;
  const currentOpacity = opacity ?? defaultOpacity;

  const strokeColor = isDark ? '#34d399' : '#059669'; // emerald-400 : emerald-600
  const fillColor = isDark ? '#10b981' : '#047857';

  // Smooth radial mask so the pattern softly fades into the background and only occupies negative space
  const getMaskStyle = () => {
    switch (position) {
      case 'top-left':
        return {
          maskImage: 'radial-gradient(circle at 10% 12%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 10% 12%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
        };
      case 'top-right':
        return {
          maskImage: 'radial-gradient(circle at 90% 12%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 90% 12%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
        };
      case 'bottom-right':
        return {
          maskImage: 'radial-gradient(circle at 90% 88%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 90% 88%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
        };
      case 'bottom-left':
        return {
          maskImage: 'radial-gradient(circle at 10% 88%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 10% 88%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
        };
      case 'sides':
        return {
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,1) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,1) 100%)',
        };
      case 'corner-split':
      default:
        return {
          maskImage:
            'radial-gradient(circle at 8% 8%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%), radial-gradient(circle at 92% 90%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%)',
          WebkitMaskImage:
            'radial-gradient(circle at 8% 8%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%), radial-gradient(circle at 92% 90%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%)',
        };
    }
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none transition-opacity duration-300 ${className}`}
      style={{
        opacity: currentOpacity,
        ...getMaskStyle(),
      }}
    >
      {/* 1. PERSIAN STAR GEOMETRIC (Girih Motif) */}
      {type === 'persian-star' && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="pattern-persian-star-subtle"
              x="0"
              y="0"
              width="140"
              height="140"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M70 24 L79 51 L107 51 L85 68 L93 96 L70 79 L47 96 L55 68 L33 51 L61 51 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeOpacity={isDark ? '0.7' : '0.6'}
              />
              <path
                d="M70 0 L140 70 L70 140 L0 70 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="0.8"
                strokeDasharray="4 4"
                strokeOpacity={isDark ? '0.4' : '0.35'}
              />
              <circle cx="70" cy="70" r="3.5" fill={fillColor} fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-persian-star-subtle)" />
        </svg>
      )}

      {/* 2. ARCHITECTURAL MICRO-GRID WITH CROSSHAIRS */}
      {type === 'architectural-grid' && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="pattern-arch-grid-subtle"
              x="0"
              y="0"
              width="90"
              height="90"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 90 0 L 0 0 0 90"
                fill="none"
                stroke={strokeColor}
                strokeWidth="0.75"
                strokeOpacity={isDark ? '0.4' : '0.35'}
              />
              <path
                d="M -5 0 L 5 0 M 0 -5 L 0 5 M 85 90 L 95 90 M 90 85 L 90 95"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
                strokeOpacity={isDark ? '0.7' : '0.6'}
              />
              <circle cx="45" cy="45" r="1.5" fill={fillColor} fillOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-arch-grid-subtle)" />
        </svg>
      )}

      {/* 3. TOPOGRAPHIC / ORGANIC ELEVATION CONTOURS */}
      {type === 'topographic' && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50 180 C280 120 480 320 900 240 C1300 160 1550 420 1980 300"
            stroke={strokeColor}
            strokeWidth="1.4"
            strokeDasharray="8 8"
            strokeOpacity={isDark ? '0.6' : '0.5'}
          />
          <path
            d="M-50 280 C300 220 500 420 900 340 C1300 260 1570 520 1980 400"
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeOpacity={isDark ? '0.45' : '0.4'}
          />
          <path
            d="M-50 390 C320 330 520 530 900 450 C1300 370 1590 630 1980 510"
            stroke={strokeColor}
            strokeWidth="1.4"
            strokeOpacity={isDark ? '0.5' : '0.45'}
          />
        </svg>
      )}

      {/* 4. HEXAGONAL HONEYCOMB */}
      {type === 'hexagonal' && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="pattern-hex-subtle"
              x="0"
              y="0"
              width="104"
              height="180"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 52 0 L 104 30 L 104 90 L 52 120 L 0 90 L 0 30 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
                strokeOpacity={isDark ? '0.5' : '0.4'}
              />
              <circle cx="52" cy="0" r="2.5" fill={fillColor} fillOpacity="0.4" />
              <circle cx="52" cy="120" r="2.5" fill={fillColor} fillOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-hex-subtle)" />
        </svg>
      )}

      {/* 5. ISOMETRIC NODES */}
      {type === 'isometric-nodes' && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="pattern-isometric-subtle"
              x="0"
              y="0"
              width="90"
              height="155.88"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 45 0 L 90 25.98 L 90 77.94 L 45 103.92 L 0 77.94 L 0 25.98 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="0.9"
                strokeOpacity={isDark ? '0.5' : '0.4'}
              />
              <circle cx="45" cy="51.96" r="2.5" fill={fillColor} fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-isometric-subtle)" />
        </svg>
      )}

      {/* 6. CONCENTRIC RINGS */}
      {type === 'concentric-rings' && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="1700" cy="200" r="180" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="5 7" strokeOpacity="0.4" />
          <circle cx="1700" cy="200" r="280" stroke={strokeColor} strokeWidth="0.8" strokeOpacity="0.25" />
          <circle cx="220" cy="880" r="150" stroke={strokeColor} strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.35" />
          <circle cx="220" cy="880" r="240" stroke={strokeColor} strokeWidth="0.8" strokeOpacity="0.2" />
        </svg>
      )}

      {/* 7. DOTS MATRIX */}
      {type === 'dots-matrix' && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="pattern-dots-subtle"
              x="0"
              y="0"
              width="44"
              height="44"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="22" cy="22" r="1.5" fill={fillColor} fillOpacity={isDark ? '0.5' : '0.4'} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-dots-subtle)" />
        </svg>
      )}

      {/* 8. DRAFTING CROSS */}
      {type === 'drafting-cross' && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="pattern-drafting-subtle"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="50" cy="50" r="14" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeOpacity={isDark ? '0.45' : '0.35'} />
              <path
                d="M 44 50 L 56 50 M 50 44 L 50 56"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
                strokeOpacity={isDark ? '0.6' : '0.5'}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-drafting-subtle)" />
        </svg>
      )}
    </div>
  );
};
