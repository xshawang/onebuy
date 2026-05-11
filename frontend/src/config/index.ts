// 应用配置统一入口：所有可配置项集中在此，页面通过 @/config 使用
// 底层来自 Vite 的 import.meta.env（VITE_ 前缀的环境变量）

/**
 * 应用访问路径前缀（Base Path）
 * - Vite 会据此解析打包后的静态资源 URL
 * - 如需部署到子路径，请在 .env.production 修改 VITE_BASE_PATH
 * - 必须以 / 开头，以 / 结尾
 */
export const BASE_PATH: string = import.meta.env.BASE_URL || '/';

/** 应用标题 */
export const APP_TITLE: string = import.meta.env.VITE_APP_TITLE || 'OneClick Admin';

/** 是否为开发模式 */
export const IS_DEV: boolean = import.meta.env.DEV;

/**
 * 去掉结尾斜杠的 Base Path，方便与其它路径拼接
 * 例：'/admin/' -> '/admin'；'/' -> ''
 */
export const BASE_PATH_NO_SLASH: string = BASE_PATH.replace(/\/$/, '');

export default {
  BASE_PATH,
  BASE_PATH_NO_SLASH,
  APP_TITLE,
  IS_DEV,
};
