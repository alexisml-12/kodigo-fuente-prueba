export type DiscountType = 'PORCENTAJE' | 'MONTO_FIJO';
export type PromotionStatus = 'PROGRAMADA' | 'ACTIVA' | 'FINALIZADA';
export type PromotionTarget = 'PRODUCTO' | 'CATEGORIA';

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
