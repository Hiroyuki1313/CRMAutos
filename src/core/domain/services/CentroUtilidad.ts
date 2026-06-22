import { ICentroUtilidad } from './ICentroUtilidad';
import { Vehiculo } from '../entities/Vehiculo';
import { GastoCosteo } from '../entities/GastoCosteo';

export class CentroUtilidad implements ICentroUtilidad {
  
  public calcularInversionTotal(vehiculo: Vehiculo, gastos: GastoCosteo[]): number {
    const totalGastos = gastos.reduce((sum, gasto) => sum + Number(gasto.monto), 0);
    return Number(vehiculo.precioCompra) + totalGastos;
  }

  public calcularUtilidadProyectada(vehiculo: Vehiculo, gastos: GastoCosteo[]): number {
    const inversionTotal = this.calcularInversionTotal(vehiculo, gastos);
    return Number(vehiculo.precioObjetivo) - inversionTotal;
  }

  public calcularROI(vehiculo: Vehiculo, gastos: GastoCosteo[]): number {
    const inversionTotal = this.calcularInversionTotal(vehiculo, gastos);
    if (inversionTotal === 0) return 0;
    
    const utilidadProyectada = this.calcularUtilidadProyectada(vehiculo, gastos);
    return (utilidadProyectada / inversionTotal) * 100;
  }

  public obtenerDiasEnInventario(vehiculo: Vehiculo): number {
    const hoy = new Date();
    const diferenciaMs = hoy.getTime() - vehiculo.fechaIngreso.getTime();
    return Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  }
}
