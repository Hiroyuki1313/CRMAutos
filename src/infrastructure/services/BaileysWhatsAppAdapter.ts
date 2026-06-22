import { IWhatsAppService, IWhatsAppMensaje } from '../../core/domain/services/IWhatsAppService';

export class BaileysWhatsAppAdapter implements IWhatsAppService {
  // SRP: Implementación mediante biblioteca no oficial Baileys (Web WhatsApp)
  // Requiere mantener una sesión Web activa (Código QR)
  
  public async enviarMensaje(telefono: string, mensaje: string): Promise<boolean> {
    // Lógica para enviar a través del socket de Baileys
    console.log(`[Baileys Web] Enviando mensaje a ${telefono}: ${mensaje}`);
    return true;
  }

  public async obtenerHistorial(telefono: string): Promise<IWhatsAppMensaje[]> {
    // Baileys permite leer el historial de chat directo del celular vinculado
    return [];
  }
}
