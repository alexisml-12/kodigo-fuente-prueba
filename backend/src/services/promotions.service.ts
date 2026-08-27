import { prisma } from '../db/prisma';
import { HttpError } from '../middlewares/errorHandler';
import { isTransitionAllowed, isVigenteHoy } from '../utils/statusTransitions';
import type { CreatePromotionPayload } from '../validators/promotion.schema';
import type { PromotionStatus } from '../types/promotion';

export async function listPromotions() {
  return prisma.promotion.findMany({
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createPromotion(data: CreatePromotionPayload) {
  if (data.targetType === 'PRODUCTO' && data.productId) {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) {
      throw new HttpError(400, 'El producto seleccionado no existe');
    }
  }

  return prisma.promotion.create({
    data: {
      name: data.name,
      targetType: data.targetType,
      productId: data.targetType === 'PRODUCTO' ? data.productId ?? null : null,
      categoryName: data.targetType === 'CATEGORIA' ? data.categoryName ?? null : null,
      discountType: data.discountType,
      discountValue: data.discountValue,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'PROGRAMADA',
      statusHistory: {
        create: { toStatus: 'PROGRAMADA' }
      }
    },
    include: { product: true }
  });
}

export async function changePromotionStatus(id: number, newStatus: PromotionStatus) {
  const promotion = await prisma.promotion.findUnique({ where: { id } });
  if (!promotion) {
    throw new HttpError(404, 'Promoción no encontrada');
  }

  if (promotion.status === 'FINALIZADA') {
    throw new HttpError(400, 'Una promoción finalizada no puede modificarse');
  }

  if (!isTransitionAllowed(promotion.status as PromotionStatus, newStatus)) {
    throw new HttpError(
      400,
      `No se puede cambiar el estado de ${promotion.status} a ${newStatus}`
    );
  }

  return prisma.promotion.update({
    where: { id },
    data: {
      status: newStatus,
      statusHistory: {
        create: { fromStatus: promotion.status, toStatus: newStatus }
      }
    },
    include: { product: true }
  });
}

export async function deletePromotion(id: number) {
  const promotion = await prisma.promotion.findUnique({ where: { id } });
  if (!promotion) {
    throw new HttpError(404, 'Promoción no encontrada');
  }

  if (promotion.status !== 'PROGRAMADA') {
    throw new HttpError(400, 'Solo se pueden eliminar promociones en estado Programada');
  }

  await prisma.promotionStatusLog.deleteMany({ where: { promotionId: id } });
  await prisma.promotion.delete({ where: { id } });
}

export async function getSummary() {
  const [programada, activa, finalizada, all] = await Promise.all([
    prisma.promotion.count({ where: { status: 'PROGRAMADA' } }),
    prisma.promotion.count({ where: { status: 'ACTIVA' } }),
    prisma.promotion.count({ where: { status: 'FINALIZADA' } }),
    prisma.promotion.findMany({ select: { startDate: true, endDate: true } })
  ]);

  const today = new Date();
  const vigentesHoy = all.filter((p: { startDate: Date; endDate: Date }) =>
    isVigenteHoy(p.startDate, p.endDate, today)
  ).length;

  return {
    porEstado: { PROGRAMADA: programada, ACTIVA: activa, FINALIZADA: finalizada },
    vigentesHoy
  };
}
