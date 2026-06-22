export interface IWhatsAppMensaje {
  id: string;
  prospectoId: string;
  remitente: string; // Vendedor o Prospecto
  contenido: string;
  fecha: Date;
}

export interface IWhatsAppService {
  // SRP: Encargado de enviar y recibir mensajes independientemente del proveedor
  enviarMensaje(telefono: string, mensaje: string): Promise<boolean>;
  obtenerHistorial(telefono: string): Promise<IWhatsAppMensaje[]>;
}
