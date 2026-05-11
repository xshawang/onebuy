import { useMemo, useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, theme, Tag, message } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  ShopOutlined,
  StarOutlined,
  CarOutlined,
  FileTextOutlined,
  WalletOutlined,
  CreditCardOutlined,
  MenuOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { getCurrentUser, logout } from '@/utils/auth';

const { Header, Sider, Content } = Layout;

const MENU_ITEMS: MenuProps['items'] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">工作台</Link> },
  {
    key: 'system',
    icon: <AppstoreOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/menu', icon: <MenuOutlined />, label: <Link to="/system/menu">菜单管理</Link> },
      { key: '/system/user', icon: <UserOutlined />, label: <Link to="/system/user">用户管理</Link> },
      { key: '/system/role', icon: <TeamOutlined />, label: <Link to="/system/role">角色管理</Link> },
      { key: '/system/auth', icon: <SafetyOutlined />, label: <Link to="/system/auth">授权管理</Link> },
    ],
  },
  {
    key: 'biz',
    icon: <ShopOutlined />,
    label: '业务管理',
    children: [
      { key: '/biz/product', icon: <ShopOutlined />, label: <Link to="/biz/product">产品管理</Link> },
      { key: '/biz/value-service', icon: <StarOutlined />, label: <Link to="/biz/value-service">增值服务管理</Link> },
      { key: '/biz/shipping', icon: <CarOutlined />, label: <Link to="/biz/shipping">转运服务管理</Link> },
      { key: '/biz/order', icon: <FileTextOutlined />, label: <Link to="/biz/order">订单管理</Link> },
    ],
  },
  {
    key: 'pay',
    icon: <WalletOutlined />,
    label: '支付中心',
    children: [
      { key: '/pay/payment', icon: <WalletOutlined />, label: <Link to="/pay/payment">结算支付管理</Link> },
      { key: '/pay/channel', icon: <CreditCardOutlined />, label: <Link to="/pay/channel">支付渠道管理</Link> },
    ],
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const loc = useLocation();
  const nav = useNavigate();
  const user = getCurrentUser();

  // 登录守卫：未登录直接重定向到 /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const openKeys = useMemo(() => {
    const seg = loc.pathname.split('/')[1];
    return seg ? [seg] : [];
  }, [loc.pathname]);

  const userMenu: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const onUserMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
      message.success('已退出登录');
      nav('/login', { replace: true });
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={220}
        style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            color: token.colorPrimary,
            letterSpacing: 1,
          }}
        >
          {collapsed ? 'OC' : 'OneClick Admin'}
        </div>
        <Menu
          mode="inline"
          defaultOpenKeys={openKeys}
          selectedKeys={[loc.pathname]}
          items={MENU_ITEMS}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Space>
            <Tag color="orange" bordered={false}>后台管理</Tag>
            <span style={{ color: token.colorTextSecondary }}>OneClick 运营平台</span>
          </Space>
          <Space size="large">
            <Space>
              <GlobalOutlined />
              <span style={{ fontSize: 13 }}>zh-CN</span>
            </Space>
            <Dropdown menu={{ items: userMenu, onClick: onUserMenu }}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" style={{ background: token.colorPrimary }}>{user.name.slice(0, 1)}</Avatar>
                <span>{user.name}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ padding: 16, background: '#f5f5f5' }}>
          <div
            style={{
              background: '#fff',
              padding: 16,
              borderRadius: 6,
              minHeight: 'calc(100vh - 104px)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
