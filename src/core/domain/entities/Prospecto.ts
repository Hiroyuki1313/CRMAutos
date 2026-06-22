export enum EtapaEmbudo {
  NUEVO = 'NUEVO',
  CONTACTADO = 'CONTACTADO',
  CITA = 'CITA',
  VISITA = 'VISITA',
  PRUEBA_MANEJO = 'PRUEBA_MANEJO',
  COTIZACION = 'COTIZACION',
  APARTADO = 'APARTADO',
  VENTA = 'VENTA',
  ENTREGADO = 'ENTREGADO',
}

export enum OrigenProspecto {
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
  INSTAGRAM = 'INSTAGRAM',
  WHATSAPP = 'WHATSAPP',
  REFERIDO = 'REFERIDO',
}

export enum ScoreFinanciamiento {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAJA = 'BAJA',
  NO_APLICA = 'NO_APLICA',
}

export class Prospecto {
  constructor(
    public readonly id: string,
    public readonly usuarioAsignadoId: string, // Vendedor
    public readonly vehiculoInteresId: string,
    public readonly nombre: string,
    public readonly telefono: string,
    public readonly ciudad: string,
    public readonly origen: OrigenProspecto,
    public etapaEmbudo: EtapaEmbudo,
    public scoreFinanciamiento: ScoreFinanciamiento
  ) {}

  public avanzarEmbudo(nuevaEtapa: EtapaEmbudo): void {
    this.etapaEmbudo = nuevaEtapa;
  }
}
