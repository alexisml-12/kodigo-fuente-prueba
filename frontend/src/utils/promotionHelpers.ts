import type { PromotionStatus, DiscountType } from '../types/promotion';

export const STATUS_LABELS: Record<PromotionStatus, string> = {
  PROGRAMADA: 'Programada',
  ACTIVA: 'Activa',
  FINALIZADA: 'Finalizada'
};

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  PORCENTAJE: 'Porcentaje',
  MONTO_FIJO: 'Monto fijo'
};

export function formatDiscount(type: DiscountType, value: string | number): string {
  const numeric = typeof value === 'string' ? Number(value) : value;
  return type === 'PORCENTAJE' ? `${numeric}%` : `$${numeric.toLocaleString('es-CO')}`;
}

export function nextStatus(status: PromotionStatus): PromotionStatus | null {
  if (status === 'PROGRAMADA') return 'ACTIVA';
  if (status === 'ACTIVA') return 'FINALIZADA';
  return null;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC'
  });
}
