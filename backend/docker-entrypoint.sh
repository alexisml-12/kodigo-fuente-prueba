#!/bin/sh
set -e

echo "Aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo "Ejecutando seed (si aplica)..."
npx prisma db seed || true

echo "Iniciando servidor..."
exec node dist/index.js
