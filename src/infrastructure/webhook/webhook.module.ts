import { Module } from '@nestjs/common';
import { WebhookController } from '../../adapters/controllers/webhook.controller';
import { WebhookService } from './services/webhook.service';

@Module({
  controllers: [WebhookController], // Controlador del Webhook
  providers: [WebhookService], // Servicio que maneja la lógica de negocio
})
export class WebhookModule {}
