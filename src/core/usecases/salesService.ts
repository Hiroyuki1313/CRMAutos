'use server';

import { getSession } from "@/core/usecases/authService";
import { MySQLVentaRepository } from "@/infrastructure/repositories/MySQLVentaRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { VentaFilterParams } from "@/core/domain/repositories/IVentaRepository";
import { CentroUtilidadService } from "@/core/domain/services/CentroUtilidadService";
import { ReportesKPIService } from "@/core/domain/services/ReportesKPIService";
import { revalidatePath } from "next/cache";

export async function getSalesReportAction(filters: VentaFilterParams) {
  const session = await getSession();
  if (!session || session.role !== 'director') {
    return { error: 'No autorizado. Solo dirección puede consultar este reporte.' };
  }

  try {
    const ventaRepo = new MySQLVentaRepository();
    const report = await ventaRepo.getReport(filters);
    return { success: true, report };
  } catch (error: any) {
    console.error('Error fetching sales report:', error);
    return { error: 'Error al obtener el reporte de ventas.' };
  }
}

export async function createSaleAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'director') {
    return { error: 'No autorizado. Solo personal de dirección puede registrar ventas.' };
  }

  const id_auto = parseInt(formData.get('id_auto') as string, 10);
  const id_cliente = parseInt(formData.get('id_cliente') as string, 10);
  const id_vendedor = parseInt(formData.get('id_vendedor') as string, 10);
  const fecha_venta_str = formData.get('fecha_venta') as string;
  const precio_venta = parseFloat(formData.get('precio_venta') as string) || 0.00;

  if (isNaN(id_auto) || isNaN(id_cliente) || isNaN(id_vendedor) || !fecha_venta_str) {
    return { error: 'Todos los campos son obligatorios. Revisa el vehículo, cliente, vendedor y fecha.' };
  }

  try {
    const autoRepo = new MySQLAutoRepository();
    const auto = await autoRepo.findById(id_auto);
    if (!auto) {
      return { error: 'El vehículo seleccionado no existe en el inventario.' };
    }

    // Compile subtotal conditioning cost dynamically on the server
    const costo_acondicionamiento = 
      Number(auto.acondicionamiento_llantas || 0) +
      Number(auto.acondicionamiento_pintura || 0) +
      Number(auto.acondicionamiento_mecanica || 0) +
      Number(auto.acondicionamiento_refacciones || 0) +
      Number(auto.acondicionamiento_accesorios || 0) +
      Number(auto.acondicionamiento_limpieza || 0) +
      Number(auto.acondicionamiento_tapiceria || 0) +
      Number(auto.acondicionamiento_odometros || 0) +
      Number(auto.acondicionamiento_pulido || 0) +
      Number(auto.acondicionamiento_mecanica_servicios || 0) +
      Number(auto.acondicionamiento_mecanica_reparaciones || 0);

    const ventaRepo = new MySQLVentaRepository();
    await ventaRepo.create({
      id_auto,
      id_cliente,
      id_vendedor,
      fecha_venta: new Date(fecha_venta_str),
      costo_acondicionamiento,
      precio_venta
    });

    revalidatePath('/ventas');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error recording sale:', error);
    return { error: 'Error interno al registrar la venta. Por favor intenta más tarde.' };
  }
}

export async function getSalesInitialDataAction() {
  const session = await getSession();
  if (!session || session.role !== 'director') {
    return { error: 'No autorizado. Solo personal directivo puede acceder a estos datos.' };
  }

  try {
    const userRepo = new MySQLUserRepository();
    const vendedores = await userRepo.findAllEligibleForSales();

    return { 
      success: true, 
      vendedores: vendedores.map(u => ({ id: u.id, nombre: u.nombre }))
    };
  } catch (error) {
    console.error('Error fetching initial sales data:', error);
    return { error: 'Error al pre-cargar catálogos.' };
  }
}

function buildRentabilidades(autos: any[], ventas: any[]): any[] {
  const salesMap = new Map<number, { precio_venta: number; fecha_venta: Date }>();
  ventas.forEach(v => salesMap.set(v.id_auto, { precio_venta: v.precio_venta, fecha_venta: v.fecha_venta }));
  const calc = new CentroUtilidadService();
  return autos.map(a => calc.calcularRentabilidad(a, salesMap.get(a.id)?.precio_venta, salesMap.get(a.id)?.fecha_venta));
}

export async function getKPIAndUtilityReportAction(filters: VentaFilterParams) {
  const session = await getSession();
  if (!session || session.role !== 'director') return { error: 'No autorizado.' };
  try {
    const autos = await new MySQLAutoRepository().getAll();
    const salesReport = await new MySQLVentaRepository().getReport(filters);
    const allApartados = await new MySQLApartadoRepository().getAll({ probabilidad: 'todos' });

    const rentabilidades = buildRentabilidades(autos, salesReport.ventas);
    const kpiReport = new ReportesKPIService().generarReporte(autos, salesReport.ventas, allApartados, rentabilidades);

    return { success: true, report: { ...kpiReport, ventas: salesReport.ventas } };
  } catch (error: any) {
    console.error('Error in getKPIAndUtilityReportAction:', error);
    return { error: 'Error interno al generar el reporte de KPIs.' };
  }
}

