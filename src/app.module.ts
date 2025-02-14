import { Module } from '@nestjs/common';
import { WebhookController } from './webhook/webhook.controller';

@Module({
  imports: [],
  controllers: [WebhookController],
  providers: [],
})
export class AppModule {}
