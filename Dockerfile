FROM node:22

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar solo archivos de configuración para aprovechar la caché
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias sin ejecutar pnpm list
RUN pnpm install --frozen-lockfile

# Copiar el código después de instalar dependencias
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Crear un usuario sin privilegios
RUN useradd --create-home appuser
USER appuser

# Ejecutar la aplicación
CMD ["pnpm", "start"]