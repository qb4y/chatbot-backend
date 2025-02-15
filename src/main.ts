import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';
import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  app.setGlobalPrefix('api');
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/api`);
}

void bootstrap();
