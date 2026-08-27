export type DiscountType = 'PORCENTAJE' | 'MONTO_FIJO';
export type PromotionStatus = 'PROGRAMADA' | 'ACTIVA' | 'FINALIZADA';
export type PromotionTarget = 'PRODUCTO' | 'CATEGORIA';

export interface Product {
  id: number;
  name: string;
  category: string;
}

export interface Promotion {
  id: number;
  name: string;
  targetType: PromotionTarget;
  productId: number | null;
  categoryName: string | null;
  discountType: DiscountType;
  discountValue: string;
  startDate: string;
  endDate: string;
  status: PromotionStatus;
  product: Product | null;
}

export interface Summary {
  porEstado: Record<PromotionStatus, number>;
  vigentesHoy: number;
}

export interface CreatePromotionInput {
  name: string;
  targetType: PromotionTarget;
  productId?: number | null;
  categoryName?: string | null;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
}
