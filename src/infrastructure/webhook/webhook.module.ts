import { Module } from '@nestjs/common';
import { WebhookController } from '../../adapters/controllers/webhook.controller';
import { WebhookService } from './services/webhook.service';
import { ProcessMessageUseCase } from '../../application/use-cases/process-message.use-case';
import { HandleWebhookUseCase } from '../../application/use-cases/handle-webhook.use-case';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [WhatsAppModule], // Importamos el módulo de WhatsApp
  controllers: [WebhookController],
  providers: [
    WebhookService,
    ProcessMessageUseCase,
    HandleWebhookUseCase, // Agregar este caso de uso
  ],
  exports: [ProcessMessageUseCase, HandleWebhookUseCase], // Exportarlo
})
export class WebhookModule {}
