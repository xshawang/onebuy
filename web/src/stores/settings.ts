import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n';

export type Locale = 'zh' | 'en';
export type Currency = 'CNY' | 'USD';

interface SettingsState {
  locale: Locale;
  currency: Currency;
  setLocale: (l: Locale) => void;
  setCurrency: (c: Currency) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      locale: 'zh',
      currency: 'CNY',
      setLocale: (locale) => {
        i18n.changeLanguage(locale);
        set({ locale });
      },
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'superbuy-settings',
      onRehydrateStorage: () => (state) => {
        if (state?.locale) i18n.changeLanguage(state.locale);
      },
    },
  ),
);
