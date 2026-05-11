import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// 通过 VITE_BASE_PATH 可配置部署子路径；默认 '/'
// 例如部署到 /admin/ 时，.env.production 设置 VITE_BASE_PATH=/admin/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var base = env.VITE_BASE_PATH || '/';
    var port = Number(env.VITE_DEV_PORT) || 5175;
    return {
        base: base,
        plugins: [react()],
        resolve: {
            alias: { '@': path.resolve(__dirname, 'src') },
        },
        server: { port: port, open: true },
        preview: { port: port, open: true },
    };
});
