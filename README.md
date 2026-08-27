# Módulo de Gestión de Promociones

Aplicación web para registrar y gestionar promociones de productos en un POS: crear promociones, controlar su vigencia y su estado (`Programada → Activa → Finalizada`), y ver un resumen por estado.

Stack: React + Vite (frontend), Node.js + Express + Prisma (backend), SQL Server (base de datos). Ver [`DECISIONS.md`](./DECISIONS.md) para el detalle y la justificación de estas decisiones.

## Requisitos previos

- [Docker](https://www.docker.com/) y Docker Compose (viene incluido en Docker Desktop).
- No se necesita tener Node ni SQL Server instalados localmente: todo corre dentro de contenedores.

## Levantar el proyecto localmente

1. Clona el repositorio y entra a la carpeta del proyecto.

2. Copia el archivo de variables de entorno de ejemplo y ajusta la contraseña de la base de datos:

   ```bash
   cp .env.example .env
   ```

   Abre `.env` y reemplaza `MSSQL_SA_PASSWORD` por una contraseña fuerte (SQL Server exige mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolos). Los demás valores por defecto funcionan para desarrollo local.

3. Levanta todo el stack:

   ```bash
   docker compose up --build
   ```

   Esto va a:
   - Levantar SQL Server y esperar a que esté saludable.
   - Crear la base de datos `promociones` si no existe.
   - Aplicar las migraciones de Prisma y poblar un catálogo de productos de ejemplo.
   - Levantar el backend en `http://localhost:4000`.
   - Levantar el frontend en `http://localhost:5173`.

4. Abre `http://localhost:5173` en el navegador.

5. Para verificar que el backend está sano: `http://localhost:4000/health` debe responder `200 OK`.

6. Para apagar todo (y borrar los datos de la base):

   ```bash
   docker compose down -v
   ```

## Desarrollo sin Docker (opcional)

Si prefieres correr backend y frontend directamente con Node (por ejemplo para tener hot-reload más rápido), necesitas una instancia de SQL Server accesible (puedes levantar solo ese servicio con `docker compose up db db-init`):

**Backend**

```bash
cd backend
cp .env.example .env   # ajusta DATABASE_URL apuntando a tu SQL Server
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

**Frontend**

```bash
cd frontend
cp .env.example .env   # ajusta VITE_API_URL si es necesario
npm install
npm run dev
```

## Scripts útiles

En `backend/` y `frontend/`:

- `npm run lint` — linter (ESLint).
- `npm test` — pruebas unitarias (Vitest).
- `npm run build` — build de producción.

## Endpoints principales del backend

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/health` | Estado de la app y de la conexión a base de datos |
| GET | `/api/products` | Catálogo de productos (para el selector del formulario) |
| GET | `/api/promotions` | Listado de promociones |
| POST | `/api/promotions` | Crear una promoción |
| PATCH | `/api/promotions/:id/status` | Avanzar el estado de una promoción |
| DELETE | `/api/promotions/:id` | Eliminar una promoción (solo si está `Programada`) |
| GET | `/api/promotions/summary` | Conteo por estado y promociones vigentes hoy |

## CI/CD

El repositorio incluye un flujo de GitHub Actions (`.github/workflows/ci.yml`) con cuatro etapas dependientes: `lint` → `test` → `build` → `smoke-test`. La última etapa levanta la aplicación completa con `docker compose` y verifica que `/health` responda `200 OK`.

Para que el smoke test funcione en GitHub Actions, configura en el repositorio (**Settings → Secrets and variables → Actions → New repository secret**) el secret:

- `MSSQL_SA_PASSWORD`: contraseña que usará SQL Server durante el pipeline.

Si el secret no está configurado, el pipeline falla explícitamente en la etapa `smoke-test` con un mensaje indicando qué falta, en vez de fallar de forma confusa más adelante.
