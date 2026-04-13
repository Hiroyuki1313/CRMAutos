export type TipoAuto = 'suv' | 'sedan' | 'camion' | 'hatchback' | 'otro';
export type EstadoLogicoAuto = 'inventario' | 'frio' | 'avaluo';

export interface Auto {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo?: TipoAuto;
  version?: string;
  kilometraje?: number;
  numero_duenos?: number;
  es_toma_avaluo?: boolean;
  
  // Expediente Digital
  url_factura?: string;
  url_tarjeta_circulacion?: string;
  url_poliza_seguro?: string;
  url_ine_propietario?: string;
  url_contrato_compraventa?: string;

  fotos_url?: string[] | string;
  estado_logico: EstadoLogicoAuto;
  apartados_count?: number;
  fecha_registro_inventario?: Date;
  fecha_creacion?: Date;
}
