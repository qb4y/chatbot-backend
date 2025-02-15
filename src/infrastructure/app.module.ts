import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandleWebhookUseCase } from 'src/application/use-cases/handle-webhook.use-case';
import { WebhookController } from '../adapters/controllers/webhook.controller';
import { WebhookService } from './webhook/services/webhook.service';
import { WhatsAppService } from './whatsapp/services/whatsapp.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [WebhookController],
  providers: [WebhookService, WhatsAppService, HandleWebhookUseCase],
})
export class AppModule {}
