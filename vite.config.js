import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        architecture: 'js/core/index.js'
      },
      output: {
        manualChunks(id) {
          if (id.includes('js/domain/') || id.includes('js/application/')) {
            return 'domain';
          }
          if (id.includes('js/components/')) {
            return 'components';
          }
          if (id.includes('js/core/') || id.includes('js/services/') || id.includes('js/infrastructure/')) {
            return 'core';
          }
        }
      }
    }
  },
  server: {
    port: 8000,
    open: false
  }
});
