import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Carousel, Spin, Row, Col, Tag, Card, Button } from 'antd';
import {
  SkinOutlined,
  ManOutlined,
  SmileOutlined,
  MobileOutlined,
  ThunderboltOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ProductGrid from '@/components/product/ProductGrid';
import Price from '@/components/common/Price';
import { getHotProducts, searchProducts, type Product } from '@/api/products';
import { getShippingLines, type ShippingLine } from '@/api/shipping';
import { useSettings } from '@/stores/settings';

const BANNERS = [
  {
    title: 'OneClick',
    sub: '专业中国代购 · 国际转运 · 跨境电商服务平台',
    bg: 'linear-gradient(135deg,#ff6900 0%,#ff9149 100%)',
  },
  {
    title: "What's Hot",
    sub: 'Top-rated items from Taobao & Tmall',
    bg: 'linear-gradient(135deg,#2b3a67 0%,#547bb4 100%)',
  },
  {
    title: '免费仓储 90 天',
    sub: '多单合并 · 真人验货 · 全球直达',
    bg: 'linear-gradient(135deg,#0f766e 0%,#34d399 100%)',
  },
];

const SERVICES = [
  { key: 'service1' },
  { key: 'service2' },
  { key: 'service3' },
  { key: 'service4' },
];

const CATEGORIES = [
  { key: 'cat_women', icon: <SkinOutlined />, color: '#ff6b9a' },
  { key: 'cat_men', icon: <ManOutlined />, color: '#3b82f6' },
  { key: 'cat_toys', icon: <SmileOutlined />, color: '#f59e0b' },
  { key: 'cat_digital', icon: <MobileOutlined />, color: '#14b8a6' },
  { key: 'cat_sports', icon: <ThunderboltOutlined />, color: '#ef4444' },
  { key: 'cat_home', icon: <HomeOutlined />, color: '#8b5cf6' },
];

export default function Home() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const locale = useSettings((s) => s.locale);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lines, setLines] = useState<ShippingLine[]>([]);

  useEffect(() => {
    setLoading(true);
    const p = q ? searchProducts(q) : getHotProducts();
    p.then(setProducts).finally(() => setLoading(false));
  }, [q]);

  useEffect(() => {
    getShippingLines().then((ls) => setLines(ls.slice(0, 3)));
  }, []);

  return (
    <div>
      {/* Banner */}
      <Carousel autoplay style={{ maxWidth: 1200, margin: '16px auto' }}>
        {BANNERS.map((b, i) => (
          <div key={i}>
            <div
              style={{
                height: 320,
                background: b.bg,
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: 2 }}>
                {b.title}
              </div>
              <div style={{ fontSize: 16, marginTop: 8, opacity: 0.9 }}>
                {b.sub}
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Services strip */}
      <div className="container" style={{ margin: '28px auto' }}>
        <Row gutter={[16, 16]}>
          {SERVICES.map((s) => (
            <Col key={s.key} xs={12} md={6}>
              <div
                style={{
                  background: '#fff7ed',
                  border: '1px solid #ffe4c4',
                  borderRadius: 8,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, color: '#ff6900' }}>
                  {t(`home.${s.key}`)}
                </div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginTop: 4 }}>
                  {t(`home.${s.key}desc`)}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Categories */}
      <div className="container" style={{ marginBottom: 32 }}>
        <h2 style={{ margin: '24px 0 16px', fontSize: 20 }}>
          {t('home.categories')}
        </h2>
        <Row gutter={[12, 12]}>
          {CATEGORIES.map((c) => (
            <Col key={c.key} xs={8} sm={8} md={4}>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  padding: 20,
                  textAlign: 'center',
                  transition: 'transform .15s, box-shadow .15s',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 28, color: c.color }}>{c.icon}</div>
                <div style={{ marginTop: 8, fontSize: 14, fontWeight: 500 }}>
                  {t(`home.${c.key}`)}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Shipping lines */}
      <div className="container" style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '8px 0 16px',
          }}
        >
          <h2 style={{ fontSize: 20, margin: 0 }}>{t('home.shippingTitle')}</h2>
          <Link to="/shipping">
            <Button type="link">{t('home.viewAll')} →</Button>
          </Link>
        </div>
        <div
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          {t('home.shippingSub')}
        </div>
        <Row gutter={[16, 16]}>
          {lines.map((l) => (
            <Col key={l.id} xs={24} sm={12} md={8}>
              <Link to={`/shipping/${l.id}`}>
                <Card hoverable style={{ height: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600 }}>
                      {locale === 'en' ? l.name_en : l.name_zh}
                    </div>
                    <span
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 12,
                      }}
                    >
                      {l.leadTimeDays} {t('shipping.days')}
                    </span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {(locale === 'en' ? l.tags_en : l.tags_zh).map((tg) => (
                      <Tag key={tg} color="orange">
                        {tg}
                      </Tag>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {l.countries.join(' / ')}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {t('shipping.firstKg')}{' '}
                    <Price valueCNY={l.firstKgCNY} strong />
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Hot grid */}
      <div className="container" style={{ marginBottom: 48 }}>
        <h2 style={{ margin: '24px 0 16px', fontSize: 20 }}>
          {q ? `"${q}"` : t('home.hot')}
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
