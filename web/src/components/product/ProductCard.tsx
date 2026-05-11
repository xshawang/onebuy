import { Card } from 'antd';
import { Link } from 'react-router-dom';
import Price from '@/components/common/Price';
import { useSettings } from '@/stores/settings';
import type { Product } from '@/api/products';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const locale = useSettings((s) => s.locale);
  const title = locale === 'en' ? product.title_en : product.title_zh;
  return (
    <Link to={`/product/${product.id}`}>
      <Card
        hoverable
        cover={
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              background: '#f5f5f5',
            }}
          >
            <img
              src={product.images[0]}
              alt={title}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  '/images/default.png';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        }
        bodyStyle={{ padding: 12 }}
      >
        <div
          style={{
            fontSize: 13,
            height: 40,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <Price valueCNY={product.priceCNY} strong />
      </Card>
    </Link>
  );
}
