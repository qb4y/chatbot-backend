export interface WhatsAppMessage {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: {
    profile: { name: string };
    wa_id: string;
  }[];
  messages?: {
    from: string;
    id: string;
    timestamp: string;
    text?: { body: string };
    type: string;
  }[];
}
