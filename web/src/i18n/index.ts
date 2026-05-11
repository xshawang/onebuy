import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './zh.json';
import en from './en.json';

const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
const initial = stored === 'en' ? 'en' : 'zh';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    lng: initial,
    fallbackLng: 'zh',
    interpolation: { escapeValue: false },
  });

export default i18n;
