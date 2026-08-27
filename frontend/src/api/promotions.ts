import { apiClient } from './client';
import type {
  Promotion,
  Product,
  Summary,
  CreatePromotionInput,
  PromotionStatus
} from '../types/promotion';

export const promotionsApi = {
  list: () => apiClient.get<Promotion[]>('/api/promotions'),
  summary: () => apiClient.get<Summary>('/api/promotions/summary'),
  create: (data: CreatePromotionInput) =>
    apiClient.post<Promotion>('/api/promotions', data),
  changeStatus: (id: number, status: PromotionStatus) =>
    apiClient.patch<Promotion>(`/api/promotions/${id}/status`, { status }),
  remove: (id: number) => apiClient.delete<void>(`/api/promotions/${id}`)
};

export const productsApi = {
  list: () => apiClient.get<Product[]>('/api/products')
};
