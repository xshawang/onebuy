import { Layout, Input, Space, Badge, Dropdown, Button, message } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import LangSwitch from '@/components/common/LangSwitch';
import CurrencySwitch from '@/components/common/CurrencySwitch';
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const totalQty = useCart((s) => s.totalQty());
  const [q, setQ] = useState('');

  const onSearch = () => {
    navigate(`/?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AntHeader
      style={{
        background: '#fff',
        borderBottom: '1px solid var(--color-border)',
        padding: 0,
        height: 'auto',
        lineHeight: 1.5,
      }}
    >
      {/* Top strip */}
      <div
        style={{
          background: '#f7f7f7',
          borderBottom: '1px solid var(--color-border)',
          fontSize: 12,
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 32,
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {t('common.slogan')}
          </span>
          <Space size="middle" align="center">
            <LangSwitch />
            <CurrencySwitch />
            {user ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      label: t('common.logout'),
                      onClick: () => {
                        logout();
                        message.success('Bye');
                      },
                    },
                  ],
                }}
              >
                <a>
                  <UserOutlined /> {t('common.hi')}, {user.username}
                </a>
              </Dropdown>
            ) : (
              <Space split={<span style={{ color: '#ccc' }}>|</span>}>
                <Link to="/login">{t('common.login')}</Link>
                <Link to="/register">{t('common.register')}</Link>
              </Space>
            )}
          </Space>
        </div>
      </div>

      {/* Main row */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '14px 16px',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--color-primary)',
              letterSpacing: 1,
            }}
          >
            OneClick
          </span>
        </Link>

        <Space size="large" style={{ marginLeft: 16 }}>
          <Link to="/">{t('nav.shop')}</Link>
          <a>{t('nav.warehouse')}</a>
          <Link to="/shipping">{t('nav.shipping')}</Link>
          <Link to="/pricing">{t('nav.pricing')}</Link>
          <a>{t('nav.help')}</a>
        </Space>

        <div style={{ flex: 1, marginLeft: 'auto', maxWidth: 520 }}>
          <Input
            size="large"
            allowClear
            placeholder={t('common.search')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onPressEnter={onSearch}
            suffix={
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
              >
                {t('common.searchBtn')}
              </Button>
            }
          />
        </div>

        <Badge count={totalQty} size="small" color="#ff6900">
          <Link to="/cart">
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: 22 }} />}
            >
              {t('common.cart')}
            </Button>
          </Link>
        </Badge>
      </div>
    </AntHeader>
  );
}
