import express from 'express';
import cors from 'cors';
import { promotionsRouter } from './routes/promotions.routes';
import { productsRouter } from './routes/products.routes';
import { healthRouter } from './routes/health.routes';
import { errorHandler } from './middlewares/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/promotions', promotionsRouter);
  app.use('/api/products', productsRouter);

  app.use(errorHandler);

  return app;
}
