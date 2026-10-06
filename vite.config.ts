import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig(({mode}) => {
  const offline = mode === 'offline';
  return {
    // Offline mode: everything (JS, CSS, fonts) inlined into one HTML file
    plugins: [react(), tailwindcss(), ...(offline ? [viteSingleFile()] : [])],
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
