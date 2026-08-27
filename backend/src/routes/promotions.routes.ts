import { Router } from 'express';
import {
  getPromotions,
  postPromotion,
  patchPromotionStatus,
  removePromotion,
  getSummary
} from '../controllers/promotions.controller';

export const promotionsRouter = Router();

promotionsRouter.get('/', getPromotions);
promotionsRouter.post('/', postPromotion);
promotionsRouter.get('/summary', getSummary);
promotionsRouter.patch('/:id/status', patchPromotionStatus);
promotionsRouter.delete('/:id', removePromotion);
