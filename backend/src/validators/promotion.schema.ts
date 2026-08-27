import { z } from 'zod';

const baseSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(120, 'El nombre no puede superar 120 caracteres'),
  targetType: z.enum(['PRODUCTO', 'CATEGORIA'], {
    required_error: 'Debe indicar si aplica a un producto o a una categoría'
  }),
  productId: z.number().int().positive().optional().nullable(),
  categoryName: z.string().trim().min(1).max(80).optional().nullable(),
  discountType: z.enum(['PORCENTAJE', 'MONTO_FIJO'], {
    required_error: 'El tipo de descuento es obligatorio'
  }),
  discountValue: z
    .number({ required_error: 'El valor del descuento es obligatorio' })
    .positive('El valor del descuento debe ser mayor a 0'),
  startDate: z.coerce.date({ required_error: 'La fecha de inicio es obligatoria' }),
  endDate: z.coerce.date({ required_error: 'La fecha de fin es obligatoria' })
});

export const createPromotionSchema = baseSchema
  .refine((data) => data.endDate > data.startDate, {
    message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    path: ['endDate']
  })
  .refine(
    (data) => (data.targetType === 'PRODUCTO' ? !!data.productId : !!data.categoryName),
    {
      message: 'Debe seleccionar un producto o una categoría según el tipo elegido',
      path: ['targetType']
    }
  )
  .refine(
    (data) =>
      data.discountType !== 'PORCENTAJE' ||
      (data.discountValue >= 1 && data.discountValue <= 100),
    {
      message: 'Si el descuento es por porcentaje, el valor debe estar entre 1 y 100',
      path: ['discountValue']
    }
  );

export type CreatePromotionPayload = z.infer<typeof createPromotionSchema>;

export const changeStatusSchema = z.object({
  status: z.enum(['PROGRAMADA', 'ACTIVA', 'FINALIZADA'], {
    required_error: 'El estado es obligatorio'
  })
});
