import type {
  MenuItem, User, Role, Permission, AuthGrant,
  Product, ValueService, ShippingLine, PayChannel, Order, Payment,
} from '@/types';

// ---------- 菜单 ----------
export const menus: MenuItem[] = [
  { id: 'm1', parentId: null, name: { zh: '工作台', en: 'Dashboard' }, path: '/dashboard', icon: 'DashboardOutlined', sort: 1, visible: true },
  { id: 'm2', parentId: null, name: { zh: '系统管理', en: 'System' }, path: '/system', icon: 'AppstoreOutlined', sort: 2, visible: true },
  { id: 'm2-1', parentId: 'm2', name: { zh: '菜单管理', en: 'Menu' }, path: '/system/menu', icon: 'MenuOutlined', sort: 1, visible: true },
  { id: 'm2-2', parentId: 'm2', name: { zh: '用户管理', en: 'User' }, path: '/system/user', icon: 'UserOutlined', sort: 2, visible: true },
  { id: 'm2-3', parentId: 'm2', name: { zh: '角色管理', en: 'Role' }, path: '/system/role', icon: 'TeamOutlined', sort: 3, visible: true },
  { id: 'm2-4', parentId: 'm2', name: { zh: '授权管理', en: 'Auth' }, path: '/system/auth', icon: 'SafetyOutlined', sort: 4, visible: true },
  { id: 'm3', parentId: null, name: { zh: '业务管理', en: 'Business' }, path: '/biz', icon: 'ShopOutlined', sort: 3, visible: true },
  { id: 'm3-1', parentId: 'm3', name: { zh: '产品管理', en: 'Product' }, path: '/biz/product', icon: 'ShopOutlined', sort: 1, visible: true },
  { id: 'm3-2', parentId: 'm3', name: { zh: '增值服务管理', en: 'Value Service' }, path: '/biz/value-service', icon: 'StarOutlined', sort: 2, visible: true },
  { id: 'm3-3', parentId: 'm3', name: { zh: '转运服务管理', en: 'Shipping' }, path: '/biz/shipping', icon: 'CarOutlined', sort: 3, visible: true },
  { id: 'm3-4', parentId: 'm3', name: { zh: '订单管理', en: 'Order' }, path: '/biz/order', icon: 'FileTextOutlined', sort: 4, visible: true },
  { id: 'm4', parentId: null, name: { zh: '支付中心', en: 'Payment' }, path: '/pay', icon: 'WalletOutlined', sort: 4, visible: true },
  { id: 'm4-1', parentId: 'm4', name: { zh: '结算支付管理', en: 'Payments' }, path: '/pay/payment', icon: 'WalletOutlined', sort: 1, visible: true },
  { id: 'm4-2', parentId: 'm4', name: { zh: '支付渠道管理', en: 'Pay Channel' }, path: '/pay/channel', icon: 'CreditCardOutlined', sort: 2, visible: true },
];

// ---------- 用户 ----------
export const users: User[] = [
  { id: 'u1', username: 'admin', email: 'admin@oneclick.local', name: '系统管理员', roleIds: ['r1'], status: 'active', createdAt: '2025-01-05 10:00:00' },
  { id: 'u2', username: 'operator', email: 'op@oneclick.local', name: '运营小二', roleIds: ['r2'], status: 'active', createdAt: '2025-03-18 14:20:00' },
  { id: 'u3', username: 'finance', email: 'fin@oneclick.local', name: '财务主管', roleIds: ['r3'], status: 'active', createdAt: '2025-04-02 09:10:00' },
  { id: 'u4', username: 'cs01', email: 'cs01@oneclick.local', name: '客服 01', roleIds: ['r4'], status: 'active', createdAt: '2025-05-21 16:45:00' },
  { id: 'u5', username: 'demo', email: 'demo@oneclick.local', name: '演示账号', roleIds: ['r4'], status: 'disabled', createdAt: '2025-08-08 12:00:00' },
];

// ---------- 角色 ----------
export const roles: Role[] = [
  { id: 'r1', code: 'super-admin', name: { zh: '超级管理员', en: 'Super Admin' }, remark: '拥有全部权限', permissions: ['*'] },
  { id: 'r2', code: 'operator',    name: { zh: '运营',        en: 'Operator' },    remark: '产品与订单操作',   permissions: ['product:*', 'order:*', 'value-service:*'] },
  { id: 'r3', code: 'finance',     name: { zh: '财务',        en: 'Finance' },     remark: '支付结算只读',     permissions: ['payment:read', 'order:read', 'channel:read'] },
  { id: 'r4', code: 'cs',          name: { zh: '客服',        en: 'Customer Service' }, remark: '订单查看 + 工单', permissions: ['order:read', 'user:read'] },
];

// ---------- 权限 ----------
export const permissions: Permission[] = [
  { id: 'p1', code: 'product:create', module: 'product', action: 'create', name: { zh: '产品-新增', en: 'Product-Create' } },
  { id: 'p2', code: 'product:update', module: 'product', action: 'update', name: { zh: '产品-编辑', en: 'Product-Update' } },
  { id: 'p3', code: 'product:delete', module: 'product', action: 'delete', name: { zh: '产品-删除', en: 'Product-Delete' } },
  { id: 'p4', code: 'order:read',     module: 'order',   action: 'read',   name: { zh: '订单-查看', en: 'Order-Read' } },
  { id: 'p5', code: 'order:update',   module: 'order',   action: 'update', name: { zh: '订单-操作', en: 'Order-Update' } },
  { id: 'p6', code: 'payment:read',   module: 'payment', action: 'read',   name: { zh: '结算-查看', en: 'Payment-Read' } },
  { id: 'p7', code: 'payment:refund', module: 'payment', action: 'refund', name: { zh: '结算-退款', en: 'Payment-Refund' } },
  { id: 'p8', code: 'channel:read',   module: 'channel', action: 'read',   name: { zh: '渠道-查看', en: 'Channel-Read' } },
  { id: 'p9', code: 'channel:update', module: 'channel', action: 'update', name: { zh: '渠道-编辑', en: 'Channel-Update' } },
];

// ---------- 授权记录 ----------
export const authGrants: AuthGrant[] = [
  { id: 'g1', userId: 'u1', roleId: 'r1', grantedAt: '2025-01-05 10:05', grantedBy: 'system' },
  { id: 'g2', userId: 'u2', roleId: 'r2', grantedAt: '2025-03-18 14:30', grantedBy: 'admin' },
  { id: 'g3', userId: 'u3', roleId: 'r3', grantedAt: '2025-04-02 09:15', grantedBy: 'admin' },
  { id: 'g4', userId: 'u4', roleId: 'r4', grantedAt: '2025-05-21 16:50', grantedBy: 'admin' },
  { id: 'g5', userId: 'u5', roleId: 'r4', grantedAt: '2025-08-08 12:05', grantedBy: 'admin' },
];

// ---------- 产品 ----------
export const products: Product[] = [
  { id: 'p001', title: { zh: '小众设计男士毛衣链项链', en: "Men's Niche Layered Necklace" }, sku: 'NKL-001', price: { amount: 89, currency: 'CNY' }, stock: 320, category: '饰品', from: 'tmall', image: '/images/products/p001-1.jpg', status: 'on', createdAt: '2025-06-01' },
  { id: 'p002', title: { zh: 'AONW 苹果刺绣连帽卫衣', en: 'AONW Apple Embroidery Hoodie' }, sku: 'HDY-002', price: { amount: 268, currency: 'CNY' }, stock: 156, category: '服饰', from: 'tmall', image: '/images/products/p002-1.jpg', status: 'on', createdAt: '2025-06-05' },
  { id: 'p003', title: { zh: '日系复古纯棉 T 恤',       en: 'Japanese Retro Cotton T-shirt' }, sku: 'TSH-003', price: { amount: 69, currency: 'CNY' }, stock: 500, category: '服饰', from: 'taobao', image: '/images/products/p003-1.jpg', status: 'on', createdAt: '2025-06-10' },
  { id: 'p006', title: { zh: '运动透气跑步鞋',          en: 'Breathable Running Shoes' },      sku: 'SHO-006', price: { amount: 40, currency: 'USD' }, stock: 80,  category: '鞋履', from: 'tmall',  image: '/images/products/p006-1.jpg', status: 'on', createdAt: '2025-06-12' },
  { id: 'p010', title: { zh: '复古方形石英手表',        en: 'Retro Square Quartz Watch' },     sku: 'WAT-010', price: { amount: 29, currency: 'EUR' }, stock: 42,  category: '手表', from: 'tmall',  image: '/images/products/p010-1.jpg', status: 'on', createdAt: '2025-06-18' },
  { id: 'p015', title: { zh: '日本进口零食大礼包',      en: 'Japanese Snacks Gift Box' },      sku: 'FOD-015', price: { amount: 3500, currency: 'JPY' }, stock: 25, category: '食品', from: 'taobao', image: '/images/products/p015-1.jpg', status: 'off', createdAt: '2025-07-02' },
];

// ---------- 增值服务 ----------
export const valueServices: ValueService[] = [
  { id: 'vs1',  code: 'photo',     name: { zh: '精细拍照',    en: 'Detailed Photos' },     fee: { amount: 3,  currency: 'CNY' }, group: 'qc',      enabled: true,  sort: 1 },
  { id: 'vs2',  code: 'recheck',   name: { zh: '二次验货',    en: 'Second Inspection' },   fee: { amount: 5,  currency: 'CNY' }, group: 'qc',      enabled: true,  sort: 2 },
  { id: 'vs3',  code: 'seal',      name: { zh: '密封加固',    en: 'Shrink Wrap' },         fee: { amount: 3,  currency: 'CNY' }, group: 'pack',    enabled: true,  sort: 3 },
  { id: 'vs4',  code: 'tryon',     name: { zh: '试穿验货',    en: 'Try-On Check' },        fee: { amount: 20, currency: 'CNY' }, group: 'service', enabled: true,  sort: 4 },
  { id: 'vs5',  code: 'removeTag', name: { zh: '拆除吊牌',    en: 'Remove Tag' },          fee: { amount: 2,  currency: 'CNY' }, group: 'service', enabled: true,  sort: 5 },
  { id: 'vs6',  code: 'powerOn',   name: { zh: '开机测试',    en: 'Power-On Check' },      fee: { amount: 10, currency: 'CNY' }, group: 'qc',      enabled: true,  sort: 6 },
  { id: 'vs7',  code: 'bubble',    name: { zh: '气柱包',      en: 'Air Column Pack' },     fee: { amount: 5,  currency: 'CNY' }, group: 'pack',    enabled: true,  sort: 7 },
  { id: 'vs8',  code: 'epe',       name: { zh: '珍珠棉填充',  en: 'EPE Foam' },            fee: { amount: 5,  currency: 'CNY' }, group: 'pack',    enabled: true,  sort: 8 },
  { id: 'vs9',  code: 'priority',  name: { zh: '优先出库',    en: 'Priority Ship' },       fee: { amount: 8,  currency: 'CNY' }, group: 'service', enabled: false, sort: 9 },
  { id: 'vs10', code: 'packVideo', name: { zh: '打包视频',    en: 'Packing Video' },       fee: { amount: 8,  currency: 'CNY' }, group: 'service', enabled: true,  sort: 10 },
];

// ---------- 转运线路 ----------
export const shippingLines: ShippingLine[] = [
  { id: 'sl1', code: 'EU-TaxFree',  name: { zh: '欧线包税专线',     en: 'EU Tax-Free Line' },      countries: ['DE', 'FR', 'IT', 'ES'],       firstKgFee: { amount: 70, currency: 'CNY' }, pricePerKg: { amount: 55, currency: 'CNY' }, durationDays: '7-12',  fuelPct: 12, status: 'on' },
  { id: 'sl2', code: 'US-Eco',      name: { zh: '美线经济专线',     en: 'US Economy Line' },       countries: ['US', 'CA'],                    firstKgFee: { amount: 60, currency: 'CNY' }, pricePerKg: { amount: 50, currency: 'CNY' }, durationDays: '10-15', fuelPct: 10, status: 'on' },
  { id: 'sl3', code: 'JP-Express',  name: { zh: '日线加急专线',     en: 'JP Express Line' },       countries: ['JP'],                          firstKgFee: { amount: 45, currency: 'CNY' }, pricePerKg: { amount: 35, currency: 'CNY' }, durationDays: '3-5',   fuelPct: 8,  status: 'on' },
  { id: 'sl4', code: 'KR-Standard', name: { zh: '韩线标准专线',     en: 'KR Standard Line' },      countries: ['KR'],                          firstKgFee: { amount: 50, currency: 'CNY' }, pricePerKg: { amount: 40, currency: 'CNY' }, durationDays: '4-7',   fuelPct: 10, status: 'on' },
  { id: 'sl5', code: 'UK-DDP',      name: { zh: '英线包税专线',     en: 'UK DDP Line' },           countries: ['GB', 'IE'],                    firstKgFee: { amount: 80, currency: 'CNY' }, pricePerKg: { amount: 65, currency: 'CNY' }, durationDays: '8-14',  fuelPct: 14, status: 'on' },
  { id: 'sl6', code: 'AU-Sea',      name: { zh: '澳线海运经济',     en: 'AU Sea Economy' },        countries: ['AU', 'NZ'],                    firstKgFee: { amount: 30, currency: 'CNY' }, pricePerKg: { amount: 20, currency: 'CNY' }, durationDays: '30-45', fuelPct: 5,  status: 'off' },
];

// ---------- 支付渠道 ----------
export const payChannels: PayChannel[] = [
  { id: 'pc1', code: 'alipay',    name: { zh: '支付宝',       en: 'Alipay' },        type: 'alipay', supportedCurrencies: ['CNY'],                    feeRate: 0.6, enabled: true },
  { id: 'pc2', code: 'wechat',    name: { zh: '微信支付',     en: 'WeChat Pay' },    type: 'wechat', supportedCurrencies: ['CNY'],                    feeRate: 0.6, enabled: true },
  { id: 'pc3', code: 'paypal',    name: { zh: 'PayPal',       en: 'PayPal' },        type: 'paypal', supportedCurrencies: ['USD', 'EUR', 'GBP'],      feeRate: 4.4, enabled: true },
  { id: 'pc4', code: 'stripe',    name: { zh: 'Stripe',       en: 'Stripe' },        type: 'stripe', supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'], feeRate: 2.9, enabled: true },
  { id: 'pc5', code: 'visa',      name: { zh: 'Visa / Master', en: 'Visa / Master' }, type: 'card',   supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'], feeRate: 3.0, enabled: false },
];

// ---------- 订单 ----------
export const orders: Order[] = [
  {
    id: 'O202601110001', userId: 'u2', userName: 'operator',
    items: [
      { productId: 'p001', title: { zh: '小众设计男士毛衣链项链', en: "Men's Niche Necklace" }, qty: 1, price: { amount: 89, currency: 'CNY' } },
      { productId: 'p003', title: { zh: '日系复古纯棉 T 恤',       en: 'Cotton T-shirt' },       qty: 2, price: { amount: 69, currency: 'CNY' } },
    ],
    itemsTotal: { amount: 227, currency: 'CNY' },
    shippingFee: { amount: 65, currency: 'CNY' },
    valueServiceFee: { amount: 8, currency: 'CNY' },
    total: { amount: 300, currency: 'CNY' },
    status: 'paid', shippingLineId: 'sl1', valueServiceIds: ['vs1', 'vs2'],
    createdAt: '2026-01-11 10:12:00',
  },
  {
    id: 'O202601120002', userId: 'u4', userName: 'cs01',
    items: [{ productId: 'p006', title: { zh: '运动透气跑步鞋', en: 'Breathable Running Shoes' }, qty: 1, price: { amount: 40, currency: 'USD' } }],
    itemsTotal: { amount: 40, currency: 'USD' },
    shippingFee: { amount: 9, currency: 'USD' },
    valueServiceFee: { amount: 2, currency: 'USD' },
    total: { amount: 51, currency: 'USD' },
    status: 'buying', shippingLineId: 'sl2', valueServiceIds: ['vs1'],
    createdAt: '2026-01-12 15:32:00',
  },
  {
    id: 'O202601130003', userId: 'u3', userName: 'finance',
    items: [{ productId: 'p010', title: { zh: '复古方形石英手表', en: 'Retro Square Watch' }, qty: 1, price: { amount: 29, currency: 'EUR' } }],
    itemsTotal: { amount: 29, currency: 'EUR' },
    shippingFee: { amount: 11, currency: 'EUR' },
    valueServiceFee: { amount: 1, currency: 'EUR' },
    total: { amount: 41, currency: 'EUR' },
    status: 'shipped', shippingLineId: 'sl1', valueServiceIds: ['vs1', 'vs3'],
    createdAt: '2026-01-13 09:01:00',
  },
  {
    id: 'O202601140004', userId: 'u5', userName: 'demo',
    items: [{ productId: 'p015', title: { zh: '日本进口零食大礼包', en: 'Japanese Snacks' }, qty: 3, price: { amount: 3500, currency: 'JPY' } }],
    itemsTotal: { amount: 10500, currency: 'JPY' },
    shippingFee: { amount: 1200, currency: 'JPY' },
    valueServiceFee: { amount: 300, currency: 'JPY' },
    total: { amount: 12000, currency: 'JPY' },
    status: 'pending', shippingLineId: 'sl3', valueServiceIds: [],
    createdAt: '2026-01-14 11:45:00',
  },
  {
    id: 'O202601150005', userId: 'u2', userName: 'operator',
    items: [{ productId: 'p002', title: { zh: 'AONW 苹果刺绣连帽卫衣', en: 'AONW Hoodie' }, qty: 1, price: { amount: 268, currency: 'CNY' } }],
    itemsTotal: { amount: 268, currency: 'CNY' },
    shippingFee: { amount: 80, currency: 'CNY' },
    valueServiceFee: { amount: 13, currency: 'CNY' },
    total: { amount: 361, currency: 'CNY' },
    status: 'delivered', shippingLineId: 'sl5', valueServiceIds: ['vs2', 'vs7'],
    createdAt: '2026-01-15 14:20:00',
  },
];

// ---------- 支付记录 ----------
export const payments: Payment[] = [
  { id: 'PAY001', orderId: 'O202601110001', amount: { amount: 300,   currency: 'CNY' }, channelId: 'pc1', channelName: { zh: '支付宝', en: 'Alipay' },      status: 'paid',     paidAt: '2026-01-11 10:15', createdAt: '2026-01-11 10:13' },
  { id: 'PAY002', orderId: 'O202601120002', amount: { amount: 51,    currency: 'USD' }, channelId: 'pc3', channelName: { zh: 'PayPal', en: 'PayPal' },      status: 'paid',     paidAt: '2026-01-12 15:35', createdAt: '2026-01-12 15:33' },
  { id: 'PAY003', orderId: 'O202601130003', amount: { amount: 41,    currency: 'EUR' }, channelId: 'pc4', channelName: { zh: 'Stripe', en: 'Stripe' },      status: 'paid',     paidAt: '2026-01-13 09:05', createdAt: '2026-01-13 09:02' },
  { id: 'PAY004', orderId: 'O202601140004', amount: { amount: 12000, currency: 'JPY' }, channelId: 'pc4', channelName: { zh: 'Stripe', en: 'Stripe' },      status: 'unpaid',                          createdAt: '2026-01-14 11:46' },
  { id: 'PAY005', orderId: 'O202601150005', amount: { amount: 361,   currency: 'CNY' }, channelId: 'pc2', channelName: { zh: '微信支付', en: 'WeChat Pay' }, status: 'paid',     paidAt: '2026-01-15 14:22', createdAt: '2026-01-15 14:21' },
  { id: 'PAY006', orderId: 'O202601110001', amount: { amount: 20,    currency: 'CNY' }, channelId: 'pc1', channelName: { zh: '支付宝', en: 'Alipay' },      status: 'refunded', paidAt: '2026-01-16 10:00', createdAt: '2026-01-16 09:59' },
];
