import { PrismaClient } from '@prisma/client';

// Instancia única de PrismaClient reutilizada en toda la app.
export const prisma = new PrismaClient();
