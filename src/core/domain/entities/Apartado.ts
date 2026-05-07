export type MetodoPago = 'credito_bancario' | 'contado';
export type EstatusCredito = 'pendiente respuesta' | 'autorizado' | 'rechazado' | 'condicionado';

export interface Apartado {
  id_venta: number;
  id_vendedor?: number;
  id_carro?: number;
  acudio_cita: boolean;
  hizo_demo: boolean;
  cotizacion_url?: string;
  metodo_pago?: MetodoPago;
  banco_financiera?: string;
  toma_a_cuenta: boolean;
  monto_apartado?: number;
  ofrecimiento_cliente?: number;
  fecha_proximo_seguimiento?: Date;
  fecha_proxima_cita?: Date;
  fecha_recordatorio_mensaje?: Date;
  id_avaluo?: number;
  estatus_credito: EstatusCredito;
  probabilidad?: 'Frio' | 'Bajo' | 'Medio' | 'Alto' | 'Venta' | 'Rechazo' | 'Largo Plazo';
  // New Grid Fields
  comentarios_vendedor?: string;
  proximo_seguimiento_texto?: string;
  fecha_primera_cita?: Date;
  cotizacion_realizada?: boolean;
  apartado_realizado?: boolean;
  avaluo_monto_oferta?: number;
  // Prospect Fields
  nombre_prospecto?: string;
  telefono_prospecto?: string;
  ine_url?: string;
  comprobante_domicilio_url?: string;
  estados_cuenta_url?: string;
  licencia_contrato_url?: string;
  seguro_url?: string;
  fecha_registro_prospecto?: Date;
  origen_prospecto?: 'ads' | 'piso' | 'redes';
  // Extra info from JOIN
  marca?: string;
  modelo?: string;
  anio?: number;
}
