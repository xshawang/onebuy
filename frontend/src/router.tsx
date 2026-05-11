import { createHashRouter, Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuMgr from './pages/MenuMgr';
import UserMgr from './pages/UserMgr';
import RoleMgr from './pages/RoleMgr';
import AuthMgr from './pages/AuthMgr';
import ProductMgr from './pages/ProductMgr';
import ValueServiceMgr from './pages/ValueServiceMgr';
import PaymentMgr from './pages/PaymentMgr';
import PayChannelMgr from './pages/PayChannelMgr';
import ShippingMgr from './pages/ShippingMgr';
import OrderMgr from './pages/OrderMgr';

export const router = createHashRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'system/menu', element: <MenuMgr /> },
      { path: 'system/user', element: <UserMgr /> },
      { path: 'system/role', element: <RoleMgr /> },
      { path: 'system/auth', element: <AuthMgr /> },
      { path: 'biz/product', element: <ProductMgr /> },
      { path: 'biz/value-service', element: <ValueServiceMgr /> },
      { path: 'biz/shipping', element: <ShippingMgr /> },
      { path: 'biz/order', element: <OrderMgr /> },
      { path: 'pay/payment', element: <PaymentMgr /> },
      { path: 'pay/channel', element: <PayChannelMgr /> },
    ],
  },
]);
