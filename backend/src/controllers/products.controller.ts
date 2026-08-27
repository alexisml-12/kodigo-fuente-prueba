import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

export async function getProducts(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
    res.json(products);
  } catch (err) {
    next(err);
  }
}
