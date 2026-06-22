import { IWhatsAppService, IWhatsAppMensaje } from '../../core/domain/services/IWhatsAppService';

export class MetaWhatsAppAdapter implements IWhatsAppService {
  // SRP: Implementación de envío mediante la API Oficial de Meta (Graph API)
  
  public async enviarMensaje(telefono: string, mensaje: string): Promise<boolean> {
    // Aquí iría la lógica HTTP POST a Graph API
    console.log(`[Meta API] Enviando mensaje a ${telefono}: ${mensaje}`);
    return true;
  }

  public async obtenerHistorial(telefono: string): Promise<IWhatsAppMensaje[]> {
    // Con la API de Meta, típicamente dependes de Webhooks para guardar el historial
    // Por lo que el historial realmente se leería de nuestra propia base de datos
    return [];
  }
}
