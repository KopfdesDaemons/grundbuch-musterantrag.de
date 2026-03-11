# Stage 1: Build
FROM node:24.12.0-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# Stage 2: Production
FROM node:24.12.0-alpine AS prod
WORKDIR /app

# install LibreOffice
RUN apk add --no-cache libreoffice openjdk8-jre

RUN mkdir -p /app/storage && chown -node:node /app/storage

# copy the built application from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist

# copy templates
COPY --chown=node:node ./server/templates /templates

ENV NODE_ENV=production

EXPOSE 4000

USER node

CMD ["node", "dist/grundbuch-musterantrag.de/server/server.mjs"]
