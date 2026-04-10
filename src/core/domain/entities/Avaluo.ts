export type UbicacionPlaza = 'Chihuahua' | 'Juárez' | 'Saltillo' | 'Otro';
export type OrigenProspeccion = 'redes sociales' | 'cartera' | 'prospeccion' | 'piso' | 'eventos' | 'recomendados';
export type SubEstadoAvaluo = 'frio' | 'medio' | 'alto' | 'toma' | 'rechazo';

export interface Avaluo {
  id: number;
  marca?: string;
  modelo?: string;
  anio?: number;
  foto_principal_url?: string;
  ubicacion?: UbicacionPlaza;
  origen_prospeccion?: OrigenProspeccion;
  oferta?: number; // DECIMAL(12,2) en BD, parsea a number
  compra?: number;
  venta?: number;
  hoja_avaluo_url?: string;
  comentarios_historial?: any; // JSON Object // string o array según libreria
  sub_estado_avaluo: SubEstadoAvaluo;
  fecha_registro: Date;
}
