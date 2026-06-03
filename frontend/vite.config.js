import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiProxy = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  },
  '/uploads': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
};

const repoBase = process.env.GITHUB_PAGES === 'true' ? '/AP-SCHOOL-V1/' : '/';

export default defineConfig({
  base: repoBase,
  plugins: [react()],
  server: {
    port: 3000,
    proxy: apiProxy
  },
  preview: {
    port: 4173,
    proxy: apiProxy
  }
});
