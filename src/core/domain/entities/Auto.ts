export type TipoAuto = 'suv' | 'sedan' | 'camion' | 'hatchback' | 'otro';
export type EstadoLogicoAuto = 'inventario' | 'frio';

export interface Auto {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo?: TipoAuto;
  fotos_url?: any; // JSON string in DB, parsed to object array or string
  estado_logico: EstadoLogicoAuto;
  fecha_registro_inventario?: Date;
  fecha_creacion: Date;
}
