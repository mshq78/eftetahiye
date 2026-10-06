import { EventConfig, SlideItem, ScheduleItem, TeamMember } from '../types';

/**
 * Convert Latin numerals to Persian numerals
 */
export function toPersianDigits(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Replace template variables {{brand}}, {{venue}}, {{clientOrg}}, {{prefix}}, {{subtitle}}
 */
export function renderTemplate(template: string, config: EventConfig): string {
  if (!template) return '';
  return template
    .replace(/\{\{\s*brand\s*\}\}/g, config.brand.name || '')
    .replace(/\{\{\s*venue\s*\}\}/g, config.venue || '')
    .replace(/\{\{\s*clientOrg\s*\}\}/g, config.clientOrg.name || '')
    .replace(/\{\{\s*organizer\s*\}\}/g, config.organizer?.name || '')
    .replace(/\{\{\s*prefix\s*\}\}/g, config.brand.prefix || '')
    .replace(/\{\{\s*subtitle\s*\}\}/g, config.brand.subtitle || '');
}

/**
 * Compress and resize uploaded image to maximum dimension (default 500px)
 * to keep stored size lightweight in localStorage/IndexedDB.
 */
export function compressImage(file: File, maxDim = 500, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('خطا در بارگذاری تصویر'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // e.g. SVG without intrinsic size: keep the original data URL
        if (!width || !height) {
          resolve(e.target?.result as string);
          return;
        }

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);
        // Try WebP first for great compression, fallback to JPEG
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // fallback
        }
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generate the list of active slides according to config modules & pagination rules
 */
export function generateActiveSlides(config: EventConfig): SlideItem[] {
  const slides: SlideItem[] = [];

  // 1. Cover Slide (always active, dark)
  slides.push({
    id: 'slide-cover',
    type: 'cover',
    title: config.brand.name || 'جلد رویداد',
    isDark: true,
  });

  // 2. Intro Slide: آماده اتفاقات تازه باشید! (always active, light)
  slides.push({
    id: 'slide-intro',
    type: 'intro',
    title: 'آماده اتفاقات تازه باشید!',
    isDark: false,
  });

  // 3. Impact Quote Slide (always active, dark)
  slides.push({
    id: 'slide-impact',
    type: 'impact',
    title: 'چشم‌انداز مشترک',
    isDark: true,
  });

  // 4. Why We Are Here Slide (optional module, light)
  if (config.modules.whyWeAreHere) {
    slides.push({
      id: 'slide-why-we-are-here',
      type: 'whyWeAreHere',
      title: 'چرا اینجاییم؟',
      isDark: false,
      moduleKey: 'whyWeAreHere',
    });
  }

  // 5. Principles Slide (optional module, dark)
  if (config.modules.principles) {
    slides.push({
      id: 'slide-principles',
      type: 'principles',
      title: `اصول ما در ${config.brand.name}`,
      isDark: true,
      moduleKey: 'principles',
    });
  }

  // 6. Schedule Slide(s) (always active, light)
  // Dynamic split if items > 10
  const scheduleItems = config.schedule || [];
  if (scheduleItems.length > 10) {
    const half = Math.ceil(scheduleItems.length / 2);
    slides.push({
      id: 'slide-schedule-part-1',
      type: 'schedule',
      title: config.sectionTitles.schedule || 'برنامه زمانی روز ما',
      isDark: false,
      part: 1,
      totalParts: 2,
      itemsSubset: scheduleItems.slice(0, half) as ScheduleItem[],
    });
    slides.push({
      id: 'slide-schedule-part-2',
      type: 'schedule',
      title: `${config.sectionTitles.schedule || 'برنامه زمانی روز ما'} (ادامه)`,
      isDark: false,
      part: 2,
      totalParts: 2,
      itemsSubset: scheduleItems.slice(half) as ScheduleItem[],
    });
  } else {
    slides.push({
      id: 'slide-schedule',
      type: 'schedule',
      title: config.sectionTitles.schedule || 'برنامه زمانی روز ما',
      isDark: false,
      part: 1,
      totalParts: 1,
      itemsSubset: scheduleItems,
    });
  }

  // 7. Lunch Slide (optional module, dark)
  if (config.modules.lunch) {
    slides.push({
      id: 'slide-lunch',
      type: 'lunch',
      title: config.lunch.title || 'مسابقه آشپزی و ناهار',
      isDark: true,
      moduleKey: 'lunch',
    });
  }

  // 8. Workshop Slide (optional module, light)
  if (config.modules.workshop) {
    slides.push({
      id: 'slide-workshop',
      type: 'workshop',
      title: 'آموزش و توسعه مهارتی',
      isDark: false,
      moduleKey: 'workshop',
    });
  }

  // 9. Cafe Slide (optional module, dark)
  if (config.modules.cafe) {
    slides.push({
      id: 'slide-cafe',
      type: 'cafe',
      title: config.sectionTitles?.cafe || 'کافه گفتگو: فرصتی برای شنیده شدن',
      isDark: true,
      moduleKey: 'cafe',
    });
  }

  // 10. Team Slide(s) (optional module, light)
  // Only show members who are attending this specific event (present !== false)
  // Dynamic split if items > 12
  if (config.modules.team) {
    const allMembers = config.team || [];
    const presentMembers = allMembers.filter((m) => m.present !== false);
    const teamTitle = config.sectionTitles?.team || 'معرفی اعضای تیم';

    if (presentMembers.length > 12) {
      const half = Math.ceil(presentMembers.length / 2);
      slides.push({
        id: 'slide-team-part-1',
        type: 'team',
        title: teamTitle,
        isDark: false,
        moduleKey: 'team',
        part: 1,
        totalParts: 2,
        itemsSubset: presentMembers.slice(0, half) as TeamMember[],
      });
      slides.push({
        id: 'slide-team-part-2',
        type: 'team',
        title: `${teamTitle} (ادامه)`,
        isDark: false,
        moduleKey: 'team',
        part: 2,
        totalParts: 2,
        itemsSubset: presentMembers.slice(half) as TeamMember[],
      });
    } else {
      slides.push({
        id: 'slide-team',
        type: 'team',
        title: teamTitle,
        isDark: false,
        moduleKey: 'team',
        part: 1,
        totalParts: 1,
        itemsSubset: presentMembers,
      });
    }
  }

  return slides;
}

/**
 * Pick an appropriate icon key for schedule item based on title keywords
 */
export function getScheduleIconKey(title: string, userIcon?: string): string {
  if (userIcon && userIcon !== 'auto') return userIcon;
  const t = title.toLowerCase();
  if (t.includes('آشپز') || t.includes('غذا') || t.includes('ناهار') || t.includes('شام')) {
    return 'UtensilsCrossed';
  }
  if (t.includes('بازی') || t.includes('چالش') || t.includes('مسابقه') || t.includes('گروهی')) {
    return 'Gamepad2';
  }
  if (t.includes('کارگاه') || t.includes('آموزش') || t.includes('یادگیری') || t.includes('تمرین')) {
    return 'GraduationCap';
  }
  if (t.includes('نماز') || t.includes('استراحت') || t.includes('میان‌') || t.includes('چای') || t.includes('پذیرایی')) {
    return 'Coffee';
  }
  if (t.includes('کافه') || t.includes('گفتگو') || t.includes('هم‌اندیشی') || t.includes('اختتامیه') || t.includes('مدیر')) {
    return 'MessagesSquare';
  }
  if (t.includes('افتتاح') || t.includes('آغاز') || t.includes('گروه‌بندی') || t.includes('پذیرش')) {
    return 'Flag';
  }
  if (t.includes('هدف') || t.includes('ماموریت') || t.includes('استراتژی')) {
    return 'Target';
  }
  return 'Sparkles';
}

/**
 * True if an image is mostly light (e.g. a white logo with transparent
 * background) and would be invisible on a white card.
 */
export function isLightImage(dataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(false);
    img.onload = () => {
      try {
        const size = 48;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(false);
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let sum = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 40) continue; // ignore transparent pixels
          sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          count++;
        }
        // Fully opaque light images (white background JPEG) look fine on white
        const opaqueRatio = count / (size * size);
        resolve(count > 0 && opaqueRatio < 0.97 && sum / count > 200);
      } catch {
        resolve(false);
      }
    };
    img.src = dataUrl;
  });
}
