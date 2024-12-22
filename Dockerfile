# Stage 1: Build-Phase
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod


# Stage 2: Entwicklungs-Phase
FROM node:20-alpine AS dev
WORKDIR /app

# Installiere LibreOffice
RUN apk add --no-cache libreoffice openjdk8-jre

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--disable-host-check"]


# Stage 3: Produktion
FROM node:20-alpine AS prod
WORKDIR /app

# Installiere LibreOffice
RUN apk add --no-cache libreoffice openjdk8-jre

# Kopiere das Build-Ergebnis
COPY --from=builder /app/dist ./dist

EXPOSE 4000
# Node starten
CMD ["node", "dist/grundbuch-musterantrag.de/server/server.mjs"]
