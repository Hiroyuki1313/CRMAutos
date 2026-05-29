export type TipoAuto = 'suv' | 'sedan' | 'camion' | 'hatchback' | 'otro';
export type EstadoLogicoAuto = 'inventario' | 'frio' | 'avaluo' | 'venta';

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
  // Costos Financieros e Inventario
  costo_adquisicion?: number;
  precio_costo?: number;

  // Acondicionamientos
  acondicionamiento_llantas?: number;
  acondicionamiento_pintura?: number;
  acondicionamiento_mecanica?: number;
  acondicionamiento_refacciones?: number;
  acondicionamiento_accesorios?: number;
  acondicionamiento_limpieza?: number;
  acondicionamiento_tapiceria?: number;
  acondicionamiento_odometros?: number;
  acondicionamiento_pulido?: number;
  acondicionamiento_mecanica_servicios?: number;
  acondicionamiento_mecanica_reparaciones?: number;

  // Gastos y Comisiones
  publicidad?: number;
  gestion_administrativa?: number;
  comision?: number;

  apartados_count?: number;
  fecha_registro_inventario?: Date;
  fecha_creacion?: Date;
}
