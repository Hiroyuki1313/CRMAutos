export type MetodoPago = 'credito_bancario' | 'contado';
export type EstatusProceso = 'proceso' | 'vendido' | 'cancelado';

export interface Apartado {
  id_venta: number;
  id_vendedor?: number;
  id_cliente?: number;
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
  comentarios_vendedor?: string;
  cita_programada?: Date;
  estatus_proceso: EstatusProceso;
}
