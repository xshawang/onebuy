import type { Currency } from '@/stores/settings';

const RATES: Record<Currency, number> = {
  CNY: 1,
  USD: 0.14,
};

const SYMBOLS: Record<Currency, string> = {
  CNY: '¥',
  USD: '$',
};

export function convert(valueCNY: number, currency: Currency): number {
  return valueCNY * RATES[currency];
}

export function formatPrice(valueCNY: number, currency: Currency): string {
  return `${SYMBOLS[currency]}${convert(valueCNY, currency).toFixed(2)}`;
}

export function symbolOf(currency: Currency): string {
  return SYMBOLS[currency];
}
