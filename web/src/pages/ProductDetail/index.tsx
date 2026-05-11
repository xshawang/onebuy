import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Button,
  InputNumber,
  Tabs,
  Space,
  Tag,
  Spin,
  Empty,
  Steps,
  message,
} from 'antd';
import {
  LinkOutlined,
  DollarCircleOutlined,
  InboxOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Price from '@/components/common/Price';
import Gallery from '@/components/product/Gallery';
import SkuPicker from '@/components/product/SkuPicker';
import { getProduct, type Product } from '@/api/products';
import { useSettings } from '@/stores/settings';
import { useCart } from '@/stores/cart';

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useSettings((s) => s.locale);
  const addToCart = useCart((s) => s.add);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [skuId, setSkuId] = useState<string | undefined>();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(id)
      .then((p) => {
        setProduct(p);
        setSkuId(p.skus[0]?.id);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin />
      </div>
    );
  }
  if (!product) {
    return (
      <div style={{ padding: 80 }}>
        <Empty description={t('product.notFound')} />
      </div>
    );
  }

  const title = locale === 'en' ? product.title_en : product.title_zh;
  const descHtml =
    locale === 'en' ? product.descriptionHtml_en : product.descriptionHtml_zh;
  const currentSku = product.skus.find((s) => s.id === skuId) || product.skus[0];

  const handleAdd = () => {
    if (!currentSku) return;
    const skuLabel = `${locale === 'en' ? currentSku.color_en : currentSku.color_zh} / ${currentSku.size}`;
    addToCart({
      productId: product.id,
      title_zh: product.title_zh,
      title_en: product.title_en,
      image: product.images[0],
      priceCNY: product.priceCNY,
      sku: skuLabel,
      qty,
    });
    message.success(t('common.added'));
  };

  const handleBuyNow = () => {
    if (!currentSku) return;
    const skuLabel = `${locale === 'en' ? currentSku.color_en : currentSku.color_zh} / ${currentSku.size}`;
    addToCart({
      productId: product.id,
      title_zh: product.title_zh,
      title_en: product.title_en,
      image: product.images[0],
      priceCNY: product.priceCNY,
      sku: skuLabel,
      qty,
    });
    sessionStorage.setItem(
      'checkout-selected',
      JSON.stringify([`${product.id}__${skuLabel}`]),
    );
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <Row gutter={32}>
        <Col xs={24} md={10}>
          <Gallery images={product.images} alt={title} />
        </Col>
        <Col xs={24} md={14}>
          <h1 style={{ fontSize: 20, lineHeight: 1.5, margin: 0 }}>{title}</h1>
          <Space style={{ margin: '8px 0' }}>
            <Tag color="red">{t('product.from')} {product.from === 'tmall' ? t('product.tmall') : 'Taobao'}</Tag>
            <Tag color="orange">{t('product.freeStorage')}</Tag>
            <Tag color="green">{t('product.realCheck')}</Tag>
          </Space>
          <div
            style={{
              background: 'var(--color-bg-gray)',
              padding: 16,
              borderRadius: 4,
              margin: '12px 0',
            }}
          >
            <Price valueCNY={product.priceCNY} size="large" strong />
          </div>

          <SkuPicker skus={product.skus} value={skuId} onChange={setSkuId} />

          <div style={{ margin: '16px 0' }}>
            <span style={{ marginRight: 12, color: 'var(--color-text-secondary)' }}>
              {t('common.qty')}：
            </span>
            <InputNumber
              min={1}
              max={99}
              value={qty}
              onChange={(v) => setQty(Number(v) || 1)}
            />
          </div>

          <Space size="middle">
            <Button type="primary" size="large" onClick={handleBuyNow}>
              {t('common.buyNow')}
            </Button>
            <Button size="large" onClick={handleAdd}>
              {t('common.addToCart')}
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 代购与转运流程（对照 superbuy 原站） */}
      <div
        style={{
          marginTop: 32,
          padding: '24px 16px',
          background:
            'linear-gradient(135deg,#fff7ed 0%,#fff 60%)',
          border: '1px solid #ffe4c4',
          borderRadius: 8,
        }}
      >
        <h3 style={{ fontSize: 18, margin: '0 0 20px' }}>
          {t('shipping.processTitle')}
        </h3>
        <Steps
          current={-1}
          responsive
          items={[
            {
              title: t('shipping.step1'),
              description: t('shipping.step1desc'),
              icon: <LinkOutlined />,
            },
            {
              title: t('shipping.step2'),
              description: t('shipping.step2desc'),
              icon: <DollarCircleOutlined />,
            },
            {
              title: t('shipping.step3'),
              description: t('shipping.step3desc'),
              icon: <InboxOutlined />,
            },
            {
              title: t('shipping.step4'),
              description: t('shipping.step4desc'),
              icon: <GlobalOutlined />,
            },
          ]}
        />
      </div>

      <Tabs
        style={{ marginTop: 32 }}
        items={[
          {
            key: 'desc',
            label: t('product.desc'),
            children: (
              <div
                style={{ padding: 16 }}
                dangerouslySetInnerHTML={{ __html: descHtml }}
              />
            ),
          },
          {
            key: 'solutions',
            label: t('product.solutions'),
            children: (
              <Row gutter={[16, 16]} style={{ padding: 16 }}>
                {product.solutionIds.map((sid) => (
                  <Col key={sid} xs={24} sm={12}>
                    <Link to={`/solution/${sid}`}>
                      <div
                        style={{
                          border: '1px solid var(--color-border)',
                          borderRadius: 8,
                          padding: 20,
                          transition: 'border-color .2s',
                        }}
                      >
                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                          {sid === 'sol_premium'
                            ? locale === 'en'
                              ? 'Premium Reinforced Packaging'
                              : '加固打包方案'
                            : locale === 'en'
                              ? 'Standard Packaging'
                              : '标准打包方案'}
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            color: 'var(--color-text-secondary)',
                            fontSize: 12,
                          }}
                        >
                          {t('common.more')} →
                        </div>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            ),
          },
          {
            key: 'reviews',
            label: t('product.reviews'),
            children: (
              <div style={{ padding: 16, color: 'var(--color-text-secondary)' }}>
                {t('common.empty')}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
