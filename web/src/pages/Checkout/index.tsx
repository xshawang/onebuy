import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Radio,
  Button,
  Divider,
  Spin,
  Result,
  message,
  Space,
  Checkbox,
  Tag,
  Collapse,
} from 'antd';
import {
  ShoppingOutlined,
  GlobalOutlined,
  StarOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCart, type CartItem } from '@/stores/cart';
import { useAuth } from '@/stores/auth';
import { useSettings } from '@/stores/settings';
import { getSolution, type Solution } from '@/api/solutions';
import { placeOrder } from '@/api/orders';
import { formatPrice } from '@/utils/currency';

const SOLUTION_IDS = ['sol_standard', 'sol_premium'];
const SHIPPING_BY_COUNTRY: Record<string, number> = {
  CN: 20,
  US: 120,
  GB: 110,
  DE: 100,
  FR: 100,
  JP: 60,
  KR: 50,
  CA: 130,
};

// 结算页常用增值服务（可多选）
const VALUE_SERVICES: Array<{
  id: string;
  priceCNY: number;
  i18n: string;
  descI18n: string;
  recommended?: boolean;
}> = [
  { id: 'photo', priceCNY: 3, i18n: 'pricing.vs.photo', descI18n: 'pricing.vs.photoDesc', recommended: true },
  { id: 'recheck', priceCNY: 5, i18n: 'pricing.vs.recheck', descI18n: 'pricing.vs.recheckDesc', recommended: true },
  { id: 'seal', priceCNY: 3, i18n: 'pricing.vs.seal', descI18n: 'pricing.vs.sealDesc' },
  { id: 'tryon', priceCNY: 20, i18n: 'pricing.vs.tryon', descI18n: 'pricing.vs.tryonDesc' },
  { id: 'removeTag', priceCNY: 2, i18n: 'pricing.vs.removeTag', descI18n: 'pricing.vs.removeTagDesc' },
  { id: 'powerOn', priceCNY: 10, i18n: 'pricing.vs.powerOn', descI18n: 'pricing.vs.powerOnDesc' },
  { id: 'bubble', priceCNY: 5, i18n: 'pricing.vs.bubble', descI18n: 'pricing.vs.bubbleDesc' },
  { id: 'epe', priceCNY: 5, i18n: 'pricing.vs.epe', descI18n: 'pricing.vs.epeDesc' },
  { id: 'damp', priceCNY: 5, i18n: 'pricing.vs.damp', descI18n: 'pricing.vs.dampDesc' },
  { id: 'stretch', priceCNY: 5, i18n: 'pricing.vs.stretch', descI18n: 'pricing.vs.stretchDesc' },
  { id: 'priority', priceCNY: 8, i18n: 'pricing.vs.priority', descI18n: 'pricing.vs.priorityDesc' },
  { id: 'packVideo', priceCNY: 8, i18n: 'pricing.vs.packVideo', descI18n: 'pricing.vs.packVideoDesc' },
];

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.remove);
  const locale = useSettings((s) => s.locale);
  const currency = useSettings((s) => s.currency);

  const [form] = Form.useForm();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [solutionId, setSolutionId] = useState<string>('sol_standard');
  const [country, setCountry] = useState<string>(user?.country || 'US');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  // 默认勾选 2 个推荐增值服务
  const [valueIds, setValueIds] = useState<string[]>(['photo', 'recheck']);

  // 登录拦截
  useEffect(() => {
    if (!token) {
      message.info(t('auth.needLogin'));
      navigate('/login?redirect=/checkout');
    }
  }, [token, navigate, t]);

  // 从购物车里取出被选中要结算的商品
  const checkoutItems = useMemo<CartItem[]>(() => {
    const raw = sessionStorage.getItem('checkout-selected');
    if (!raw) return items;
    try {
      const keys = JSON.parse(raw) as string[];
      const picked = items.filter((i) =>
        keys.includes(`${i.productId}__${i.sku}`),
      );
      return picked.length ? picked : items;
    } catch {
      return items;
    }
  }, [items]);

  useEffect(() => {
    Promise.all(SOLUTION_IDS.map((id) => getSolution(id))).then(setSolutions);
  }, []);

  const itemsCNY = checkoutItems.reduce(
    (s, i) => s + i.priceCNY * i.qty,
    0,
  );
  const currentSolution = solutions.find((s) => s.id === solutionId);
  const packFeeCNY = currentSolution?.priceCNY || 0;
  const shippingCNY = SHIPPING_BY_COUNTRY[country] ?? 80;
  // 转运费用 = 国际运费 + 打包方案费
  const forwardingCNY = shippingCNY + packFeeCNY;
  // 选中的增值服务明细
  const pickedValueServices = VALUE_SERVICES.filter((v) =>
    valueIds.includes(v.id),
  );
  const valueServicesCNY = pickedValueServices.reduce(
    (s, v) => s + v.priceCNY,
    0,
  );
  const totalCNY = itemsCNY + forwardingCNY + valueServicesCNY;

  const onSubmit = async () => {
    if (!checkoutItems.length) {
      message.warning(t('checkout.emptyTip'));
      return;
    }
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const resp = await placeOrder({
        items: checkoutItems,
        address: {
          name: values.name,
          phone: values.phone,
          country: values.country,
          address: values.addr,
          zip: values.zip,
        },
        solutionId,
        packFeeCNY,
        shippingCNY,
        itemsCNY,
        valueServices: pickedValueServices.map((v) => ({
          id: v.id,
          priceCNY: v.priceCNY,
        })),
        valueServicesCNY,
        totalCNY,
      });
      // 清空已下单的商品
      checkoutItems.forEach((i) => removeItem(i.productId, i.sku));
      sessionStorage.removeItem('checkout-selected');
      setOrderId(resp.orderId);
    } catch (e: unknown) {
      // 校验失败不提示
      if ((e as { errorFields?: unknown })?.errorFields) return;
      message.error('Failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <Result
          status="success"
          title={t('checkout.success', { id: orderId })}
          extra={
            <Space>
              <Button type="primary" onClick={() => navigate('/')}>
                {t('checkout.backHome')}
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h2 style={{ fontSize: 22, margin: '8px 0 16px' }}>
        {t('checkout.title')}
      </h2>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          {/* 地址 */}
          <Card title={t('checkout.address')} style={{ marginBottom: 16 }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: user?.username || '',
                country: user?.country || 'US',
                phone: '',
                addr: '',
                zip: '',
              }}
              onValuesChange={(changed) => {
                if (changed.country) setCountry(changed.country);
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label={t('checkout.name')}
                    rules={[
                      { required: true, message: t('checkout.nameRequired') },
                    ]}
                  >
                    <Input placeholder={t('checkout.name')} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label={t('checkout.phone')}
                    rules={[
                      { required: true, message: t('checkout.phoneRequired') },
                    ]}
                  >
                    <Input placeholder={t('checkout.phone')} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="country"
                    label={t('checkout.country')}
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        { value: 'CN', label: locale === 'en' ? 'China' : '中国' },
                        { value: 'US', label: locale === 'en' ? 'United States' : '美国' },
                        { value: 'GB', label: locale === 'en' ? 'United Kingdom' : '英国' },
                        { value: 'DE', label: locale === 'en' ? 'Germany' : '德国' },
                        { value: 'FR', label: locale === 'en' ? 'France' : '法国' },
                        { value: 'JP', label: locale === 'en' ? 'Japan' : '日本' },
                        { value: 'KR', label: locale === 'en' ? 'Korea' : '韩国' },
                        { value: 'CA', label: locale === 'en' ? 'Canada' : '加拿大' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="zip" label={t('checkout.zip')}>
                    <Input placeholder={t('checkout.zip')} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="addr"
                    label={t('checkout.addr')}
                    rules={[
                      { required: true, message: t('checkout.addrRequired') },
                    ]}
                  >
                    <Input.TextArea rows={2} placeholder={t('checkout.addr')} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 打包方案 */}
          <Card title={t('checkout.packaging')} style={{ marginBottom: 16 }}>
            {solutions.length === 0 ? (
              <Spin />
            ) : (
              <Radio.Group
                value={solutionId}
                onChange={(e) => setSolutionId(e.target.value)}
                style={{ width: '100%' }}
              >
                <Row gutter={[12, 12]}>
                  {solutions.map((s) => (
                    <Col key={s.id} xs={24} sm={12}>
                      <Radio.Button
                        value={s.id}
                        style={{
                          width: '100%',
                          height: 'auto',
                          padding: 16,
                          textAlign: 'left',
                          whiteSpace: 'normal',
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 600 }}>
                          {locale === 'en' ? s.title_en : s.title_zh}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--color-text-secondary)',
                            marginTop: 6,
                          }}
                        >
                          {locale === 'en' ? s.desc_en : s.desc_zh}
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            color: 'var(--color-primary)',
                            fontWeight: 600,
                          }}
                        >
                          {s.priceCNY === 0
                            ? locale === 'en'
                              ? 'Free'
                              : '免费'
                            : formatPrice(s.priceCNY, currency)}
                        </div>
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
            )}
          </Card>

          {/* 商品列表 */}
          <Card title={t('cart.product')}>
            {checkoutItems.map((i) => (
              <div
                key={`${i.productId}__${i.sku}`}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px dashed var(--color-border)',
                }}
              >
                <img
                  src={i.image}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/images/default.png';
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 4,
                    background: '#f5f5f5',
                  }}
                />
                <div style={{ flex: 1, fontSize: 13 }}>
                  <div>{locale === 'en' ? i.title_en : i.title_zh}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                      marginTop: 4,
                    }}
                  >
                    {i.sku} × {i.qty}
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>
                  {formatPrice(i.priceCNY * i.qty, currency)}
                </div>
              </div>
            ))}
            {checkoutItems.length === 0 && (
              <div style={{ color: 'var(--color-text-secondary)', padding: 20 }}>
                {t('checkout.emptyTip')}
              </div>
            )}
          </Card>

          {/* 增值服务（可多选组合） */}
          <Card
            title={
              <span>
                <StarOutlined style={{ color: 'var(--color-primary)' }} />{' '}
                {t('checkout.valueServices')}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    marginLeft: 8,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {t('checkout.valueServicesTip')}
                </span>
              </span>
            }
            extra={
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                {t('checkout.selected', { count: pickedValueServices.length })}{' '}
                {formatPrice(valueServicesCNY, currency)}
              </span>
            }
            style={{ marginTop: 16 }}
          >
            <Checkbox.Group
              value={valueIds}
              onChange={(vals) => setValueIds(vals as string[])}
              style={{ width: '100%' }}
            >
              <Row gutter={[12, 12]}>
                {VALUE_SERVICES.map((v) => {
                  const active = valueIds.includes(v.id);
                  return (
                    <Col key={v.id} xs={24} sm={12} md={8}>
                      <Card
                        size="small"
                        hoverable
                        onClick={() => {
                          setValueIds((ids) =>
                            ids.includes(v.id)
                              ? ids.filter((x) => x !== v.id)
                              : [...ids, v.id],
                          );
                        }}
                        style={{
                          cursor: 'pointer',
                          borderColor: active
                            ? 'var(--color-primary)'
                            : undefined,
                          background: active ? '#fff7ef' : undefined,
                          height: '100%',
                        }}
                      >
                        <Row justify="space-between" align="top" wrap={false}>
                          <Col flex="auto">
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              <Checkbox
                                checked={active}
                                value={v.id}
                                onClick={(e) => e.stopPropagation()}
                                style={{ marginRight: 6 }}
                              />
                              {t(v.i18n)}
                              {v.recommended && (
                                <Tag
                                  color="orange"
                                  style={{ marginLeft: 6 }}
                                >
                                  {t('checkout.recommended')}
                                </Tag>
                              )}
                            </div>
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                color: 'var(--color-text-secondary)',
                                lineHeight: 1.5,
                              }}
                            >
                              {t(v.descI18n)}
                            </div>
                          </Col>
                          <Col>
                            <Tag color="orange">
                              {formatPrice(v.priceCNY, currency)}
                            </Tag>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Card>
        </Col>

        {/* 右侧订单摘要 */}
        <Col xs={24} lg={8}>
          <Card
            title={t('checkout.orderSummary')}
            style={{ position: 'sticky', top: 16 }}
          >
            {/* 1. 商品费用 */}
            <div style={{ marginBottom: 12 }}>
              <Row
                justify="space-between"
                align="middle"
                style={{
                  padding: '8px 12px',
                  background: '#fff7ef',
                  borderLeft: '3px solid var(--color-primary)',
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              >
                <Col>
                  <ShoppingOutlined
                    style={{ color: 'var(--color-primary)', marginRight: 6 }}
                  />
                  <b>{t('checkout.groupItems')}</b>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                      marginLeft: 6,
                    }}
                  >
                    × {checkoutItems.length}
                  </span>
                </Col>
                <Col>
                  <b style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(itemsCNY, currency)}
                  </b>
                </Col>
              </Row>
            </div>

            {/* 2. 转运费用 */}
            <div style={{ marginBottom: 12 }}>
              <Row
                justify="space-between"
                align="middle"
                style={{
                  padding: '8px 12px',
                  background: '#fff7ef',
                  borderLeft: '3px solid var(--color-primary)',
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              >
                <Col>
                  <GlobalOutlined
                    style={{ color: 'var(--color-primary)', marginRight: 6 }}
                  />
                  <b>{t('checkout.groupForwarding')}</b>
                </Col>
                <Col>
                  <b style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(forwardingCNY, currency)}
                  </b>
                </Col>
              </Row>
              <Row justify="space-between" style={{ fontSize: 13, padding: '2px 12px' }}>
                <Col style={{ color: 'var(--color-text-secondary)' }}>
                  · {t('checkout.shipping')} ({country})
                </Col>
                <Col>{formatPrice(shippingCNY, currency)}</Col>
              </Row>
              <Row justify="space-between" style={{ fontSize: 13, padding: '2px 12px' }}>
                <Col style={{ color: 'var(--color-text-secondary)' }}>
                  · {t('checkout.packFee')}
                </Col>
                <Col>{formatPrice(packFeeCNY, currency)}</Col>
              </Row>
            </div>

            {/* 3. 增值服务费用 */}
            <div style={{ marginBottom: 12 }}>
              <Row
                justify="space-between"
                align="middle"
                style={{
                  padding: '8px 12px',
                  background: '#fff7ef',
                  borderLeft: '3px solid var(--color-primary)',
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              >
                <Col>
                  <StarOutlined
                    style={{ color: 'var(--color-primary)', marginRight: 6 }}
                  />
                  <b>{t('checkout.groupValue')}</b>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                      marginLeft: 6,
                    }}
                  >
                    × {pickedValueServices.length}
                  </span>
                </Col>
                <Col>
                  <b style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(valueServicesCNY, currency)}
                  </b>
                </Col>
              </Row>
              {pickedValueServices.length === 0 ? (
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-secondary)',
                    padding: '2px 12px',
                  }}
                >
                  {t('checkout.noneSelected')}
                </div>
              ) : (
                <Collapse
                  ghost
                  size="small"
                  items={[
                    {
                      key: 'vs',
                      label: (
                        <span style={{ fontSize: 12 }}>
                          {t('checkout.viewDetails')}
                        </span>
                      ),
                      children: (
                        <div style={{ padding: '0 12px' }}>
                          {pickedValueServices.map((v) => (
                            <Row
                              key={v.id}
                              justify="space-between"
                              style={{ fontSize: 13, padding: '2px 0' }}
                            >
                              <Col style={{ color: 'var(--color-text-secondary)' }}>
                                <CheckCircleFilled
                                  style={{
                                    color: 'var(--color-primary)',
                                    marginRight: 4,
                                    fontSize: 12,
                                  }}
                                />
                                {t(v.i18n)}
                              </Col>
                              <Col>{formatPrice(v.priceCNY, currency)}</Col>
                            </Row>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                />
              )}
            </div>

            <Divider style={{ margin: '12px 0' }} />
            {/* 4. 应付总额 */}
            <Row
              justify="space-between"
              align="middle"
              style={{
                padding: '14px 12px',
                background: 'linear-gradient(135deg,#ff6900 0%,#ff9149 100%)',
                borderRadius: 6,
                color: '#fff',
              }}
            >
              <Col>
                <div style={{ fontSize: 13, opacity: 0.9 }}>
                  {t('checkout.payNow')}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {t('checkout.totalBreakdown', {
                    items: formatPrice(itemsCNY, currency),
                    ship: formatPrice(forwardingCNY, currency),
                    vs: formatPrice(valueServicesCNY, currency),
                  })}
                </div>
              </Col>
              <Col>
                <span style={{ fontSize: 26, fontWeight: 800 }}>
                  {formatPrice(totalCNY, currency)}
                </span>
              </Col>
            </Row>

            <Button
              type="primary"
              size="large"
              block
              style={{ marginTop: 16 }}
              loading={submitting}
              disabled={!checkoutItems.length}
              onClick={onSubmit}
            >
              {t('checkout.placeOrder')}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
