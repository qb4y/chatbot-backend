import { Injectable, Logger } from '@nestjs/common';
import { WebhookRequest } from '../../domain/interfaces/webhook.interface';
import { ProcessMessageUseCase } from './process-message.use-case';

@Injectable()
export class HandleWebhookUseCase {
  private readonly logger = new Logger(HandleWebhookUseCase.name);

  constructor(private readonly processMessageUseCase: ProcessMessageUseCase) {}

  async execute(body: WebhookRequest): Promise<void> {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.value.messages?.length) {
          await this.processMessageUseCase.execute(change.value.messages[0]);
        }
      }
    }
  }
}
