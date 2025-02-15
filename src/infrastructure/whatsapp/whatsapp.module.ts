import { Module } from '@nestjs/common';
import { WhatsAppService } from './services/whatsapp.service';

@Module({
  providers: [WhatsAppService],
  exports: [WhatsAppService], // Exportamos para que WebhookModule pueda usarlo
})
export class WhatsAppModule {}
