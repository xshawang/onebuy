/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用访问路径前缀（Base Path），必须以 / 开头结尾。例：'/' 或 '/admin/' */
  readonly VITE_BASE_PATH: string;
  /** 开发服务器端口 */
  readonly VITE_DEV_PORT: string;
  /** 应用标题 */
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
