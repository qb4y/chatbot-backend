# Usar la última versión LTS de Node.js
FROM node:22

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Crear y definir el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar el código del backend
COPY . .

# Exponer el puerto donde se ejecutará NestJS
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["pnpm", "start"]