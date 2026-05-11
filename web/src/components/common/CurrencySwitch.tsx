import { Segmented } from 'antd';
import { useSettings } from '@/stores/settings';

export default function CurrencySwitch() {
  const { currency, setCurrency } = useSettings();
  return (
    <Segmented
      size="small"
      value={currency}
      onChange={(v) => setCurrency(v as 'CNY' | 'USD')}
      options={[
        { label: '¥ CNY', value: 'CNY' },
        { label: '$ USD', value: 'USD' },
      ]}
    />
  );
}
