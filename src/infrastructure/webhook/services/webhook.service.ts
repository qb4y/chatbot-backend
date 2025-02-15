import { Injectable, Logger } from '@nestjs/common';
import { WebhookRequest } from '../../../domain/interfaces/webhook.interface';
import {
  WhatsAppMessage,
  WhatsAppStatus,
} from '../../../domain/interfaces/whatsapp.interface';
import { WhatsAppService } from '../../whatsapp/services/whatsapp.service';
import { ProcessMessageUseCase } from '../../../application/use-cases/process-message.use-case';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private processedStatuses = new Set<string>();

  constructor(
    private readonly processMessageUseCase: ProcessMessageUseCase,
    private readonly whatsappService: WhatsAppService,
  ) {}

  /**
   * Procesa los eventos recibidos en el Webhook.
   */
  async handleWebhookEvent(body: WebhookRequest): Promise<void> {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.value.messages?.length) {
          await this.processMessageUseCase.execute(change.value.messages[0]);
        }
      }
    }
  }

  /**
   * Procesa un mensaje entrante de WhatsApp.
   */
  private async processIncomingMessage(
    message: WhatsAppMessage,
  ): Promise<void> {
    if (
      !message ||
      typeof message !== 'object' ||
      !message.from ||
      !message.text?.body
    ) {
      this.logger.warn('⚠️ Mensaje recibido sin contenido o remitente.');
      throw new Error('Mensaje incompleto.');
    }

    this.logger.log(`📨 Mensaje de ${message.from}: ${message.text.body}`);

    // Enviar respuesta automática usando WhatsAppService
    await this.whatsappService.sendMessage(
      message.from,
      `Hola! Recibí tu mensaje: "${message.text.body}"`,
    );
  }

  /**
   * Procesa el estado de un mensaje enviado.
   */
  private processMessageStatus(status: WhatsAppStatus): void {
    if (!status || typeof status !== 'object' || !status.id || !status.status) {
      this.logger.warn('⚠️ Estado de mensaje inválido recibido.');
      return;
    }

    if (!this.processedStatuses.has(status.id)) {
      this.processedStatuses.add(status.id);
      this.logger.log(`🔹 Estado de mensaje actualizado: ${status.status}`);
    }
  }
}
