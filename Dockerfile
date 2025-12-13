# ---------- BUILD ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Dependencias necesarias para Prisma
RUN apk add --no-cache openssl

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Prisma
RUN npx prisma generate

# Build Nest
RUN yarn build


# ---------- PRODUCTION ----------
FROM node:20-alpine AS prod
WORKDIR /app

# Solo lo mínimo necesario
RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile && yarn cache clean

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 4000
CMD ["./entrypoint.sh"]
