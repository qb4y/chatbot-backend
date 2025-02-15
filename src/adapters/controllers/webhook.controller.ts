import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { HandleWebhookUseCase } from 'src/application/use-cases/handle-webhook.use-case';
import { WebhookRequestDto } from '../dtos/webhook.dto';

@Controller('api/webhook')
export class WebhookController {
  constructor(
    private readonly handleWebhookUseCase: HandleWebhookUseCase,
    private readonly logger = new Logger(WebhookController.name),
  ) {}

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
      this.logger.warn('⚠️ Verificación fallida. Token incorrecto.');
      return res.status(HttpStatus.FORBIDDEN).send('Verificación fallida.');
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async receiveMessage(@Body() body: WebhookRequestDto, @Res() res: Response) {
    this.logger.log(`📩 Webhook recibido: ${JSON.stringify(body)}`);

    try {
      await this.handleWebhookUseCase.execute(body);
      return res.status(HttpStatus.OK).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('❌ Error procesando el webhook:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error interno del servidor.');
    }
  }
}
