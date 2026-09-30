/**
 * Dynamic theme generation based on HSL primary hue
 */

export interface ThemeColors {
  hue: number;
  bgDark: string;
  surfaceDark: string;
  surfaceDarkCard: string;
  borderDark: string;
  brand: string;
  mint: string;
  mintSoft: string;
  bgLight: string;
  surfaceLight: string;
  borderLight: string;
  textLight: string;
  mutedLight: string;
  amber: string;
}

export interface PresetTheme {
  name: string;
  hue: number;
  previewColor: string;
  description: string;
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    name: 'سبز زمردی کاریز (پیش‌فرض)',
    hue: 168,
    previewColor: '#12806A',
    description: 'طبیعی، آرامش‌بخش و باطراوت، مناسب فضاهای باز و کارگاهی',
  },
  {
    name: 'سرمه‌ای فولاد مبارکه',
    hue: 215,
    previewColor: '#1A4C84',
    description: 'رسمی، استوار و نماد اعتماد و اقتدار صنعتی',
  },
  {
    name: 'فیروزه‌ای دانشگاهی',
    hue: 186,
    previewColor: '#0E7A8A',
    description: 'مدرن، پویا و همسو با نوآوری و محیط‌های آکادمیک',
  },
  {
    name: 'یشمی تیره سازمانی',
    hue: 152,
    previewColor: '#1A6B4B',
    description: 'کلاسیک، هماهنگ و ایجاد حس توازن و کار گروهی',
  },
  {
    name: 'آبی لاجوردی عمیق',
    hue: 232,
    previewColor: '#2B4294',
    description: 'عمیق و باوقار، مناسب همایش‌های مدیران ارشد',
  },
  {
    name: 'عنابی صنعتی',
    hue: 352,
    previewColor: '#8C2337',
    description: 'پرانرژی، مقتدر و نشان‌دهنده پویایی و شور تیمی',
  },
  {
    name: 'برنز و خردلی گرم',
    hue: 38,
    previewColor: '#8B5C14',
    description: 'خاکی، صمیمی و دارای حس میزبانی اصیل',
  },
];

export function getThemeColors(hue: number): ThemeColors {
  return {
    hue,
    bgDark: `hsl(${hue}, 75%, 7%)`,
    surfaceDark: `hsl(${hue}, 55%, 11%)`,
    surfaceDarkCard: `hsl(${hue}, 50%, 15%)`,
    borderDark: `hsl(${hue}, 40%, 20%)`,
    brand: `hsl(${hue}, 75%, 28%)`,
    mint: `hsl(${hue}, 70%, 54%)`,
    mintSoft: `hsla(${hue}, 70%, 54%, 0.15)`,
    bgLight: `hsl(${hue}, 28%, 96%)`,
    surfaceLight: '#ffffff',
    borderLight: `hsl(${hue}, 22%, 87%)`,
    textLight: `hsl(${hue}, 75%, 9%)`,
    mutedLight: `hsl(${hue}, 30%, 35%)`,
    amber: '#FFC15A',
  };
}

export function applyThemeVariables(hue: number) {
  const colors = getThemeColors(hue);
  const root = document.documentElement;

  root.style.setProperty('--primary-hue', String(hue));
  root.style.setProperty('--primary-bg-dark', colors.bgDark);
  root.style.setProperty('--primary-surface-dark', colors.surfaceDark);
  root.style.setProperty('--primary-border-dark', colors.borderDark);
  root.style.setProperty('--primary-brand', colors.brand);
  root.style.setProperty('--primary-mint', colors.mint);
  root.style.setProperty('--primary-bg-light', colors.bgLight);
  root.style.setProperty('--primary-surface-light', colors.surfaceLight);
  root.style.setProperty('--primary-border-light', colors.borderLight);
  root.style.setProperty('--primary-text-light', colors.textLight);
  root.style.setProperty('--primary-muted-light', colors.mutedLight);
  root.style.setProperty('--accent-amber', colors.amber);
}
