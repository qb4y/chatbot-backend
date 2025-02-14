# Usar la última versión LTS de Node.js
FROM node:22

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Crear y definir el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración antes de instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias y depurar errores
RUN pnpm install --frozen-lockfile && pnpm list

# Copiar el código del backend después de instalar dependencias
COPY . .

# Exponer el puerto donde se ejecutará NestJS
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["pnpm", "start"]