import { useAuth } from '@/stores/auth';

export async function apiGet<T = unknown>(url: string): Promise<T> {
  const token = useAuth.getState().token;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

export async function apiPost<T = unknown>(url: string, body: unknown): Promise<T> {
  const token = useAuth.getState().token;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `POST ${url} -> ${res.status}`);
  }
  return res.json();
}
