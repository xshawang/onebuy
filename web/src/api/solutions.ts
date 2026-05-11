import { apiGet } from './client';

export interface SolutionOption {
  key: string;
  icon: string;
  label_zh: string;
  label_en: string;
  feeCNY: number;
}

export interface Solution {
  id: string;
  title_zh: string;
  title_en: string;
  desc_zh: string;
  desc_en: string;
  priceCNY: number;
  options: SolutionOption[];
  flow_zh: string[];
  flow_en: string[];
}

export const getSolution = (id: string) => apiGet<Solution>(`/api/solutions/${id}`);
