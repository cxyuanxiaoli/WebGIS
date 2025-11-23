import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 2000,
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: 'js/bundle.[hash].js',
        chunkFileNames: 'js/[name].chunk.js',
        manualChunks: (id) => {
          if (id.includes('node_modules/vue')) {
            return 'vendor_vue';
          } else if (id.includes('node_modules/echarts')) {
            return 'vendor_echarts';
          } else if (id.includes('node_modules/@kjgl77/datav-vue3')) {
            return 'vendor_datav';
          } else if (id.includes('node_modules/axios')) {
            return 'vendor_axios';
          } else if (id.includes('node_modules/vue-echarts')) {
            return 'vendor_vue_echarts';
          } else if (id.includes('node_modules')) {
            return 'vendor_other';
          }
        },
      },
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.js'],
  },
  plugins: [vue()],
});
