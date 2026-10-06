// Rename the single-file build to a friendly name and add a short README for the USB stick.
import { renameSync, writeFileSync, statSync, existsSync } from 'node:fs';

const dir = 'dist-offline';
if (!existsSync(`${dir}/index.html`)) throw new Error('dist-offline/index.html not found');
renameSync(`${dir}/index.html`, `${dir}/presentation.html`);
writeFileSync(
  `${dir}/README.txt`,
  [
    'نسخه آفلاین ارائه',
    '==================',
    '',
    '1) فایل presentation.html را روی فلش کپی کنید.',
    '2) روی رایانه مقصد با Chrome یا Edge (ترجیحاً) باز کنید؛ نیازی به اینترنت یا نصب چیزی نیست.',
    '3) کلیدها: ← / Space بعدی، → قبلی، F تمام‌صفحه، G نمای شبکه، E تنظیمات، H نوار کنترل.',
    '',
    'نکته: تغییراتی که در پنل تنظیمات می‌دهید فقط در همان مرورگرِ همان رایانه ذخیره می‌شود.',
    'برای انتقال به رایانه دیگر: تنظیمات ← مدیریت دوره‌ها ← «دریافت فایل JSON» و روی رایانه دیگر «بارگذاری فایل JSON».',
    '',
  ].join('\n'),
);
console.log(`dist-offline/presentation.html  ${(statSync(`${dir}/presentation.html`).size / 1024).toFixed(0)} KB`);
