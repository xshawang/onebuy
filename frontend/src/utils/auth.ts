// 极简登录态管理：用 localStorage 保存当前用户
import { users } from '@/mock/db';
import type { User } from '@/types';

const KEY = 'oneclick_admin_user';
// 演示用统一密码（真实项目请走后端）
const DEFAULT_PWD = '123456';

export function login(username: string, password: string): User | null {
  if (password !== DEFAULT_PWD) return null;
  const u = users.find((x) => x.username === username && x.status === 'active');
  if (!u) return null;
  localStorage.setItem(KEY, JSON.stringify(u));
  return u;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export function isLoggedIn(): boolean {
  return !!getCurrentUser();
}
