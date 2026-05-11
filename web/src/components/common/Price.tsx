import { useSettings } from '@/stores/settings';
import { formatPrice } from '@/utils/currency';

interface Props {
  valueCNY: number;
  size?: 'small' | 'normal' | 'large';
  strong?: boolean;
}

export default function Price({ valueCNY, size = 'normal', strong }: Props) {
  const currency = useSettings((s) => s.currency);
  const fontSize = size === 'large' ? 22 : size === 'small' ? 12 : 14;
  return (
    <span
      style={{
        color: 'var(--color-primary)',
        fontSize,
        fontWeight: strong ? 600 : 400,
      }}
    >
      {formatPrice(valueCNY, currency)}
    </span>
  );
}
