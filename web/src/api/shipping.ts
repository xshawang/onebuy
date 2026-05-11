import { apiGet, apiPost } from './client';

export interface ShippingLine {
  id: string;
  name_zh: string;
  name_en: string;
  countries: string[];
  pricePerKgCNY: number;
  firstKgCNY: number;
  firstKgWeight: number;
  fuelSurchargePct: number;
  clearanceFeeCNY: number;
  operationFeePct: number;
  minKg: number;
  maxKg: number;
  maxSizeCm: number;
  leadTimeDays: string;
  shippedCount: number;
  tags_zh: string[];
  tags_en: string[];
  desc_zh: string;
  desc_en: string;
  allowed_zh: string[];
  allowed_en: string[];
  restricted_zh: string[];
  restricted_en: string[];
}

export interface QuoteReq {
  country: string;
  weightKg: number;
}

export interface QuoteItem {
  lineId: string;
  name_zh: string;
  name_en: string;
  leadTimeDays: string;
  feeCNY: number;
}

export const getShippingLines = () =>
  apiGet<ShippingLine[]>('/api/shipping/lines');

export const getShippingLine = (id: string) =>
  apiGet<ShippingLine>(`/api/shipping/lines/${id}`);

export const quoteShipping = (payload: QuoteReq) =>
  apiPost<{ country: string; weightKg: number; quotes: QuoteItem[] }>(
    '/api/shipping/quote',
    payload,
  );
