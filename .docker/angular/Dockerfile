# Stage 1: Build
FROM node:26.0.0-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# Stage 2: Production
FROM node:26.0.0-alpine AS prod
WORKDIR /app

# Install LibreOffice and Python 3 (for persistent UNO daemon)
RUN apk add --no-cache libreoffice python3 font-liberation

# Install MySQL to use mysqldump
RUN apk add --no-cache mysql-client

# Copy the built application from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist

# Copy templates and Python UNO worker script
COPY --chown=node:node ./server/templates /templates
COPY --chown=node:node ./server/helpers/uno-worker.py ./server/helpers/uno-worker.py

ENV NODE_ENV=production

EXPOSE 4000

USER node

CMD ["node", "dist/grundbuch-musterantrag.de/server/server.mjs"]
