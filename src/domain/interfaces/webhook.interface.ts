export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: string;
}

export interface WhatsAppStatus {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
}

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
