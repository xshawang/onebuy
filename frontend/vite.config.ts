import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// 通过 VITE_BASE_PATH 可配置部署子路径；默认 '/'
// 例如部署到 /admin/ 时，.env.production 设置 VITE_BASE_PATH=/admin/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';
  const port = Number(env.VITE_DEV_PORT) || 5175;
  return {
    base,
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: { port, open: true },
    preview: { port, open: true },
  };
});
