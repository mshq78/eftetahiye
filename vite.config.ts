import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig(({mode}) => {
  const offline = mode === 'offline';

  // Optional final config baked into the offline file:
  //   OFFLINE_CONFIG=./final.json npm run build:offline   (or put offline-config.json in the repo root)
  let embedded: string | null = null;
  if (offline) {
    const file = process.env.OFFLINE_CONFIG || (fs.existsSync('offline-config.json') ? 'offline-config.json' : '');
    if (file) {
      const text = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(text); // fail the build early on a broken file
      if (!parsed || typeof parsed !== 'object' || !parsed.brand || !Array.isArray(parsed.schedule)) {
        throw new Error(`${file}: not a valid exported event config`);
      }
      embedded = JSON.stringify(parsed);
      console.log(`Embedding config from ${file}`);
    }
  }
  return {
    // Offline mode: everything (JS, CSS, fonts) inlined into one HTML file
    plugins: [react(), tailwindcss(), ...(offline ? [viteSingleFile()] : [])],
    // "<" is escaped so that embedded text can never close the inline <script>
    define: {
      __EMBEDDED_CONFIG__: embedded ? JSON.stringify(embedded).replace(/</g, '\\u003c') : 'null',
    },
    base: offline ? './' : '/',
    build: offline
      ? {outDir: 'dist-offline', assetsInlineLimit: 100000000, cssCodeSplit: false}
      : {},
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
