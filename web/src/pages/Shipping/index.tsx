import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Tag,
  Spin,
  Steps,
  InputNumber,
  Select,
  Button,
  Table,
  Empty,
} from 'antd';
import {
  LinkOutlined,
  DollarCircleOutlined,
  InboxOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  getShippingLines,
  quoteShipping,
  type ShippingLine,
  type QuoteItem,
} from '@/api/shipping';
import { useSettings } from '@/stores/settings';
import { formatPrice } from '@/utils/currency';

const COUNTRIES = [
  'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE',
  'CA', 'JP', 'KR', 'AU', 'NZ',
];

export default function Shipping() {
  const { t } = useTranslation();
  const locale = useSettings((s) => s.locale);
  const currency = useSettings((s) => s.currency);

  const [lines, setLines] = useState<ShippingLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('US');
  const [weight, setWeight] = useState<number>(1);
  const [quotes, setQuotes] = useState<QuoteItem[] | null>(null);
  const [quoting, setQuoting] = useState(false);

  useEffect(() => {
    getShippingLines()
      .then(setLines)
      .finally(() => setLoading(false));
  }, []);

  const handleQuote = async () => {
    setQuoting(true);
    try {
      const resp = await quoteShipping({ country, weightKg: weight });
      setQuotes(resp.quotes);
    } finally {
      setQuoting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background:
            'linear-gradient(135deg,#ff6900 0%,#ff9149 60%,#ffb26b 100%)',
          color: '#fff',
          padding: '56px 16px',
        }}
      >
        <div
          className="container"
          style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto' }}
        >
          <h1 style={{ color: '#fff', fontSize: 34, margin: 0 }}>
            {t('shipping.heroTitle')}
          </h1>
          <div style={{ marginTop: 12, fontSize: 16, opacity: 0.9 }}>
            {t('shipping.heroSub')}
          </div>
        </div>
      </div>

      {/* Flow */}
      <div className="container" style={{ padding: '36px 16px' }}>
        <h2 style={{ fontSize: 22, margin: '0 0 20px' }}>
          {t('shipping.flowTitle')}
        </h2>
        <Steps
          current={-1}
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

      {/* Calculator */}
      <div className="container" style={{ padding: '16px' }}>
        <Card title={t('shipping.calcTitle')}>
          <Row gutter={16} align="bottom">
            <Col xs={24} sm={8}>
              <div style={{ marginBottom: 6 }}>{t('shipping.country')}</div>
              <Select
                style={{ width: '100%' }}
                value={country}
                onChange={setCountry}
                options={COUNTRIES.map((c) => ({ value: c, label: c }))}
              />
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ marginBottom: 6 }}>{t('shipping.weight')}</div>
              <InputNumber
                style={{ width: '100%' }}
                min={0.1}
                step={0.1}
                value={weight}
                onChange={(v) => setWeight(Number(v) || 0.1)}
                addonAfter="kg"
              />
            </Col>
            <Col xs={24} sm={8}>
              <Button
                type="primary"
                size="large"
                loading={quoting}
                onClick={handleQuote}
                block
              >
                {t('shipping.calc')}
              </Button>
            </Col>
          </Row>

          {quotes !== null && (
            <div style={{ marginTop: 20 }}>
              {quotes.length === 0 ? (
                <Empty description={t('shipping.noLine')} />
              ) : (
                <Table
                  rowKey="lineId"
                  pagination={false}
                  dataSource={quotes}
                  columns={[
                    {
                      title: t('shipping.line'),
                      dataIndex: locale === 'en' ? 'name_en' : 'name_zh',
                      render: (v: string, r: QuoteItem) => (
                        <Link to={`/shipping/${r.lineId}`}>{v}</Link>
                      ),
                    },
                    {
                      title: t('shipping.lead'),
                      dataIndex: 'leadTimeDays',
                      render: (v: string) =>
                        `${v} ${t('shipping.days')}`,
                    },
                    {
                      title: t('shipping.fee'),
                      dataIndex: 'feeCNY',
                      render: (v: number) => (
                        <span
                          style={{
                            color: 'var(--color-primary)',
                            fontWeight: 600,
                          }}
                        >
                          {formatPrice(v, currency)}
                        </span>
                      ),
                    },
                  ]}
                />
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Lines */}
      <div className="container" style={{ padding: '24px 16px 48px' }}>
        <h2 style={{ fontSize: 22, margin: '8px 0 20px' }}>
          {t('shipping.linesTitle')}
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {lines.map((l) => (
              <Col key={l.id} xs={24} sm={12} lg={8}>
                <Link to={`/shipping/${l.id}`}>
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                    title={locale === 'en' ? l.name_en : l.name_zh}
                    extra={
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {l.leadTimeDays} {t('shipping.days')}
                      </span>
                    }
                  >
                    <div style={{ marginBottom: 8 }}>
                      {(locale === 'en' ? l.tags_en : l.tags_zh).map((tg) => (
                        <Tag key={tg} color="orange">
                          {tg}
                        </Tag>
                      ))}
                    </div>
                    <div
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 13,
                        minHeight: 44,
                      }}
                    >
                      {locale === 'en' ? l.desc_en : l.desc_zh}
                    </div>
                    <div style={{ marginTop: 12, fontSize: 13 }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {t('shipping.countries')}:{' '}
                      </span>
                      {l.countries.join(' / ')}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                      }}
                    >
                      {t('shipping.firstKg')} {formatPrice(l.firstKgCNY, currency)}
                      {' · '}
                      {t('shipping.perKg')} {formatPrice(l.pricePerKgCNY, currency)}
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
