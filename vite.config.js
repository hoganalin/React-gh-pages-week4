import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // 根據環境模式設定 base 路徑
  base: process.env.NODE_ENV === 'production' ? '/React-gh-pages-week4/' : '/',
  plugins: [react()],
});