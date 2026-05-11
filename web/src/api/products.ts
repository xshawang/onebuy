import { apiGet } from './client';

export interface Sku {
  id: string;
  color_zh: string;
  color_en: string;
  size: string;
}

export interface Product {
  id: string;
  title_zh: string;
  title_en: string;
  priceCNY: number;
  images: string[];
  skus: Sku[];
  descriptionHtml_zh: string;
  descriptionHtml_en: string;
  solutionIds: string[];
  from: string;
}

export const getHotProducts = () => apiGet<Product[]>('/api/products/hot');
export const searchProducts = (q: string) =>
  apiGet<Product[]>(`/api/products/search?q=${encodeURIComponent(q)}`);
export const getProduct = (id: string) => apiGet<Product>(`/api/products/${id}`);
