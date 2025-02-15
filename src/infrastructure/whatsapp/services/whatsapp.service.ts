import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppResponse } from '../../../domain/interfaces/whatsapp-response.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly WHATSAPP_API_URL: string;
  private readonly ACCESS_TOKEN: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${this.configService.get<string>('PHONE_NUMBER_ID')}/messages`;
    this.ACCESS_TOKEN = this.configService.get<string>(
      'WHATSAPP_ACCESS_TOKEN',
      '',
    );
  }

  /**
   * Envía un mensaje a través de la API de WhatsApp.
   */
  async sendMessage(to: string, text: string): Promise<void> {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      text: { body: text },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<WhatsAppResponse>(
          this.WHATSAPP_API_URL,
          payload,
          {
            headers: {
              Authorization: `Bearer ${this.ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `✅ Mensaje enviado a ${to}: ${response.data?.messages?.[0]?.id || 'Sin ID'}`,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          '❌ Error enviando mensaje:',
          error.response?.data || error.message,
        );
      } else {
        this.logger.error('❌ Error desconocido:', String(error));
      }

      throw new Error('Error al enviar mensaje');
    }
  }
}
