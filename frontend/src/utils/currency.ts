import type { Currency, Locale, I18nText, Money } from '@/types';

// 固定汇率（演示用，1 CNY = ?）
const RATES: Record<Currency, number> = {
  CNY: 1,
  USD: 0.14,
  EUR: 0.13,
  JPY: 21,
  GBP: 0.11,
};

const SYMBOLS: Record<Currency, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
};

export const CURRENCY_OPTIONS: { label: string; value: Currency }[] = [
  { label: 'CNY 人民币', value: 'CNY' },
  { label: 'USD 美元', value: 'USD' },
  { label: 'EUR 欧元', value: 'EUR' },
  { label: 'JPY 日元', value: 'JPY' },
  { label: 'GBP 英镑', value: 'GBP' },
];

// 按币种格式化金额（不换算）
export function formatMoney(m: Money): string {
  if (!m) return '-';
  const digits = m.currency === 'JPY' ? 0 : 2;
  return `${SYMBOLS[m.currency]}${m.amount.toFixed(digits)} ${m.currency}`;
}

// 换算到目标币种
export function convertTo(m: Money, target: Currency): Money {
  const cny = m.amount / RATES[m.currency];
  return { amount: +(cny * RATES[target]).toFixed(2), currency: target };
}

export function pickI18n(t: I18nText | undefined, locale: Locale = 'zh'): string {
  if (!t) return '';
  return t[locale] || t.zh || t.en || '';
}
