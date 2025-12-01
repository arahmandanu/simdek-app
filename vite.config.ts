import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost',
    },
  },
  plugins: [
    laravel({
      input: ['resources/sass/app.scss', 'resources/js/app.ts'],
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
    },
  },
});
