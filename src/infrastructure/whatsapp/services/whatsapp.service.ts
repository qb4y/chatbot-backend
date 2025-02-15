import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppRepository } from '../../../domain/repositories/whatsapp.repository';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsAppService implements WhatsAppRepository {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly WHATSAPP_API_URL: string;
  private readonly ACCESS_TOKEN: string;

  constructor(
    private readonly httpService: HttpService, // Asegurar que esto esté presente
    private readonly configService: ConfigService,
  ) {
    this.WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${this.configService.get<string>('PHONE_NUMBER_ID')}/messages`;
    this.ACCESS_TOKEN = this.configService.get<string>(
      'WHATSAPP_ACCESS_TOKEN',
      '',
    );
  }

  async sendMessage(to: string, text: string): Promise<void> {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      text: { body: text },
    };

    try {
      await firstValueFrom(
        this.httpService.post(this.WHATSAPP_API_URL, payload, {
          headers: {
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      this.logger.log(`✅ Mensaje enviado a ${to}`);
    } catch (error: any) {
      this.logger.error('❌ Error enviando mensaje:', (error as Error).message);
      throw new Error('Error al enviar mensaje');
    }
  }
}
