import type { Locale } from '@/stores/settings';

export function pickLocale<T>(
  locale: Locale,
  values: { zh: T; en: T },
): T {
  return values[locale];
}

export function truncate(s: string, n: number): string {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '...' : s;
}
