import { useMemo } from 'react';
import { Radio, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/stores/settings';
import type { Sku } from '@/api/products';

const { Text } = Typography;

interface Props {
  skus: Sku[];
  value?: string;
  onChange: (skuId: string) => void;
}

export default function SkuPicker({ skus, value, onChange }: Props) {
  const { t } = useTranslation();
  const locale = useSettings((s) => s.locale);

  const colors = useMemo(() => {
    const seen = new Set<string>();
    return skus.filter((s) => {
      const k = locale === 'en' ? s.color_en : s.color_zh;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [skus, locale]);

  const sizes = useMemo(() => {
    const seen = new Set<string>();
    return skus.filter((s) => {
      if (seen.has(s.size)) return false;
      seen.add(s.size);
      return true;
    });
  }, [skus]);

  const current = skus.find((s) => s.id === value);

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Text type="secondary">{t('product.color')}：</Text>
        <Radio.Group
          value={current ? (locale === 'en' ? current.color_en : current.color_zh) : undefined}
          onChange={(e) => {
            const picked = skus.find(
              (s) => (locale === 'en' ? s.color_en : s.color_zh) === e.target.value,
            );
            if (picked) onChange(picked.id);
          }}
          style={{ marginLeft: 8 }}
        >
          {colors.map((s) => (
            <Radio.Button
              key={s.id}
              value={locale === 'en' ? s.color_en : s.color_zh}
            >
              {locale === 'en' ? s.color_en : s.color_zh}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <div>
        <Text type="secondary">{t('product.size')}：</Text>
        <Radio.Group
          value={current?.size}
          onChange={(e) => {
            const picked = skus.find((s) => s.size === e.target.value);
            if (picked) onChange(picked.id);
          }}
          style={{ marginLeft: 8 }}
        >
          {sizes.map((s) => (
            <Radio.Button key={s.id + s.size} value={s.size}>
              {s.size}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    </Space>
  );
}
