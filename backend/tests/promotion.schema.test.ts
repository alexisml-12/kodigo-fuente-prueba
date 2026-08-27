import { describe, it, expect } from 'vitest';
import { createPromotionSchema } from '../src/validators/promotion.schema';

const basePayload = {
  name: 'Descuento fin de mes',
  targetType: 'PRODUCTO' as const,
  productId: 1,
  discountType: 'PORCENTAJE' as const,
  discountValue: 20,
  startDate: '2026-08-01',
  endDate: '2026-08-31'
};

describe('createPromotionSchema', () => {
  it('acepta un payload válido', () => {
    const result = createPromotionSchema.safeParse(basePayload);
    expect(result.success).toBe(true);
  });

  it('rechaza si falta el nombre', () => {
    const result = createPromotionSchema.safeParse({ ...basePayload, name: '' });
    expect(result.success).toBe(false);
  });

  it('rechaza si la fecha de fin no es posterior a la de inicio', () => {
    const result = createPromotionSchema.safeParse({
      ...basePayload,
      startDate: '2026-08-31',
      endDate: '2026-08-01'
    });
    expect(result.success).toBe(false);
  });

  it('rechaza porcentaje fuera de rango 1-100', () => {
    const result = createPromotionSchema.safeParse({ ...basePayload, discountValue: 150 });
    expect(result.success).toBe(false);
  });

  it('acepta monto fijo mayor a 100', () => {
    const result = createPromotionSchema.safeParse({
      ...basePayload,
      discountType: 'MONTO_FIJO',
      discountValue: 5000
    });
    expect(result.success).toBe(true);
  });

  it('rechaza si es tipo CATEGORIA sin categoryName', () => {
    const result = createPromotionSchema.safeParse({
      ...basePayload,
      targetType: 'CATEGORIA',
      productId: null,
      categoryName: null
    });
    expect(result.success).toBe(false);
  });
});
