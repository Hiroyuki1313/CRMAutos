import { Vehiculo } from '../entities/Vehiculo';
import { GastoCosteo } from '../entities/GastoCosteo';

export interface ICentroUtilidad {
  // SRP: Exclusivo para la lógica matemática y de rentabilidad.
  calcularInversionTotal(vehiculo: Vehiculo, gastos: GastoCosteo[]): number;
  calcularUtilidadProyectada(vehiculo: Vehiculo, gastos: GastoCosteo[]): number;
  calcularROI(vehiculo: Vehiculo, gastos: GastoCosteo[]): number;
  obtenerDiasEnInventario(vehiculo: Vehiculo): number;
}
