import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Spin, Steps, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import Price from '@/components/common/Price';
import { getSolution, type Solution } from '@/api/solutions';
import { useSettings } from '@/stores/settings';

export default function SolutionDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const locale = useSettings((s) => s.locale);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSolution(id)
      .then(setSolution)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin />
      </div>
    );
  }
  if (!solution) return null;

  const title = locale === 'en' ? solution.title_en : solution.title_zh;
  const desc = locale === 'en' ? solution.desc_en : solution.desc_zh;
  const flow = locale === 'en' ? solution.flow_en : solution.flow_zh;

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg,#fff7ed 0%,#ffe4c4 100%)',
          padding: 32,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>{title}</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
          {desc}
        </p>
        <div style={{ marginTop: 12 }}>
          <span style={{ marginRight: 8, color: 'var(--color-text-secondary)' }}>
            {t('solution.price')}：
          </span>
          <Price valueCNY={solution.priceCNY} size="large" strong />
        </div>
      </div>

      <h2 style={{ fontSize: 18, margin: '24px 0 16px' }}>
        {t('solution.options')}
      </h2>
      <Row gutter={[16, 16]}>
        {solution.options.map((opt) => (
          <Col key={opt.key} xs={12} sm={8} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <img
                src={opt.icon}
                alt={opt.key}
                style={{ width: 64, height: 64, margin: '0 auto' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/images/default.png';
                }}
              />
              <div style={{ fontSize: 13, marginTop: 8 }}>
                {locale === 'en' ? opt.label_en : opt.label_zh}
              </div>
              <div style={{ marginTop: 4 }}>
                {opt.feeCNY === 0 ? (
                  <span style={{ color: '#52c41a', fontSize: 12 }}>Free</span>
                ) : (
                  <Price valueCNY={opt.feeCNY} size="small" />
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <h2 style={{ fontSize: 18, margin: '32px 0 16px' }}>
        {t('solution.flow')}
      </h2>
      <Steps
        current={flow.length - 1}
        items={flow.map((step) => ({ title: step }))}
      />
    </div>
  );
}
