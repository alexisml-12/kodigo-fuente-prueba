#!/bin/sh
set -e

echo "Sincronizando el esquema con la base de datos..."
npx prisma db push --skip-generate --accept-data-loss

echo "Ejecutando seed (si aplica)..."
npx prisma db seed || true

echo "Iniciando servidor..."
exec node dist/index.js
