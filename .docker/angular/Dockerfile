# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Stage 2: Production
FROM node:20-alpine AS prod
WORKDIR /app

# install LibreOffice
RUN apk add --no-cache libreoffice openjdk8-jre

# copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# copy templates
COPY ./server/templates /templates

EXPOSE 4000
# Node starten
CMD ["node", "dist/grundbuch-musterantrag.de/server/server.mjs"]
