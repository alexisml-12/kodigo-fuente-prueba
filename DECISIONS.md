# Decisiones técnicas

Este documento explica las decisiones de arquitectura y herramientas tomadas para el módulo de gestión de promociones.

## Stack

- **Frontend:** React 18 + Vite + TypeScript.
- **Backend:** Node.js + Express + TypeScript.
- **ORM / acceso a datos:** Prisma, con `provider = "sqlserver"`.
- **Base de datos:** SQL Server 2022 (imagen oficial `mcr.microsoft.com/mssql/server`).
- **Validación:** Zod, tanto en el backend (fuente de verdad) como replicada de forma simple en el formulario del frontend para dar feedback inmediato.
- **Testing:** Vitest en ambos proyectos (además de Testing Library en el frontend y Supertest en el backend).

## Por qué Node + Express en vez de Laravel

Se eligió Node porque el resto del stack (frontend en React/Vite) ya vive en el ecosistema de JavaScript/TypeScript, lo que permite compartir tipos entre frontend y backend, reducir el contexto de cambio y mantener una sola cadena de herramientas (npm, ESLint, Vitest) para todo el proyecto. Express se usó por ser minimalista y suficiente para el tamaño de esta prueba, sin necesitar la estructura más pesada de un framework como NestJS.

## Por qué Prisma

Prisma da migraciones versionadas, un cliente tipado a partir del schema (reduce errores en tiempo de compilación) y soporte oficial para SQL Server. Para una prueba técnica evaluada, el tipado end-to-end (schema → cliente → controladores) demuestra buenas prácticas sin agregar complejidad operativa relevante.

## Por qué SQL Server

Se eligió SQL Server porque es la con la que tengo más experiencia reciente, lo que reduce el riesgo de errores de configuración dentro del tiempo disponible para la prueba. El modelo de datos es completamente relacional (promociones con estado, tipo de descuento y vigencia), por lo que una base relacional encaja mejor que una orientada a documentos.

## Modelo de datos (2+ tablas)

- **`products`**: catálogo simple de productos con su categoría. Se usa para poblar el selector del formulario y para que una promoción pueda asociarse a un producto puntual o a toda una categoría (por nombre de categoría).
- **`promotions`**: la tabla principal, con nombre, tipo de asociación (`PRODUCTO`/`CATEGORIA`), tipo y valor de descuento, fechas de vigencia y estado (`PROGRAMADA`/`ACTIVA`/`FINALIZADA`).
- **`promotion_status_log`**: historial de cada cambio de estado de una promoción (de qué estado a cuál y cuándo). No es un requisito explícito del enunciado, pero es una forma realista y de bajo costo de tener una segunda tabla relacionada por FK, en vez de una tabla "de relleno" sin propósito, y sirve como pista de auditoría.

## Reglas de negocio implementadas

- Transiciones de estado controladas explícitamente en `statusTransitions.ts`: solo `Programada → Activa → Finalizada`, sin saltos ni retrocesos. Una promoción `Finalizada` no admite más cambios (ni de estado ni eliminación).
- Eliminación restringida a promociones en estado `Programada`.
- Validación de fechas (`fin > inicio`) y de rango de porcentaje (1-100) con Zod, devolviendo errores 400 legibles.
- "Vigente hoy" se calcula de forma independiente del campo `status`: compara la fecha actual contra el rango `[startDate, endDate]` de cada promoción. Esto es intencional: el estado lo cambia un usuario manualmente (como pide el enunciado), mientras que "vigente hoy" es un dato derivado y siempre honesto respecto a la fecha real, útil para detectar justamente el tipo de inconsistencia que este proyecto busca evitar (una promoción que sigue "Activa" fuera de su rango de fechas, por ejemplo).

## Docker y arranque

- `docker-compose.yml` levanta `db` (SQL Server), un servicio `db-init` de un solo uso que crea la base de datos si no existe (SQL Server no la crea automáticamente como sí hacen Postgres/MySQL), `backend` y `frontend`.
- El backend corre `prisma migrate deploy` y `prisma db seed` en su entrypoint antes de arrancar el servidor, así que `docker-compose up` deja el sistema listo para usarse sin pasos manuales adicionales.
- El frontend se sirve con Nginx sobre una imagen `node:20-alpine` usada solo para el build (multi-stage), manteniendo la imagen final liviana.

## CI/CD y manejo de secretos

- El pipeline de GitHub Actions corre en etapas dependientes (`lint` → `test` → `build` → `smoke-test`) usando `needs`, de modo que si el linter falla no se llega ni a intentar el build.
- El único secreto necesario para el smoke test es `MSSQL_SA_PASSWORD` (contraseña del usuario `sa` de SQL Server), que debe configurarse como GitHub Secret del repositorio. El job `smoke-test` falla explícitamente con un mensaje claro si esa variable no está definida, antes de intentar levantar los contenedores.
- No hay ningún valor real de credenciales en el repositorio; `.env.example` (raíz, backend y frontend) documenta las variables necesarias sin valores reales.
