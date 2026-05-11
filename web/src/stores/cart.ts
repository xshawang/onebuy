import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  title_zh: string;
  title_en: string;
  image: string;
  priceCNY: number;
  sku: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, sku: string) => void;
  setQty: (productId: string, sku: string, qty: number) => void;
  clear: () => void;
  totalQty: () => number;
  totalCNY: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const items = [...get().items];
        const idx = items.findIndex(
          (i) => i.productId === item.productId && i.sku === item.sku,
        );
        if (idx >= 0) {
          items[idx] = { ...items[idx], qty: items[idx].qty + item.qty };
        } else {
          items.push(item);
        }
        set({ items });
      },
      remove: (productId, sku) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.sku === sku),
          ),
        }),
      setQty: (productId, sku, qty) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.sku === sku
              ? { ...i, qty: Math.max(1, qty) }
              : i,
          ),
        }),
      clear: () => set({ items: [] }),
      totalQty: () => get().items.reduce((s, i) => s + i.qty, 0),
      totalCNY: () =>
        get().items.reduce((s, i) => s + i.priceCNY * i.qty, 0),
    }),
    { name: 'superbuy-cart' },
  ),
);
