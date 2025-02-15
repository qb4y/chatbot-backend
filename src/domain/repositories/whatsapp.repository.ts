export interface WhatsAppRepository {
  sendMessage(to: string, text: string): Promise<void>;
}
