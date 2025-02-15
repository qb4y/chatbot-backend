import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppMessage } from '../../domain/interfaces/whatsapp.interface';
import { WhatsAppService } from '../../infrastructure/whatsapp/services/whatsapp.service';

@Injectable()
export class ProcessMessageUseCase {
  private readonly logger = new Logger(ProcessMessageUseCase.name);

  constructor(private readonly whatsappService: WhatsAppService) {}

  /**
   * Procesa un mensaje entrante de WhatsApp y responde automáticamente.
   */
  async execute(message: WhatsAppMessage): Promise<void> {
    try {
      if (!message.from || !message.text?.body) {
        this.logger.warn('⚠️ Mensaje recibido sin contenido o remitente.');
        throw new Error('Mensaje incompleto.');
      }

      this.logger.log(`📨 Mensaje de ${message.from}: ${message.text.body}`);

      await this.whatsappService.sendMessage(
        message.from,
        `Hola! Recibí tu mensaje: "${message.text.body}"`,
      );
    } catch (error) {
      this.logger.error('❌ Error procesando mensaje:', error);
    }
  }
}
