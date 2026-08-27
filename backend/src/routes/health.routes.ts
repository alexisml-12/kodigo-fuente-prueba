import { Router } from 'express';
import { prisma } from '../db/prisma';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', db: 'up' });
  } catch (err) {
    console.error('Health check falló:', err);
    res.status(503).json({ status: 'error', db: 'down' });
  }
});
