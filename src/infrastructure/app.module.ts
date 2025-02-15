import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WebhookModule } from './webhook/webhook.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    WebhookModule, // Asegurar que esté aquí
    WhatsAppModule,
  ],
})
export class AppModule {}
