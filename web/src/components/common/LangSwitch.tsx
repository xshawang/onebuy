import { Segmented } from 'antd';
import { useSettings } from '@/stores/settings';

export default function LangSwitch() {
  const { locale, setLocale } = useSettings();
  return (
    <Segmented
      size="small"
      value={locale}
      onChange={(v) => setLocale(v as 'zh' | 'en')}
      options={[
        { label: '中文', value: 'zh' },
        { label: 'EN', value: 'en' },
      ]}
    />
  );
}
