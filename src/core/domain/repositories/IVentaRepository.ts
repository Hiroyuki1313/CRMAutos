import { Venta } from '../entities/Venta';

export interface VentaFilterParams {
  fecha_inicio?: string;
  fecha_fin?: string;
  id_vendedores?: number[];
  tipos_auto?: string[];
  origenes_auto?: string[];
  origenes_cliente?: string[];
}

export interface SalesReportSummary {
  total_ventas: number;
  total_ingresos: number;
  total_acondicionamiento: number;
  margen_neto: number;
  ventas_por_vendedor: { vendedor: string, cantidad: number, total: number }[];
  ventas_por_origen: { origen: string, cantidad: number }[];
  ventas_por_tipo: { tipo: string, cantidad: number }[];
  ventas: Venta[];
}

export interface IVentaRepository {
  create(venta: Omit<Venta, 'id' | 'fecha_creacion'>): Promise<number>;
  getReport(filter?: VentaFilterParams): Promise<SalesReportSummary>;
  findByClientId(clientId: number): Promise<Venta[]>;
}
