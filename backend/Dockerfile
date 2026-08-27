FROM node:20-alpine AS build
# Prisma necesita OpenSSL para su motor de consultas; node:20-alpine no lo trae por defecto.
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate
COPY --from=build /app/dist ./dist
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
