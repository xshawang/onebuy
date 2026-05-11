import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Tag,
  Descriptions,
  Spin,
  Empty,
  Button,
  Divider,
  InputNumber,
  Statistic,
} from 'antd';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  SendOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  getShippingLine,
  type ShippingLine,
} from '@/api/shipping';
import { useSettings } from '@/stores/settings';
import { formatPrice } from '@/utils/currency';

export default function ShippingDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const locale = useSettings((s) => s.locale);
  const currency = useSettings((s) => s.currency);

  const [line, setLine] = useState<ShippingLine | null>(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState<number>(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getShippingLine(id)
      .then(setLine)
      .catch(() => setLine(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin />
      </div>
    );
  }

  if (!line) {
    return (
      <div style={{ padding: 80 }}>
        <Empty description={t('shippingDetail.notFound')} />
      </div>
    );
  }

  // 运费试算
  const firstKg = line.firstKgWeight / 1000;
  const billableKg = Math.max(weight, line.minKg);
  const extraUnits = Math.max(0, Math.ceil((billableKg - firstKg) / firstKg));
  const baseFee = line.firstKgCNY + extraUnits * line.pricePerKgCNY;
  const fuel = Math.round((baseFee * line.fuelSurchargePct) / 100);
  const op = Math.round((baseFee * line.operationFeePct) / 100);
  const total = baseFee + fuel + op + line.clearanceFeeCNY;

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg,#ff6900 0%,#ff9149 100%)',
          color: '#fff',
          padding: '40px 16px',
        }}
      >
        <div className="container">
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 8 }}>
            <Link to="/shipping" style={{ color: '#fff' }}>
              ← {t('shippingDetail.backList')}
            </Link>
          </div>
          <Row align="middle" justify="space-between" gutter={16}>
            <Col xs={24} md={16}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                {locale === 'en' ? line.name_en : line.name_zh}
              </div>
              <div style={{ marginTop: 8 }}>
                {(locale === 'en' ? line.tags_en : line.tags_zh).map((tg) => (
                  <Tag key={tg} color="#fff" style={{ color: '#ff6900' }}>
                    {tg}
                  </Tag>
                ))}
              </div>
              <div style={{ marginTop: 8, opacity: 0.9 }}>
                {locale === 'en' ? line.desc_en : line.desc_zh}
              </div>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                    <SendOutlined /> {t('shippingDetail.shipped')}
                  </span>
                }
                value={line.shippedCount}
                suffix={t('shippingDetail.times')}
                valueStyle={{ color: '#fff', fontSize: 28 }}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 16px' }}>
        <Row gutter={24}>
          {/* 左侧 参数 */}
          <Col xs={24} lg={16}>
            <Card title={t('shippingDetail.pricing')}>
              <Descriptions
                column={{ xs: 1, sm: 2 }}
                bordered
                size="middle"
                items={[
                  {
                    key: 'first',
                    label: `${t('shippingDetail.firstKgPrice')} (${line.firstKgWeight}g)`,
                    children: (
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        {formatPrice(line.firstKgCNY, currency)}
                      </span>
                    ),
                  },
                  {
                    key: 'extra',
                    label: `${t('shippingDetail.extraKgPrice')} (${line.firstKgWeight}g)`,
                    children: (
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        {formatPrice(line.pricePerKgCNY, currency)}
                      </span>
                    ),
                  },
                  {
                    key: 'fuel',
                    label: t('shippingDetail.fuel'),
                    children: `${line.fuelSurchargePct}%`,
                  },
                  {
                    key: 'clearance',
                    label: t('shippingDetail.clearance'),
                    children: formatPrice(line.clearanceFeeCNY, currency),
                  },
                  {
                    key: 'op',
                    label: t('shippingDetail.opFee'),
                    children: `${line.operationFeePct}%`,
                  },
                  {
                    key: 'weight',
                    label: t('shippingDetail.weightLimit'),
                    children: `${line.minKg}kg ~ ${line.maxKg}kg`,
                  },
                  {
                    key: 'size',
                    label: t('shippingDetail.sizeLimit'),
                    children: `≤ ${line.maxSizeCm}cm`,
                  },
                  {
                    key: 'lead',
                    label: (
                      <>
                        <ClockCircleOutlined /> {t('shippingDetail.leadTime')}
                      </>
                    ),
                    children: `${line.leadTimeDays} ${t('shipping.days')}`,
                  },
                  {
                    key: 'countries',
                    label: t('shipping.countries'),
                    children: line.countries.join(' / '),
                  },
                ]}
              />
            </Card>

            <Card title={t('shippingDetail.allowed')} style={{ marginTop: 16 }}>
              <Row gutter={[8, 8]}>
                {(locale === 'en' ? line.allowed_en : line.allowed_zh).map(
                  (a) => (
                    <Col key={a}>
                      <Tag
                        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                        color="green"
                      >
                        {a}
                      </Tag>
                    </Col>
                  ),
                )}
              </Row>
            </Card>

            <Card title={t('shippingDetail.restricted')} style={{ marginTop: 16 }}>
              <Row gutter={[8, 8]}>
                {(locale === 'en' ? line.restricted_en : line.restricted_zh).map(
                  (r) => (
                    <Col key={r}>
                      <Tag
                        icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                        color="red"
                      >
                        {r}
                      </Tag>
                    </Col>
                  ),
                )}
              </Row>
              <div
                style={{
                  marginTop: 12,
                  color: 'var(--color-text-secondary)',
                  fontSize: 12,
                }}
              >
                {t('shippingDetail.restrictedTip')}
              </div>
            </Card>
          </Col>

          {/* 右侧 试算器 */}
          <Col xs={24} lg={8}>
            <Card
              title={t('shippingDetail.quickQuote')}
              style={{ position: 'sticky', top: 16 }}
            >
              <div style={{ marginBottom: 8 }}>{t('shipping.weight')}</div>
              <InputNumber
                style={{ width: '100%' }}
                min={0.1}
                step={0.1}
                value={weight}
                onChange={(v) => setWeight(Number(v) || 0.1)}
                addonAfter="kg"
              />

              <Divider style={{ margin: '16px 0' }} />

              <Row justify="space-between" style={{ marginBottom: 6 }}>
                <Col>{t('shippingDetail.firstKgPrice')}</Col>
                <Col>{formatPrice(line.firstKgCNY, currency)}</Col>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 6 }}>
                <Col>
                  {t('shippingDetail.extraKgPrice')} × {extraUnits}
                </Col>
                <Col>
                  {formatPrice(extraUnits * line.pricePerKgCNY, currency)}
                </Col>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 6 }}>
                <Col>{t('shippingDetail.fuel')}</Col>
                <Col>{formatPrice(fuel, currency)}</Col>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 6 }}>
                <Col>{t('shippingDetail.opFee')}</Col>
                <Col>{formatPrice(op, currency)}</Col>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 6 }}>
                <Col>{t('shippingDetail.clearance')}</Col>
                <Col>{formatPrice(line.clearanceFeeCNY, currency)}</Col>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row justify="space-between" align="middle">
                <Col>{t('shippingDetail.total')}</Col>
                <Col>
                  <span
                    style={{
                      color: 'var(--color-primary)',
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(total, currency)}
                  </span>
                </Col>
              </Row>

              <Link to="/cart">
                <Button type="primary" size="large" block style={{ marginTop: 16 }}>
                  {t('shippingDetail.orderNow')}
                </Button>
              </Link>
              <Link to="/shipping">
                <Button type="default" block style={{ marginTop: 8 }}>
                  {t('shippingDetail.compareLines')}
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
