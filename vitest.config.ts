import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true, styles: 'none' })],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./resources/js/kiosk/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'resources/js/kiosk/__tests__/'],
    },
    css: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
    },
  },
});
