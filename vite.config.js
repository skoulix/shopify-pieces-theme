import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'frontend',
  base: './',
  build: {
    outDir: '../assets',
    emptyOutDir: false,
    assetsDir: '',
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'frontend/js/app.js'),
      },
      output: {
        entryFileNames: 'pieces-[name].js',
        chunkFileNames: 'pieces-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'pieces-[name][extname]';
          }
          return 'pieces-[name][extname]';
        },
      },
    },
    minify: 'esbuild',
    sourcemap: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'frontend'),
      '@js': resolve(__dirname, 'frontend/js'),
      '@css': resolve(__dirname, 'frontend/css'),
      '@components': resolve(__dirname, 'frontend/js/components'),
      '@managers': resolve(__dirname, 'frontend/js/managers'),
      '@utils': resolve(__dirname, 'frontend/js/utils'),
    },
  },
});
