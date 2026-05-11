import { apiPost } from './client';

export interface OrderItem {
  productId: string;
  title_zh: string;
  title_en: string;
  image: string;
  priceCNY: number;
  sku: string;
  qty: number;
}

export interface OrderAddress {
  name: string;
  phone: string;
  country: string;
  address: string;
  zip?: string;
}

export interface ValueService {
  id: string;
  priceCNY: number;
}

export interface PlaceOrderPayload {
  items: OrderItem[];
  address: OrderAddress;
  solutionId: string;
  packFeeCNY: number;
  shippingCNY: number;
  itemsCNY: number;
  valueServices: ValueService[];
  valueServicesCNY: number;
  totalCNY: number;
}

export interface PlaceOrderResp {
  orderId: string;
  createdAt: number;
  status: string;
}

export const placeOrder = (payload: PlaceOrderPayload) =>
  apiPost<PlaceOrderResp>('/api/orders', payload);
