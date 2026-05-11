import { Row, Col, Empty } from 'antd';
import ProductCard from './ProductCard';
import type { Product } from '@/api/products';

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  if (!products.length) return <Empty style={{ margin: '40px 0' }} />;
  return (
    <Row gutter={[16, 16]}>
      {products.map((p) => (
        <Col key={p.id} xs={12} sm={8} md={6} lg={6} xl={4}>
          <ProductCard product={p} />
        </Col>
      ))}
    </Row>
  );
}
