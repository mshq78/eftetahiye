import React, { useState, useRef } from 'react';
import {
  EventConfig,
  LogoItem,
  ScheduleItem,
  TeamMember,
  PrincipleItem,
  SavedEvent,
} from '../../types';
import { defaultEventConfig } from '../../event.config';
import { PRESET_THEMES } from '../../utils/theme';
import { compressImage, toPersianDigits } from '../../utils/helpers';
import {
  X,
  FileText,
  Image as ImageIcon,
  Calendar,
  Users,
  LayoutGrid,
  Palette,
  FolderOpen,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Pin,
  Upload,
  Download,
  RotateCcw,
  Copy,
  AlertTriangle,
  Check,
  Search,
  UserCheck,
  UserX,
  UserPlus,
  CheckCheck,
} from 'lucide-react';

interface EditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: EventConfig;
  onChangeConfig: (newConfig: EventConfig) => void;
  savedEvents: SavedEvent[];
  activeEventId: string | null;
  onSaveCurrentEvent: (name: string) => void;
  onDuplicateEvent: (name: string) => void;
  onSwitchEvent: (event: SavedEvent) => void;
  onDeleteEvent: (id: string) => void;
  onResetToDefault: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
}

type TabType = 'info' | 'logos' | 'schedule' | 'team' | 'slides' | 'theme' | 'events';

export const EditorDrawer: React.FC<EditorDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  savedEvents,
  activeEventId,
  onSaveCurrentEvent,
  onDuplicateEvent,
  onSwitchEvent,
  onDeleteEvent,
  onResetToDefault,
  onExportJSON,
  onImportJSON,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [saveEventName, setSaveEventName] = useState('');
  const [duplicateEventName, setDuplicateEventName] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [teamSearch, setTeamSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<'all' | 'present' | 'absent'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Helper for updating nested config
  const updateConfig = (updater: (prev: EventConfig) => EventConfig) => {
    const next = updater(config);
    onChangeConfig(next);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[620px] bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col text-neutral-100 no-print transition-all duration-300">
      {/* Top Drawer Header */}
      <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur-md shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-mint)] animate-pulse" />
            تنظیمات زنده رویداد
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            تغییرات به صورت لحظه‌ای روی اسلایدها اعمال می‌شوند
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
          title="بستن پنل (Esc / E)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="px-4 py-2 border-b border-neutral-800 flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0 bg-neutral-950/60">
        {[
          { id: 'info', label: 'اطلاعات اصلی', icon: FileText },
          { id: 'logos', label: 'لوگوها', icon: ImageIcon },
          { id: 'schedule', label: 'برنامه زمانی', icon: Calendar },
          { id: 'team', label: 'تیم اجرایی', icon: Users },
          { id: 'slides', label: 'اسلایدها', icon: LayoutGrid },
          { id: 'theme', label: 'رنگ و ظاهر', icon: Palette },
          { id: 'events', label: 'مدیریت دوره‌ها', icon: FolderOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {/* ================= TAB 1: BASIC INFO ================= */}
        {activeTab === 'info' && (
          <div className="space-y-5">
            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400">هویت برند رویداد</h3>

              {/* Brand Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  نام رویداد / بوت‌کمپ (مثلاً «همتا»)
                </label>
                <input
                  type="text"
                  value={config.brand.name}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, name: e.target.value },
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                {config.brand.name.length > 25 && (
                  <p className="text-amber-400 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>نام طولانی ممکن است اندازه قلم روی جلد را بسیار کوچک کند.</span>
                  </p>
                )}
              </div>

              {/* Brand Prefix */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  پیشوند عنوان (مثلاً «بوت‌کمپ آموزشی»)
                </label>
                <input
                  type="text"
                  value={config.brand.prefix}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, prefix: e.target.value },
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  زیرعنوان رویداد (مثلاً «همدلی و توان‌افزایی»)
                </label>
                <input
                  type="text"
                  value={config.brand.subtitle}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, subtitle: e.target.value },
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Bismillah Toggle */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-neutral-300 font-semibold">
                  نمایش «بسم الله الرحمن الرحیم» روی جلد
                </span>
                <input
                  type="checkbox"
                  checked={config.brand.showBismillah}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, showBismillah: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                />
              </div>
            </div>

            {/* Organizer Info Box */}
            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <span>🏢</span>
                  <span>اطلاعات تیم برگزارکننده (مجری رویداد)</span>
                </h3>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  نمایش در اسلایدها
                </span>
              </div>

              {/* Organizer Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  نام مجموعه برگزارکننده (مثلاً «پردیس نوآوری گرا»)
                </label>
                <input
                  type="text"
                  value={config.organizer?.name ?? 'پردیس نوآوری گرا'}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      organizer: {
                        ...(prev.organizer || {
                          name: 'پردیس نوآوری گرا',
                          label: 'برگزارکننده',
                          subtitle: 'توسعه سرمایه انسانی و نوآوری سازمانی',
                          showOnCover: true,
                          showInFooter: true,
                          showInHeader: true,
                        }),
                        name: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {/* Organizer Label */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  عنوان نمایشی (مثلاً «برگزارکننده» یا «طراح و مجری رویداد»)
                </label>
                <input
                  type="text"
                  value={config.organizer?.label ?? 'برگزارکننده'}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      organizer: {
                        ...(prev.organizer || {
                          name: 'پردیس نوآوری گرا',
                          label: 'برگزارکننده',
                          subtitle: 'توسعه سرمایه انسانی و نوآوری سازمانی',
                          showOnCover: true,
                          showInFooter: true,
                          showInHeader: true,
                        }),
                        label: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Display Options */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-medium">
                    نمایش نشان برگزارکننده در صفحه جلد
                  </span>
                  <input
                    type="checkbox"
                    checked={config.organizer?.showOnCover !== false}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        organizer: {
                          ...(prev.organizer || {
                            name: 'پردیس نوآوری گرا',
                            label: 'برگزارکننده',
                            subtitle: 'توسعه سرمایه انسانی و نوآوری سازمانی',
                            showOnCover: true,
                            showInFooter: true,
                            showInHeader: true,
                          }),
                          showOnCover: e.target.checked,
                        },
                      }))
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-medium">
                    نمایش نام برگزارکننده در سربرگ اسلایدها
                  </span>
                  <input
                    type="checkbox"
                    checked={config.organizer?.showInHeader !== false}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        organizer: {
                          ...(prev.organizer || {
                            name: 'پردیس نوآوری گرا',
                            label: 'برگزارکننده',
                            subtitle: 'توسعه سرمایه انسانی و نوآوری سازمانی',
                            showOnCover: true,
                            showInFooter: true,
                            showInHeader: true,
                          }),
                          showInHeader: e.target.checked,
                        },
                      }))
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-medium">
                    نمایش نام برگزارکننده در پاورقی تمام اسلایدها
                  </span>
                  <input
                    type="checkbox"
                    checked={config.organizer?.showInFooter !== false}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        organizer: {
                          ...(prev.organizer || {
                            name: 'پردیس نوآوری گرا',
                            label: 'برگزارکننده',
                            subtitle: 'توسعه سرمایه انسانی و نوآوری سازمانی',
                            showOnCover: true,
                            showInFooter: true,
                            showInHeader: true,
                          }),
                          showInFooter: e.target.checked,
                        },
                      }))
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                  />
                </div>
              </div>
            </div>

            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400">مشتری و مکان</h3>

              {/* Client Org */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  نام سازمان مشتری (مثلاً «مجتمع فولاد مبارکه»)
                </label>
                <input
                  type="text"
                  value={config.clientOrg.name}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      clientOrg: { name: e.target.value },
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  محل برگزاری (اختیاری، مثلاً «مزرعه کاریز»)
                </label>
                <input
                  type="text"
                  value={config.venue}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      venue: e.target.value,
                    }))
                  }
                  placeholder="در صورت خالی بودن، متن اسلاید به صورت خودکار منطبق می‌شود"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Intro Text */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  متن معرفی روی جلد
                </label>
                <textarea
                  rows={3}
                  value={config.intro}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      intro: e.target.value,
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  آدرس لینکدین (LTR)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.linkedin}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LOGOS ================= */}
        {activeTab === 'logos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-400">لوگوهای نوار پایین جلد</h3>
                <p className="text-xs text-neutral-400">
                  حداکثر ۶ جایگاه لوگو (تصویر یا متن نام سازمان)
                </p>
              </div>
              {config.logos.length < 6 && (
                <button
                  type="button"
                  onClick={() => {
                    const newLogo: LogoItem = {
                      id: `logo-${Date.now()}`,
                      name: 'سازمان همکار',
                      pinned: false,
                    };
                    updateConfig((prev) => ({ ...prev, logos: [...prev.logos, newLogo] }));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن لوگو</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {config.logos.map((logo, idx) => (
                <div
                  key={logo.id}
                  className="bg-neutral-800/50 border border-neutral-700/80 rounded-2xl p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        #{toPersianDigits(idx + 1)}
                      </span>
                      <input
                        type="text"
                        value={logo.name}
                        onChange={(e) => {
                          const updated = [...config.logos];
                          updated[idx] = { ...logo, name: e.target.value };
                          updateConfig((prev) => ({ ...prev, logos: updated }));
                        }}
                        placeholder="نام سازمان"
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 flex-1"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Pinned toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...config.logos];
                          updated[idx] = { ...logo, pinned: !logo.pinned };
                          updateConfig((prev) => ({ ...prev, logos: updated }));
                        }}
                        className={`p-1.5 rounded-lg text-xs ${
                          logo.pinned
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-700 text-neutral-400 hover:text-white'
                        }`}
                        title="پین کردن (ثابت ماندن برای دوره‌های بعدی)"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Reorder Up */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...config.logos];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          updateConfig((prev) => ({ ...prev, logos: updated }));
                        }}
                        className="p-1.5 rounded-lg bg-neutral-700 text-neutral-300 hover:text-white disabled:opacity-30"
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Reorder Down */}
                      <button
                        type="button"
                        disabled={idx === config.logos.length - 1}
                        onClick={() => {
                          const updated = [...config.logos];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          updateConfig((prev) => ({ ...prev, logos: updated }));
                        }}
                        className="p-1.5 rounded-lg bg-neutral-700 text-neutral-300 hover:text-white disabled:opacity-30"
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.logos.filter((_, i) => i !== idx);
                          updateConfig((prev) => ({ ...prev, logos: updated }));
                        }}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Logo Image Slot & Upload */}
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-12 rounded-xl bg-white flex items-center justify-center p-1 border border-neutral-600 shrink-0">
                      {logo.imageDataUrl ? (
                        <img
                          src={logo.imageDataUrl}
                          alt={logo.name}
                          className="max-h-10 max-w-20 object-contain"
                        />
                      ) : (
                        <span className="text-neutral-500 text-[10px] font-bold text-center">
                          بدون تصویر
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-xl text-xs text-white transition-colors">
                        <Upload className="w-3 h-3" />
                        <span>آپلود تصویر</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImage(file, 500);
                                const updated = [...config.logos];
                                updated[idx] = { ...logo, imageDataUrl: compressed };
                                updateConfig((prev) => ({ ...prev, logos: updated }));
                                showNotice(`لوگوی «${logo.name}» با موفقیت فشرده و ذخیره شد.`);
                              } catch {
                                alert('خطا در پردازش تصویر لوگو');
                              }
                            }
                          }}
                        />
                      </label>

                      {logo.imageDataUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...config.logos];
                            updated[idx] = { ...logo, imageDataUrl: undefined };
                            updateConfig((prev) => ({ ...prev, logos: updated }));
                          }}
                          className="text-xs text-neutral-400 hover:text-red-400"
                        >
                          حذف تصویر
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: SCHEDULE ================= */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-400">ایستگاه‌های برنامه زمانی</h3>
                <p className="text-xs text-neutral-400">
                  ۳ تا ۱۲ آیتم — با فراتر رفتن از ۱۰ مورد خودکار به ۲ اسلاید تقسیم می‌شود
                </p>
              </div>
              {config.schedule.length < 12 && (
                <button
                  type="button"
                  onClick={() => {
                    const newItem: ScheduleItem = {
                      id: `s-${Date.now()}`,
                      title: 'فعالیت جدید',
                      time: '',
                      description: 'توضیحات کوتاه فعالیت',
                      icon: 'Sparkles',
                    };
                    updateConfig((prev) => ({
                      ...prev,
                      schedule: [...prev.schedule, newItem],
                    }));
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن ایستگاه</span>
                </button>
              )}
            </div>

            {/* Schedule Section Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                عنوان اسلاید برنامه زمانی
              </label>
              <input
                type="text"
                value={config.sectionTitles?.schedule || 'برنامه زمانی روز ما'}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    sectionTitles: { ...prev.sectionTitles, schedule: e.target.value },
                  }))
                }
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-3">
              {config.schedule.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-neutral-800/50 border border-neutral-700/80 rounded-2xl p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {toPersianDigits(idx + 1)}.
                      </span>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...config.schedule];
                          updated[idx] = { ...item, title: e.target.value };
                          updateConfig((prev) => ({ ...prev, schedule: updated }));
                        }}
                        placeholder="عنوان فعالیت"
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold flex-1"
                      />
                      <input
                        type="text"
                        value={item.time || ''}
                        onChange={(e) => {
                          const updated = [...config.schedule];
                          updated[idx] = { ...item, time: e.target.value };
                          updateConfig((prev) => ({ ...prev, schedule: updated }));
                        }}
                        placeholder="ساعت (مثلاً ۰۸:۳۰)"
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 w-28 text-center font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...config.schedule];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          updateConfig((prev) => ({ ...prev, schedule: updated }));
                        }}
                        className="p-1.5 rounded-lg bg-neutral-700 text-neutral-300 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.schedule.length - 1}
                        onClick={() => {
                          const updated = [...config.schedule];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          updateConfig((prev) => ({ ...prev, schedule: updated }));
                        }}
                        className="p-1.5 rounded-lg bg-neutral-700 text-neutral-300 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.schedule.filter((_, i) => i !== idx);
                          updateConfig((prev) => ({ ...prev, schedule: updated }));
                        }}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => {
                      const updated = [...config.schedule];
                      updated[idx] = { ...item, description: e.target.value };
                      updateConfig((prev) => ({ ...prev, schedule: updated }));
                    }}
                    placeholder="توضیح کوتاه فعالیت..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: TEAM ================= */}
        {activeTab === 'team' && (() => {
          const totalMembers = config.team.length;
          const presentMembers = config.team.filter((m) => m.present !== false);
          const absentMembers = config.team.filter((m) => m.present === false);

          // Filtered list based on search and tab filter
          const filteredTeam = config.team.filter((member) => {
            // Filter tab match
            if (teamFilter === 'present' && member.present === false) return false;
            if (teamFilter === 'absent' && member.present !== false) return false;
            // Search query match
            if (teamSearch.trim()) {
              const q = teamSearch.toLowerCase();
              const nameMatch = member.name.toLowerCase().includes(q);
              const roleMatch = (member.role || '').toLowerCase().includes(q);
              return nameMatch || roleMatch;
            }
            return true;
          });

          return (
            <div className="space-y-4">
              {/* Header & Description */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>مخزن اعضای تیم و تعیین حضور در این رویداد</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    تمام افراد را ثبت کنید و برای این رویداد مشخص کنید چه کسانی حضور دارند.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newMember: TeamMember = {
                      id: `t-${Date.now()}`,
                      name: 'عضو جدید',
                      role: '',
                      present: true,
                    };
                    updateConfig((prev) => ({
                      ...prev,
                      team: [newMember, ...prev.team],
                    }));
                    showNotice('عضو جدید به لیست افزوده شد.');
                  }}
                  className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>افزودن عضو جدید</span>
                </button>
              </div>

              {/* Attendance Statistics Summary */}
              <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-2.5 rounded-2xl border border-neutral-800 text-center">
                <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                  <div className="text-[11px] text-neutral-400 font-medium">کل اعضای ثبت‌شده</div>
                  <div className="text-base font-black text-white mt-0.5">{toPersianDigits(totalMembers)} نفر</div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>حاضر در این دوره</span>
                  </div>
                  <div className="text-base font-black text-emerald-300 mt-0.5">{toPersianDigits(presentMembers.length)} نفر</div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                  <div className="text-[11px] text-neutral-400 font-medium flex items-center justify-center gap-1">
                    <UserX className="w-3 h-3" />
                    <span>غایب در این دوره</span>
                  </div>
                  <div className="text-base font-black text-neutral-400 mt-0.5">{toPersianDigits(absentMembers.length)} نفر</div>
                </div>
              </div>

              {/* Batch Attendance Action Bar */}
              <div className="flex items-center justify-between gap-2 p-2 bg-neutral-800/40 rounded-xl border border-neutral-800 text-xs">
                <span className="text-neutral-400 text-[11px] font-semibold">اقدام دسته‌جمعی حضور:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      updateConfig((prev) => ({
                        ...prev,
                        team: prev.team.map((m) => ({ ...m, present: true })),
                      }));
                      showNotice('همه اعضا به عنوان حاضر در این رویداد علامت‌گذاری شدند.');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/40 rounded-lg text-[11px] font-bold transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>حضور همه</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateConfig((prev) => ({
                        ...prev,
                        team: prev.team.map((m) => ({ ...m, present: false })),
                      }));
                      showNotice('همه اعضا به عنوان غایب در این رویداد تنظیم شدند.');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 border border-neutral-600/50 rounded-lg text-[11px] font-bold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>عدم حضور همه</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    placeholder="جستجوی عضو بر اساس نام یا سمت..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pr-9 pl-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  {teamSearch && (
                    <button
                      type="button"
                      onClick={() => setTeamSearch('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTeamFilter('all')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                      teamFilter === 'all'
                        ? 'bg-neutral-700 text-white shadow-sm'
                        : 'bg-neutral-800/50 text-neutral-400 hover:text-white'
                    }`}
                  >
                    همه ({toPersianDigits(totalMembers)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeamFilter('present')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                      teamFilter === 'present'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30'
                    }`}
                  >
                    ✓ حاضرین ({toPersianDigits(presentMembers.length)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeamFilter('absent')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                      teamFilter === 'absent'
                        ? 'bg-neutral-700 text-white shadow-sm'
                        : 'bg-neutral-800/50 text-neutral-400 hover:text-white'
                    }`}
                  >
                    ✕ غایبین ({toPersianDigits(absentMembers.length)})
                  </button>
                </div>
              </div>

              {/* Team Slide Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  عنوان اسلاید تیم در ارائه (مثلاً «معرفی اعضای تیم» یا «راهبران و تسهیل‌گران»)
                </label>
                <input
                  type="text"
                  value={config.sectionTitles?.team || 'معرفی اعضای تیم'}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      sectionTitles: { ...prev.sectionTitles, team: e.target.value },
                    }))
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {filteredTeam.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-800/30 border border-neutral-800 rounded-2xl text-neutral-400 text-xs">
                    عضوی مطابق فیلتر یا جستجوی انتخابی یافت نشد.
                  </div>
                ) : (
                  filteredTeam.map((member) => {
                    const originalIndex = config.team.findIndex((m) => m.id === member.id);
                    const isPresent = member.present !== false;

                    return (
                      <div
                        key={member.id}
                        className={`border rounded-2xl p-3.5 space-y-3 transition-all duration-200 ${
                          isPresent
                            ? 'bg-neutral-800/70 border-emerald-600/40 shadow-sm'
                            : 'bg-neutral-900/60 border-neutral-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* Attendance Switch & Control Header */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-700/50">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...config.team];
                              updated[originalIndex] = {
                                ...member,
                                present: !isPresent,
                              };
                              updateConfig((prev) => ({ ...prev, team: updated }));
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all ${
                              isPresent
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 shadow-sm'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 hover:text-white'
                            }`}
                            title="برای تغییر وضعیت حضور در این رویداد کلیک کنید"
                          >
                            {isPresent ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>حاضر در این رویداد (نمایش در اسلاید)</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5 text-neutral-400" />
                                <span>عدم حضور در این رویداد (مخفی)</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={originalIndex === 0}
                              onClick={() => {
                                const updated = [...config.team];
                                const temp = updated[originalIndex - 1];
                                updated[originalIndex - 1] = updated[originalIndex];
                                updated[originalIndex] = temp;
                                updateConfig((prev) => ({ ...prev, team: updated }));
                              }}
                              className="p-1 rounded bg-neutral-700/70 text-neutral-300 hover:text-white disabled:opacity-20"
                              title="انتقال به بالا"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={originalIndex === config.team.length - 1}
                              onClick={() => {
                                const updated = [...config.team];
                                const temp = updated[originalIndex + 1];
                                updated[originalIndex + 1] = updated[originalIndex];
                                updated[originalIndex] = temp;
                                updateConfig((prev) => ({ ...prev, team: updated }));
                              }}
                              className="p-1 rounded bg-neutral-700/70 text-neutral-300 hover:text-white disabled:opacity-20"
                              title="انتقال به پایین"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = config.team.filter((_, i) => i !== originalIndex);
                                updateConfig((prev) => ({ ...prev, team: updated }));
                                showNotice(`عضو «${member.name}» حذف شد.`);
                              }}
                              className="p-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"
                              title="حذف عضو"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Member Details */}
                        <div className="flex items-center justify-between gap-3">
                          {/* Photo / Avatar */}
                          <div
                            className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 flex items-center justify-center font-bold text-base shadow-sm ${
                              isPresent
                                ? 'border-emerald-500 bg-gradient-to-tr from-emerald-800 to-teal-600 text-white'
                                : 'border-neutral-600 bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {member.photoDataUrl ? (
                              <img
                                src={member.photoDataUrl}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{member.name ? member.name[0] : '؟'}</span>
                            )}
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => {
                                const updated = [...config.team];
                                updated[originalIndex] = { ...member, name: e.target.value };
                                updateConfig((prev) => ({ ...prev, team: updated }));
                              }}
                              placeholder="نام و نام خانوادگی"
                              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                            />
                            <input
                              type="text"
                              value={member.role || ''}
                              onChange={(e) => {
                                const updated = [...config.team];
                                updated[originalIndex] = { ...member, role: e.target.value };
                                updateConfig((prev) => ({ ...prev, team: updated }));
                              }}
                              placeholder="سمت (اختیاری؛ در صورت خالی بودن حذف می‌شود)"
                              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div className="flex flex-col gap-1 shrink-0">
                            {/* Photo Upload */}
                            <label className="cursor-pointer text-[11px] text-emerald-400 hover:underline flex items-center justify-end gap-1">
                              <Upload className="w-3 h-3" />
                              <span>عکس</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const compressed = await compressImage(file, 400);
                                      const updated = [...config.team];
                                      updated[originalIndex] = { ...member, photoDataUrl: compressed };
                                      updateConfig((prev) => ({ ...prev, team: updated }));
                                      showNotice(`عکس ${member.name} با موفقیت بارگذاری شد.`);
                                    } catch {
                                      alert('خطا در بارگذاری عکس');
                                    }
                                  }
                                }}
                              />
                            </label>
                            {member.photoDataUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...config.team];
                                  updated[originalIndex] = { ...member, photoDataUrl: undefined };
                                  updateConfig((prev) => ({ ...prev, team: updated }));
                                }}
                                className="text-[10px] text-red-400 text-left hover:underline"
                              >
                                حذف عکس
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}

        {/* ================= TAB 5: SLIDES & MODULES ================= */}
        {activeTab === 'slides' && (
          <div className="space-y-5">
            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400">سوئیچ ماژول‌های اسلایدها</h3>
              <p className="text-xs text-neutral-400">
                اسلایدهای غیرفعال بلافاصله از اسلاید دک، نوار پیشرفت و نمای شبکه خارج می‌شوند
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  { key: 'whyWeAreHere', label: 'اسلاید ۴: چرا اینجاییم؟' },
                  { key: 'principles', label: 'اسلاید ۵: اصول ما در برند' },
                  { key: 'lunch', label: 'اسلاید ۷: مسابقه آشپزی و ناهار' },
                  { key: 'workshop', label: 'اسلاید ۸: کارگاه آموزشی و توان‌افزایی' },
                  { key: 'cafe', label: 'اسلاید ۹: کافه گفتگو و اختتامیه' },
                  { key: 'team', label: 'اسلاید ۱۰: معرفی اعضای تیم' },
                ].map((mod) => (
                  <label
                    key={mod.key}
                    className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-neutral-200">{mod.label}</span>
                    <input
                      type="checkbox"
                      checked={config.modules[mod.key as keyof EventConfig['modules']]}
                      onChange={(e) => {
                        const mKey = mod.key as keyof EventConfig['modules'];
                        updateConfig((prev) => ({
                          ...prev,
                          modules: { ...prev.modules, [mKey]: e.target.checked },
                        }));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Workshop Customization */}
            {config.modules.workshop && (
              <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400">تنظیمات اختصاصی کارگاه آموزشی</h3>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    موضوع کارگاه (اختیاری — به‌صورت نشان برجسته روی اسلاید کارگاه دیده می‌شود)
                  </label>
                  <input
                    type="text"
                    value={config.workshop?.topic || ''}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        workshop: { ...prev.workshop, topic: e.target.value },
                      }))
                    }
                    placeholder="مثلاً: توسعه ارتباطات موثر و حل تعارض"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Lunch Customization */}
            {config.modules.lunch && (
              <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400">تنظیمات اسلاید ناهار</h3>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    عنوان اسلاید ناهار
                  </label>
                  <input
                    type="text"
                    value={config.lunch?.title || ''}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        lunch: { ...prev.lunch, title: e.target.value },
                      }))
                    }
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    متن کادر کهربایی (نکته مهم)
                  </label>
                  <textarea
                    rows={2}
                    value={config.lunch?.note || ''}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        lunch: { ...prev.lunch, note: e.target.value },
                      }))
                    }
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Principles Customization */}
            {config.modules.principles && (
              <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400">اصول پنج‌گانه بنتو (Bento)</h3>
                <div className="space-y-2">
                  {config.principlesList.map((pr, idx) => (
                    <div key={pr.id} className="p-2.5 rounded-xl bg-neutral-900/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={pr.title}
                          onChange={(e) => {
                            const updated = [...config.principlesList];
                            updated[idx] = { ...pr, title: e.target.value };
                            updateConfig((prev) => ({ ...prev, principlesList: updated }));
                          }}
                          className="bg-transparent border-b border-neutral-700 text-xs text-white font-bold focus:outline-none focus:border-emerald-500 w-1/2"
                        />
                        <span className="text-[10px] text-neutral-500">
                          {idx === 0 ? 'کاشی بزرگ' : idx === 1 ? 'کاشی متوسط' : 'کاشی استاندارد'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={pr.description || ''}
                        onChange={(e) => {
                          const updated = [...config.principlesList];
                          updated[idx] = { ...pr, description: e.target.value };
                          updateConfig((prev) => ({ ...prev, principlesList: updated }));
                        }}
                        className="w-full bg-transparent text-[11px] text-neutral-400 focus:outline-none focus:text-neutral-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: THEME & COLOR ================= */}
        {activeTab === 'theme' && (
          <div className="space-y-5">
            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-emerald-400">رنگ اصلی برند (Primary Hue)</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  پالت کامل (تیره، روشن، کارت‌ها، سایه‌ها و رنگ نعنایی) بر اساس این رنگ با فرمول HSL بازتولید می‌شود.
                </p>
              </div>

              {/* Hue Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">درجه رنگ (Hue): {config.theme.primaryHue}°</span>
                  <div
                    className="w-6 h-6 rounded-full border border-white/40 shadow"
                    style={{ backgroundColor: `hsl(${config.theme.primaryHue}, 75%, 28%)` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={config.theme.primaryHue}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      theme: { primaryHue: parseInt(e.target.value, 10) },
                    }))
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Preset Color Themes */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-neutral-300 block">
                  پالت‌های آماده سازمانی:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_THEMES.map((theme) => {
                    const isSelected = config.theme.primaryHue === theme.hue;
                    return (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            theme: { primaryHue: theme.hue },
                          }))
                        }
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-right transition-all ${
                          isSelected
                            ? 'bg-neutral-800 border-emerald-500 shadow-md'
                            : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg shrink-0 border border-white/20 shadow-sm"
                          style={{ backgroundColor: theme.previewColor }}
                        />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-white">{theme.name}</h4>
                          <p className="text-[11px] text-neutral-400">{theme.description}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: EVENTS MANAGEMENT ================= */}
        {activeTab === 'events' && (
          <div className="space-y-5">
            {/* Save / Duplicate Current Event */}
            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400">ذخیره و همانندسازی دوره</h3>

              {/* Save Current */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300">
                  ذخیره رویداد فعلی در حافظه مرورگر
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={saveEventName}
                    onChange={(e) => setSaveEventName(e.target.value)}
                    placeholder={`مثلاً: ${config.brand.name} – دوره پاییز`}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const name = saveEventName.trim() || `${config.brand.name} – رویداد جدید`;
                      onSaveCurrentEvent(name);
                      setSaveEventName('');
                      showNotice(`رویداد «${name}» با موفقیت ذخیره شد.`);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    ذخیره رویداد
                  </button>
                </div>
              </div>

              {/* Duplicate as New Event */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="block text-xs font-semibold text-neutral-300">
                  کپی به عنوان رویداد جدید (برای تغییرات دوره بعد)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={duplicateEventName}
                    onChange={(e) => setDuplicateEventName(e.target.value)}
                    placeholder={`کپی از ${config.brand.name}`}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const name = duplicateEventName.trim() || `نسخه جدید از ${config.brand.name}`;
                      onDuplicateEvent(name);
                      setDuplicateEventName('');
                      showNotice(`یک نسخه جدید با نام «${name}» ساخته شد.`);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی رویداد</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of Saved Events */}
            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400">دوره‌های ذخیره‌شده شما</h3>

              <div className="space-y-2">
                {savedEvents.map((evt) => {
                  const isActive = evt.id === activeEventId;
                  return (
                    <div
                      key={evt.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-emerald-950/40 border-emerald-500'
                          : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{evt.name}</h4>
                          {isActive && (
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                              فعال
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          سازمان: {evt.config.clientOrg.name} | محل: {evt.config.venue || 'نامشخص'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => {
                              onSwitchEvent(evt);
                              showNotice(`رویداد «${evt.name}» بارگذاری شد.`);
                            }}
                            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs"
                          >
                            انتخاب
                          </button>
                        )}
                        {savedEvents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`آیا از حذف رویداد «${evt.name}» اطمینان دارید؟`)) {
                                onDeleteEvent(evt.id);
                                showNotice(`رویداد حذف شد.`);
                              }
                            }}
                            className="p-1 rounded-lg text-neutral-500 hover:text-red-400"
                            title="حذف این دوره"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* JSON Export & Import */}
            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400">ورودی و خروجی فایل JSON</h3>
              <p className="text-xs text-neutral-400">
                می‌توانید تمامی تنظیمات و تصاویر فشرده‌شده را در یک فایل JSON مستقل برای استفاده در رایانه دیگر یا ارسال به تیم ذخیره و بارگذاری نمایید.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onExportJSON}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold border border-neutral-700 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>دریافت فایل JSON</span>
                </button>

                <label className="cursor-pointer flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold border border-neutral-700 transition-colors">
                  <Upload className="w-4 h-4 text-teal-400" />
                  <span>بارگذاری فایل JSON</span>
                  <input
                    ref={jsonInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImportJSON(file);
                        showNotice('فایل رویداد با موفقیت بارگذاری شد.');
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>

              {/* Reset to Default */}
              <div className="pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('آیا مطمئن هستید که می‌خواهید تمامی تنظیمات به حالت پیش‌فرض اولیه (همتا - فولاد مبارکه) بازگردد؟')) {
                      onResetToDefault();
                      showNotice('تنظیمات به حالت اولیه بازگشت.');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>بازگشت به پیش‌فرض اولیه با تأیید</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
