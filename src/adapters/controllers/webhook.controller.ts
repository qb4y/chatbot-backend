import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { WebhookService } from '../../infrastructure/webhook/services/webhook.service';
import { WebhookRequest } from '../../domain/interfaces/webhook.interface';

@Controller('api/webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN =
      process.env.WHATSAPP_VERIFY_TOKEN || 'mi_token_secreto';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado correctamente.');
      return res.status(HttpStatus.OK).send(challenge);
    } else {
      console.warn('⚠️ Verificación fallida. Token incorrecto.');
      return res.status(HttpStatus.FORBIDDEN).send('Verificación fallida.');
    }
  }

  @Post()
  async receiveMessage(@Body() body: WebhookRequest, @Res() res: Response) {
    console.log('📩 Webhook recibido:', JSON.stringify(body, null, 2));

    try {
      await this.webhookService.handleWebhookEvent(body);
      return res.status(HttpStatus.OK).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('❌ Error procesando el webhook:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error interno del servidor.');
    }
  }
}
