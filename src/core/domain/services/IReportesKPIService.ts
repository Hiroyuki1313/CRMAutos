import { Auto } from '../entities/Auto';
import { Venta } from '../entities/Venta';
import { Apartado } from '../entities/Apartado';
import { VehiculoRentabilidad } from './ICentroUtilidadService';

export interface KPIReportData {
  rentabilidadVehiculos: VehiculoRentabilidad[];
  kpisInventario: {
    diasPromedioParaVender: number;
    rotacionMensual: number;
    valorTotalInventario: number;
    inventarioPorAntiguedad: { rango: string; cantidad: number; valor: number }[];
  };
  kpisVentas: {
    conversionPorVendedor: { vendedor: string; id_vendedor: number; leads: number; ventas: number; tasa: number }[];
    conversionPorFuente: { fuente: string; leads: number; ventas: number; tasa: number }[];
    conversionPorVehiculo: { vehiculo: string; id_auto: number; leads: number; vendido: boolean; tasa: number }[];
  };
  kpisCompras: {
    utilidadPromedioPorUnidad: number;
    tiempoPromedioDeRotacion: number;
  };
  kpisMarketing: {
    leadsPorPlataforma: { plataforma: string; cantidad: number }[];
    ventasPorPlataforma: { plataforma: string; cantidad: number }[];
  };
}

export interface IReportesKPIService {
  generarReporte(autos: Auto[], ventas: Venta[], apartados: Apartado[], rentabilidades: VehiculoRentabilidad[]): KPIReportData;
}
