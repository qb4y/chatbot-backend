export class WhatsAppMessage {
  constructor(
    public readonly from: string,
    public readonly text: { body: string },
    public readonly id: string,
    public readonly timestamp: string,
  ) {}
}
