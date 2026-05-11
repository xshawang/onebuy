// 通用类型定义（后台全局共用）
export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP';
export type Locale = 'zh' | 'en';
export type OrderStatus =
  | 'pending'   // 待支付
  | 'paid'      // 已支付
  | 'buying'    // 代购中
  | 'arrived'   // 到仓
  | 'shipped'   // 已出库
  | 'delivered' // 已签收
  | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed';

export interface I18nText {
  zh: string;
  en: string;
}

export interface Money {
  amount: number;   // 以 amount + currency 描述金额
  currency: Currency;
}

export interface MenuItem {
  id: string;
  parentId: string | null;
  name: I18nText;
  path: string;
  icon?: string;
  sort: number;
  visible: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  roleIds: string[];
  status: 'active' | 'disabled';
  createdAt: string;
}

export interface Role {
  id: string;
  code: string;
  name: I18nText;
  remark?: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  code: string;       // 例："product:create"
  module: string;     // 例："product"
  action: string;     // 例："create"
  name: I18nText;
}

export interface AuthGrant {
  id: string;
  userId: string;
  roleId: string;
  grantedAt: string;
  grantedBy: string;
}

export interface Product {
  id: string;
  title: I18nText;
  sku: string;
  price: Money;      // 商品价格（带币种）
  stock: number;
  category: string;
  from: 'taobao' | 'tmall' | 'jd' | '1688';
  image: string;
  status: 'on' | 'off';
  createdAt: string;
}

export interface ValueService {
  id: string;
  code: string;
  name: I18nText;
  fee: Money;
  group: 'qc' | 'pack' | 'service';  // 验货/打包/其他服务
  enabled: boolean;
  sort: number;
}

export interface ShippingLine {
  id: string;
  code: string;
  name: I18nText;
  countries: string[];
  firstKgFee: Money;
  pricePerKg: Money;
  durationDays: string;   // "7-12"
  fuelPct: number;
  status: 'on' | 'off';
}

export interface PayChannel {
  id: string;
  code: string;
  name: I18nText;
  type: 'alipay' | 'wechat' | 'paypal' | 'card' | 'stripe';
  supportedCurrencies: Currency[];
  feeRate: number;   // 手续费率 %
  enabled: boolean;
}

export interface OrderItem {
  productId: string;
  title: I18nText;
  qty: number;
  price: Money;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  itemsTotal: Money;
  shippingFee: Money;
  valueServiceFee: Money;
  total: Money;         // 订单总额（带币种）
  status: OrderStatus;
  shippingLineId: string;
  valueServiceIds: string[];
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: Money;        // 支付金额（带币种）
  channelId: string;
  channelName: I18nText;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}
