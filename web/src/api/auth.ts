import { apiPost } from './client';
import type { AuthUser } from '@/stores/auth';

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const login = (username: string, password: string) =>
  apiPost<AuthResponse>('/api/auth/login', { username, password });

export const register = (email: string, password: string, country?: string) =>
  apiPost<AuthResponse>('/api/auth/register', { email, password, country });
