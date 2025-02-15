import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WebhookController } from '../adapters/controllers/webhook.controller';
import { WebhookService } from './webhook/services/webhook.service';
import { WhatsAppService } from './whatsapp/services/whatsapp.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [WebhookController],
  providers: [WebhookService, WhatsAppService],
})
export class AppModule {}
