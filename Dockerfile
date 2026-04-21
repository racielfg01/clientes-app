# Dockerfile para Render - Construye backend y frontend

# Etapa 1: Construir el frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar archivos del frontend
COPY frontend/package*.json ./
RUN npm ci --only=production || npm install

COPY frontend/ ./
RUN npm run build

# Etapa 2: Configurar el backend
FROM node:18-alpine

WORKDIR /app

# Copiar backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production || npm install

# Copiar código del backend
COPY backend/ ./backend/

# Copiar el frontend construido
COPY --from=frontend-builder /app/frontend/build /app/backend/public

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000

# Exponer puerto
EXPOSE 5000

# Iniciar el servidor
WORKDIR /app/backend
CMD ["node", "server.js"]
