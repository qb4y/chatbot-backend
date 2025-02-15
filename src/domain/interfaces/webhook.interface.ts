import { WhatsAppMessage, WhatsAppStatus } from './common.interface';

export interface WebhookChange {
  value: {
    messages?: WhatsAppMessage[];
    statuses?: WhatsAppStatus[];
  };
  field: string;
}

export interface WebhookEntry {
  id: string;
  changes: WebhookChange[];
}

export interface WebhookRequest {
  object: string;
  entry: WebhookEntry[];
}
