import twilio from 'twilio';

export interface IMessageGateway {
  sendWhatsAppMessage(to: string, message: string): Promise<boolean>;
  validateSignature(signature: string, url: string, params: Record<string, any>): boolean;
}

export class TwilioMessagingService implements IMessageGateway {
  private client: twilio.Twilio;
  private accountSid: string;
  private authToken: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';

    if (!this.accountSid || !this.authToken) {
      throw new Error('TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN no están configurados.');
    }

    this.client = twilio(this.accountSid, this.authToken);
  }

  async sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
    try {
      const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
      const recipient = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

      await this.client.messages.create({
        from: fromNumber,
        to: recipient,
        body: message,
      });

      return true;
    } catch (error) {
      console.error('Error al enviar mensaje vía Twilio:', error);
      return false;
    }
  }

  validateSignature(signature: string, url: string, params: Record<string, any>): boolean {
    return twilio.validateRequest(this.authToken, signature, url, params);
  }
}
