// 模拟后端 API：全部操作基于内存 db 的 Promise（带 120ms 延时）
import * as db from './db';

const delay = <T>(data: T, ms = 120): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

// 通用 list/create/update/delete 封装
function makeCrud<T extends { id: string }>(store: T[]) {
  return {
    list: () => delay(clone(store)),
    get: (id: string) => delay(clone(store.find((x) => x.id === id))),
    create: (data: Omit<T, 'id'> & { id?: string }) => {
      const id = data.id || 'x_' + Date.now().toString(36);
      const row = { ...data, id } as T;
      store.unshift(row);
      return delay(clone(row));
    },
    update: (id: string, patch: Partial<T>) => {
      const i = store.findIndex((x) => x.id === id);
      if (i < 0) return delay(null as unknown as T);
      store[i] = { ...store[i], ...patch };
      return delay(clone(store[i]));
    },
    remove: (id: string) => {
      const i = store.findIndex((x) => x.id === id);
      if (i < 0) return delay(false);
      store.splice(i, 1);
      return delay(true);
    },
  };
}

export const api = {
  menus:         makeCrud(db.menus),
  users:         makeCrud(db.users),
  roles:         makeCrud(db.roles),
  permissions:   makeCrud(db.permissions),
  auth:          makeCrud(db.authGrants),
  products:      makeCrud(db.products),
  valueServices: makeCrud(db.valueServices),
  shipping:      makeCrud(db.shippingLines),
  channels:      makeCrud(db.payChannels),
  orders:        makeCrud(db.orders),
  payments:      makeCrud(db.payments),

  // 聚合数据
  stats: async () => delay({
    orderTotal:    db.orders.length,
    orderPaid:     db.orders.filter((o) => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped').length,
    orderPending:  db.orders.filter((o) => o.status === 'pending').length,
    productTotal:  db.products.length,
    productOn:     db.products.filter((p) => p.status === 'on').length,
    userTotal:     db.users.length,
    revenueCNY:    db.payments.filter((p) => p.status === 'paid' && p.amount.currency === 'CNY').reduce((s, p) => s + p.amount.amount, 0),
    channelEnabled: db.payChannels.filter((c) => c.enabled).length,
  }),
};
