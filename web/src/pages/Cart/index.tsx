import { useNavigate, Link } from 'react-router-dom';
import {
  Table,
  Button,
  InputNumber,
  Popconfirm,
  Empty,
  Space,
  message,
  Checkbox,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useCart } from '@/stores/cart';
import { useAuth } from '@/stores/auth';
import { useSettings } from '@/stores/settings';
import Price from '@/components/common/Price';
import { formatPrice } from '@/utils/currency';
import type { CartItem } from '@/stores/cart';

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const token = useAuth((s) => s.token);
  const locale = useSettings((s) => s.locale);
  const currency = useSettings((s) => s.currency);

  // 默认全选
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    items.map((i) => `${i.productId}__${i.sku}`),
  );

  const rowKey = (item: CartItem) => `${item.productId}__${item.sku}`;

  const selected = useMemo(
    () => items.filter((i) => selectedKeys.includes(rowKey(i))),
    [items, selectedKeys],
  );
  const selectedTotalCNY = selected.reduce(
    (s, i) => s + i.priceCNY * i.qty,
    0,
  );
  const selectedCount = selected.reduce((s, i) => s + i.qty, 0);

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={
            selectedKeys.length > 0 && selectedKeys.length < items.length
          }
          checked={items.length > 0 && selectedKeys.length === items.length}
          onChange={(e) =>
            setSelectedKeys(e.target.checked ? items.map(rowKey) : [])
          }
        />
      ),
      key: 'select',
      width: 50,
      render: (_: unknown, item: CartItem) => {
        const k = rowKey(item);
        return (
          <Checkbox
            checked={selectedKeys.includes(k)}
            onChange={(e) =>
              setSelectedKeys((prev) =>
                e.target.checked ? [...prev, k] : prev.filter((x) => x !== k),
              )
            }
          />
        );
      },
    },
    {
      title: t('cart.product'),
      key: 'product',
      render: (_: unknown, item: CartItem) => (
        <Link
          to={`/product/${item.productId}`}
          style={{ display: 'flex', gap: 12, alignItems: 'center' }}
        >
          <img
            src={item.image}
            alt=""
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                '/images/default.png';
            }}
            style={{
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: 4,
              background: '#f5f5f5',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#333' }}>
              {locale === 'en' ? item.title_en : item.title_zh}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}
            >
              {t('cart.sku')}: {item.sku}
            </div>
          </div>
        </Link>
      ),
    },
    {
      title: t('cart.price'),
      key: 'price',
      width: 140,
      render: (_: unknown, item: CartItem) => (
        <Price valueCNY={item.priceCNY} />
      ),
    },
    {
      title: t('cart.qty'),
      key: 'qty',
      width: 140,
      render: (_: unknown, item: CartItem) => (
        <InputNumber
          min={1}
          max={99}
          value={item.qty}
          onChange={(v) => setQty(item.productId, item.sku, Number(v) || 1)}
        />
      ),
    },
    {
      title: t('cart.subtotal'),
      key: 'subtotal',
      width: 140,
      render: (_: unknown, item: CartItem) => (
        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          {formatPrice(item.priceCNY * item.qty, currency)}
        </span>
      ),
    },
    {
      title: t('cart.action'),
      key: 'action',
      width: 100,
      render: (_: unknown, item: CartItem) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            removeItem(item.productId, item.sku);
            setSelectedKeys((prev) => prev.filter((k) => k !== rowKey(item)));
            message.success(t('cart.removed'));
          }}
        >
          {t('cart.remove')}
        </Button>
      ),
    },
  ];

  const handleCheckout = () => {
    if (!selected.length) {
      message.warning(t('checkout.emptyTip'));
      return;
    }
    if (!token) {
      message.info(t('auth.needLogin'));
      navigate('/login?redirect=/checkout');
      return;
    }
    // 将选中的 key 通过 sessionStorage 传给结算页
    sessionStorage.setItem(
      'checkout-selected',
      JSON.stringify(selectedKeys),
    );
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <Empty description={t('cart.empty')}>
          <Link to="/">
            <Button type="primary">{t('cart.goShop')}</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h2 style={{ fontSize: 22, margin: '8px 0 16px' }}>{t('cart.title')}</h2>
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={items}
        pagination={false}
        bordered
      />
      <div
        style={{
          marginTop: 20,
          padding: '16px 20px',
          background: '#fff',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Space>
          <Popconfirm
            title={t('cart.clear') + '?'}
            onConfirm={() => {
              clear();
              setSelectedKeys([]);
              message.success(t('cart.cleared'));
            }}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
          >
            <Button>{t('cart.clear')}</Button>
          </Popconfirm>
        </Space>
        <Space size="large" align="center">
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {t('cart.totalItems', { count: selectedCount })}
          </span>
          <span style={{ fontSize: 14 }}>
            {t('cart.total')}:{' '}
            <span style={{ fontSize: 22, fontWeight: 700 }}>
              <Price valueCNY={selectedTotalCNY} size="large" strong />
            </span>
          </span>
          <Button
            type="primary"
            size="large"
            disabled={!selected.length}
            onClick={handleCheckout}
          >
            {t('cart.checkout')}
          </Button>
        </Space>
      </div>
    </div>
  );
}
