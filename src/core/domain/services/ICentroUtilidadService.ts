import { Auto } from '../entities/Auto';

export interface VehiculoRentabilidad {
  id_auto: number;
  folio_interno: string;
  vin: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  placas: string;
  estado_logico: string;
  inversion_total: number;
  precio_actual: number;
  utilidad_proyectada: number;
  utilidad_real: number | null;
  roi_proyectado: number;
  roi_real: number | null;
  dias_inventario: number;
  alerta_antiguedad: 'rojo' | 'amarillo' | 'normal';
}

export interface ICentroUtilidadService {
  calcularRentabilidad(auto: Auto, precioVenta?: number, fechaVenta?: Date): VehiculoRentabilidad;
}
