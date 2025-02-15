import { Module } from '@nestjs/common';
import { WebhookController } from '../../adapters/controllers/webhook.controller';
import { WebhookService } from './services/webhook.service';
import { ProcessMessageUseCase } from '../../application/use-cases/process-message.use-case';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [WhatsAppModule], // Importamos el módulo de WhatsApp
  controllers: [WebhookController],
  providers: [WebhookService, ProcessMessageUseCase], // Agregamos el caso de uso
  exports: [ProcessMessageUseCase], // Lo exportamos para que otros módulos lo usen
})
export class WebhookModule {}
