export type TipoAuto = 'suv' | 'sedan' | 'camion' | 'hatchback' | 'otro';
export type EstadoLogicoAuto = 'inventario' | 'frio' | 'avaluo';

export interface Auto {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo?: TipoAuto;
  fotos_url?: string[] | string;
  estado_logico: EstadoLogicoAuto;
  apartados_count?: number;
  fecha_registro_inventario?: Date;
  fecha_creacion?: Date;
}
