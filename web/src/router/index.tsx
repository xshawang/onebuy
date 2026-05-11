import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import SolutionDetail from '@/pages/SolutionDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Shipping from '@/pages/Shipping';
import ShippingDetail from '@/pages/ShippingDetail';
import Pricing from '@/pages/Pricing';
import NotFound from '@/pages/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/solution/:id" element={<SolutionDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/shipping/:id" element={<ShippingDetail />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
