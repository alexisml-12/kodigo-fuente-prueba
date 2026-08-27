import type { Request, Response, NextFunction } from 'express';
import { createPromotionSchema, changeStatusSchema } from '../validators/promotion.schema';
import * as promotionsService from '../services/promotions.service';
import { HttpError } from '../middlewares/errorHandler';

export async function getPromotions(_req: Request, res: Response, next: NextFunction) {
  try {
    const promotions = await promotionsService.listPromotions();
    res.json(promotions);
  } catch (err) {
    next(err);
  }
}

export async function postPromotion(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createPromotionSchema.parse(req.body);
    const promotion = await promotionsService.createPromotion(data);
    res.status(201).json(promotion);
  } catch (err) {
    next(err);
  }
}

export async function patchPromotionStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw new HttpError(400, 'Id inválido');
    }
    const { status } = changeStatusSchema.parse(req.body);
    const promotion = await promotionsService.changePromotionStatus(id, status);
    res.json(promotion);
  } catch (err) {
    next(err);
  }
}

export async function removePromotion(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw new HttpError(400, 'Id inválido');
    }
    await promotionsService.deletePromotion(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getSummary(_req: Request, res: Response, next: NextFunction) {
  try {
    const summary = await promotionsService.getSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
}
