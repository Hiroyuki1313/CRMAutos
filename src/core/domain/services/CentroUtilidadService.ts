import { Auto } from '../entities/Auto';
import { ICentroUtilidadService, VehiculoRentabilidad } from './ICentroUtilidadService';
import { autoFinancialCalculator } from './AutoFinancialCalculator';

export class CentroUtilidadService implements ICentroUtilidadService {
  
  public calcularRentabilidad(auto: Auto, precioVenta?: number, fechaVenta?: Date): VehiculoRentabilidad {
    const invTotal = autoFinancialCalculator.calculateTotalInvertido(auto);
    const dias = this.obtenerDiasEnInventario(auto, fechaVenta);
    
    const utilProyectada = (auto.precio_publicacion || 0) - invTotal;
    const utilReal = precioVenta !== undefined && precioVenta !== null ? (precioVenta - invTotal) : null;
    
    return {
      id_auto: auto.id,
      folio_interno: auto.folio_interno || `INV-${auto.id}`,
      vin: auto.vin || '',
      marca: auto.marca,
      modelo: auto.modelo,
      anio: auto.anio,
      color: auto.color || '',
      placas: auto.placas || '',
      estado_logico: auto.estado_logico,
      inversion_total: invTotal,
      precio_actual: precioVenta !== undefined && precioVenta !== null ? precioVenta : (auto.precio_publicacion || 0),
      utilidad_proyectada: utilProyectada,
      utilidad_real: utilReal,
      roi_proyectado: invTotal > 0 ? (utilProyectada / invTotal) * 100 : 0,
      roi_real: (precioVenta !== undefined && precioVenta !== null && invTotal > 0) ? (utilReal! / invTotal) * 100 : null,
      dias_inventario: dias,
      alerta_antiguedad: this.obtenerAlertaAntiguedad(dias, auto.estado_logico)
    };
  }

  private obtenerDiasEnInventario(auto: Auto, fechaVenta?: Date): number {
    const fechaRef = auto.fecha_registro_inventario ? new Date(auto.fecha_registro_inventario) : new Date(auto.fecha_creacion || new Date());
    const fin = fechaVenta ? new Date(fechaVenta) : new Date();
    const diffMs = fin.getTime() - fechaRef.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  private obtenerAlertaAntiguedad(dias: number, estado: string): 'rojo' | 'amarillo' | 'normal' {
    if (estado === 'venta') return 'normal'; // Si ya se vendió, no alerta
    if (dias >= 120) return 'rojo';
    if (dias >= 90) return 'amarillo';
    return 'normal';
  }
}
