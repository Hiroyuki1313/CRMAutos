export type UbicacionPlaza = 'Chihuahua' | 'Juárez' | 'Saltillo' | 'Otro';
export type OrigenProspeccion = 'redes sociales' | 'cartera' | 'prospeccion' | 'piso' | 'eventos' | 'recomendados';
export type SubEstadoAvaluo = 'frio' | 'medio' | 'alto' | 'toma' | 'rechazo';

export interface Avaluo {
  id: number;
  id_auto: number;
  
  // Datos unidos (JOIN) para visualización informativa
  marca?: string;
  modelo?: string;
  anio?: number;

  ubicacion: UbicacionPlaza;
  origen_prospeccion?: OrigenProspeccion;
  oferta?: number;
  compra?: number;
  venta?: number;
  hoja_avaluo_url?: string;
  foto_principal_url?: string;
  comentarios_historial?: any;
  sub_estado_avaluo: SubEstadoAvaluo;
  fecha_registro: Date;
}
