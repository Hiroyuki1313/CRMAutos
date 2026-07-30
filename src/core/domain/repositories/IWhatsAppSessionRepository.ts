import { WhatsAppSession } from '../entities/WhatsAppSession';

export interface IWhatsAppSessionRepository {
  findByUserId(userId: string): Promise<WhatsAppSession | null>;
  save(session: WhatsAppSession): Promise<WhatsAppSession>;
}
