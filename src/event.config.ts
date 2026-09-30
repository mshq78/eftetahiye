import { EventConfig } from './types';

export const defaultEventConfig: EventConfig = {
  brand: {
    name: 'همتا',
    prefix: 'بوت‌کمپ آموزشی',
    subtitle: 'همدلی و توان‌افزایی',
    showBismillah: true,
  },
  organizer: {
    name: 'پردیس نوآوری گرا',
    label: 'برگزارکننده',
    subtitle: 'توسعه سرمایه انسانی و نوآوری سازمانی',
    showOnCover: true,
    showInFooter: true,
    showInHeader: true,
  },
  intro:
    'این رویداد فرصتی است برای تقویت روحیه تیمی، آشنایی بیشتر با یکدیگر و توسعه مهارت‌های سازمانی. در طول روز، فعالیت‌های متنوعی را تجربه خواهید کرد که هم سرگرم‌کننده و هم آموزنده هستند.',
  venue: 'مزرعه کاریز',
  clientOrg: {
    name: 'مجتمع فولاد مبارکه',
  },
  logos: [
    {
      id: 'logo-1',
      name: 'همتا',
      pinned: false,
    },
    {
      id: 'logo-2',
      name: 'مجتمع فولاد مبارکه',
      pinned: false,
    },
    {
      id: 'logo-3',
      name: 'دانشگاه اصفهان',
      pinned: false,
    },
    {
      id: 'logo-4',
      name: 'پردیس نوآوری گرا',
      pinned: true,
    },
  ],
  linkedin: 'linkedin.com/company/igera-ir',
  modules: {
    whyWeAreHere: true,
    principles: true,
    lunch: true,
    workshop: true,
    cafe: true,
    team: true,
  },
  principlesList: [
    {
      id: 'p-1',
      title: 'احترام متقابل',
      description: 'پذیرش دیدگاه‌های متفاوت، گوش سپردن فعال و ایجاد بستری امن برای مشارکت همدلانه همه اعضای گروه.',
      size: 'large',
    },
    {
      id: 'p-2',
      title: 'روحیه مثبت',
      description: 'تمرکز بر فرصت‌ها و راهکارها، اشتیاق به یادگیری مشترک و تزریق انرژی سازنده به جمع.',
      size: 'medium',
    },
    {
      id: 'p-3',
      title: 'حضور در لحظه',
      description: 'تمرکز تمام‌عیار بر فضای کنونی رویداد و همراهی ذهنی و عاطفی در تک‌تک چالش‌ها.',
      size: 'small',
    },
    {
      id: 'p-4',
      title: 'قانون زمان',
      description: 'وقت‌شناسی فردی و گروهی و تعهد راسخ به جدول زمان‌بندی ایستگاه‌های رویداد.',
      size: 'small',
    },
    {
      id: 'p-5',
      title: 'مراقبت از محیط',
      description: 'حفظ آراستگی، نظم، ایمنی و پاسداشت صمیمانه طبیعت و زیرساخت‌های محل میزبانی.',
      size: 'small',
    },
  ],
  schedule: [
    {
      id: 's-1',
      title: 'مراسم افتتاحیه و گروه‌بندی',
      time: '۰۸:۳۰',
      description: 'پذیرش، خوش‌آمدگویی و تشکیل تیم‌های چالش',
      icon: 'Flag',
    },
    {
      id: 's-2',
      title: 'بازی‌های سازمانی',
      time: '۰۹:۴۵',
      description: 'چالش‌های تعاملی تقویت هماهنگی و تفکر استراتژیک',
      icon: 'Gamepad2',
    },
    {
      id: 's-3',
      title: 'مسابقه آشپزی گروهی و صرف ناهار',
      time: '۱۲:۳۰',
      description: 'هنر همکاری تیمی، پخت خلاقانه و ناهار مشترک',
      icon: 'UtensilsCrossed',
    },
    {
      id: 's-4',
      title: 'صرف میان‌وعده و نماز جماعت',
      time: '۱۴:۳۰',
      description: 'استراحت کوتاه، فریضه نماز و گفتگوهای غیررسمی',
      icon: 'Coffee',
    },
    {
      id: 's-5',
      title: 'کارگاه آموزشی',
      time: '۱۵:۱۵',
      description: 'یادگیری تجربی و توسعه مهارت‌های حرفه‌ای در عمل',
      icon: 'GraduationCap',
    },
    {
      id: 's-6',
      title: 'کافه گفتگو و مراسم اختتامیه',
      time: '۱۷:۰۰',
      description: 'گفتگوی باز با مدیران ارشد، ارزیابی و تقدیر از تیم‌ها',
      icon: 'MessagesSquare',
    },
  ],
  workshop: {
    topic: 'توسعه ارتباطات موثر و حل مشارکتی تعارض در محیط کار',
  },
  lunch: {
    title: 'امروز ناهار ما دست‌پخت خود شماست!',
    description:
      'در این بخش هیجان‌انگیز از برنامه، هر تیم فرصت دارد تا مهارت‌های آشپزی خود را به نمایش بگذارد. این فعالیت نه تنها سرگرم‌کننده است، بلکه نیازمند همکاری، برنامه‌ریزی و خلاقیت گروهی است.',
    note:
      'نکته مهم: رتبه تیم شما در بازی‌های صبحگاهی، در انتخاب مواد اولیه تأثیرگذار خواهد بود؛ پس در فعالیت‌های صبح تلاش کنید برنده باشید!',
  },
  team: [
    {
      id: 't-1',
      name: 'علی بلورفروش',
      role: 'راهبر ارشد رویداد',
      present: true,
    },
    {
      id: 't-2',
      name: 'علیرضا رضایی',
      role: 'تسهیل‌گر و مشاور سازمانی',
      present: true,
    },
    {
      id: 't-3',
      name: 'سید حامد حسینی',
      role: 'تسهیل‌گر بازی‌های گروهی',
      present: true,
    },
    {
      id: 't-4',
      name: 'محمد مهدی پورجلالی',
      role: 'هماهنگ‌کننده اجرایی',
      present: true,
    },
    {
      id: 't-5',
      name: 'سروش جدیدی',
      role: 'مربی کارگاه مهارت‌های نرم',
      present: true,
    },
    {
      id: 't-6',
      name: 'دکتر امیر قمرانی',
      role: 'سخنران و مشاور ارشد تحول',
      present: true,
    },
  ],
  sectionTitles: {
    team: 'معرفی اعضای تیم',
    schedule: 'برنامه زمانی روز ما',
  },
  theme: {
    primaryHue: 168, // Deep Emerald
  },
};
