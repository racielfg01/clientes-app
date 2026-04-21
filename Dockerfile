# Dockerfile para Render - Corregido

# Etapa 1: Construir el frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar archivos del frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ ./
RUN CI=false npm run build

# Etapa 2: Configurar el backend
FROM node:18-alpine

# Establecer directorio de trabajo directamente en backend
WORKDIR /app/backend

# Copiar archivos del backend
COPY backend/package*.json ./
RUN npm install

# Copiar el resto del backend
COPY backend/ ./

# Copiar el frontend construido
COPY --from=frontend-builder /app/frontend/build ./public

# Verificar que server.js existe
RUN test -f server.js || (echo "server.js not found in $(pwd)" && ls -la && exit 1)

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000

# Exponer puerto
EXPOSE 5000

# Iniciar el servidor (ahora server.js está en el directorio actual)
CMD ["node", "server.js"]