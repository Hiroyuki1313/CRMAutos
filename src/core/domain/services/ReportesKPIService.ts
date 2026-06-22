import { Auto } from '../entities/Auto';
import { Venta } from '../entities/Venta';
import { Apartado } from '../entities/Apartado';
import { IReportesKPIService, KPIReportData } from './IReportesKPIService';
import { VehiculoRentabilidad } from './ICentroUtilidadService';

export class ReportesKPIService implements IReportesKPIService {
  
  public generarReporte(
    autos: Auto[], 
    ventas: Venta[], 
    apartados: Apartado[], 
    rentabilidades: VehiculoRentabilidad[]
  ): KPIReportData {
    return {
      rentabilidadVehiculos: rentabilidades,
      kpisInventario: this.calcularKpisInventario(rentabilidades, ventas),
      kpisVentas: this.calcularKpisVentas(apartados, rentabilidades),
      kpisCompras: this.calcularKpisCompras(rentabilidades),
      kpisMarketing: this.calcularKpisMarketing(apartados)
    };
  }

  private calcularKpisInventario(rentabilidades: VehiculoRentabilidad[], ventas: Venta[]) {
    const sold = rentabilidades.filter(r => r.estado_logico === 'venta');
    const inStock = rentabilidades.filter(r => r.estado_logico !== 'venta' && r.estado_logico !== 'frio');
    
    const avgDays = sold.length > 0 ? sold.reduce((acc, r) => acc + r.dias_inventario, 0) / sold.length : 0;
    
    // Rotación mensual: (Ventas 30 días / Stock disponible) * 100
    const limit30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSales = ventas.filter(v => new Date(v.fecha_venta) >= limit30).length;
    const stockCount = inStock.length || 1;
    
    return {
      diasPromedioParaVender: Math.round(avgDays),
      rotacionMensual: parseFloat(((recentSales / stockCount) * 100).toFixed(2)),
      valorTotalInventario: inStock.reduce((acc, r) => acc + r.inversion_total, 0),
      inventarioPorAntiguedad: this.agruparStockPorAntiguedad(inStock)
    };
  }

  private agruparStockPorAntiguedad(inStock: VehiculoRentabilidad[]) {
    const ranges = [
      { label: '0-30 días', min: 0, max: 30 },
      { label: '31-60 días', min: 31, max: 60 },
      { label: '61-90 días', min: 61, max: 90 },
      { label: '91-120 días', min: 91, max: 120 },
      { label: '120+ días', min: 121, max: Infinity }
    ];
    
    return ranges.map(r => {
      const items = inStock.filter(item => item.dias_inventario >= r.min && item.dias_inventario <= r.max);
      return {
        rango: r.label,
        cantidad: items.length,
        valor: items.reduce((sum, item) => sum + item.inversion_total, 0)
      };
    });
  }

  private calcularKpisVentas(apartados: Apartado[], rentabilidades: VehiculoRentabilidad[]) {
    return {
      conversionPorVendedor: this.calcularConversionVendedor(apartados),
      conversionPorFuente: this.calcularConversionFuente(apartados),
      conversionPorVehiculo: this.calcularConversionVehiculo(apartados, rentabilidades)
    };
  }

  private calcularConversionVendedor(apartados: Apartado[]) {
    const map = new Map<number, { name: string; leads: number; wins: number }>();
    
    apartados.forEach(a => {
      if (!a.id_vendedor) return;
      const data = map.get(a.id_vendedor) || { name: a.nombre_vendedor || `Asesor ${a.id_vendedor}`, leads: 0, wins: 0 };
      data.leads++;
      if (a.probabilidad === 'Venta') data.wins++;
      map.set(a.id_vendedor, data);
    });

    return Array.from(map.entries()).map(([id, d]) => ({
      vendedor: d.name,
      id_vendedor: id,
      leads: d.leads,
      ventas: d.wins,
      tasa: d.leads > 0 ? parseFloat(((d.wins / d.leads) * 100).toFixed(2)) : 0
    })).sort((a, b) => b.tasa - a.tasa);
  }

  private calcularConversionFuente(apartados: Apartado[]) {
    const map = new Map<string, { leads: number; wins: number }>();
    
    apartados.forEach(a => {
      const src = a.origen_prospecto || 'digital';
      const data = map.get(src) || { leads: 0, wins: 0 };
      data.leads++;
      if (a.probabilidad === 'Venta') data.wins++;
      map.set(src, data);
    });

    return Array.from(map.entries()).map(([source, d]) => ({
      fuente: source,
      leads: d.leads,
      ventas: d.wins,
      tasa: d.leads > 0 ? parseFloat(((d.wins / d.leads) * 100).toFixed(2)) : 0
    })).sort((a, b) => b.tasa - a.tasa);
  }

  private calcularConversionVehiculo(apartados: Apartado[], rentabilidades: VehiculoRentabilidad[]) {
    const map = new Map<number, { vehicle: string; leads: number; sold: boolean }>();
    
    apartados.forEach(a => {
      if (!a.id_carro) return;
      const rent = rentabilidades.find(r => r.id_auto === a.id_carro);
      const name = rent ? `${rent.marca} ${rent.modelo} (${rent.anio})` : `Auto #${a.id_carro}`;
      const isSold = rent ? rent.estado_logico === 'venta' : a.probabilidad === 'Venta';
      
      const data = map.get(a.id_carro) || { vehicle: name, leads: 0, sold: isSold };
      data.leads++;
      if (isSold) data.sold = true;
      map.set(a.id_carro, data);
    });

    return Array.from(map.entries()).map(([id, d]) => ({
      vehiculo: d.vehicle,
      id_auto: id,
      leads: d.leads,
      vendido: d.sold,
      tasa: d.leads > 0 ? parseFloat(((d.sold ? 1 : 0) / d.leads * 100).toFixed(2)) : 0
    })).sort((a, b) => b.leads - a.leads).slice(0, 15); // Top 15 con más leads
  }

  private calcularKpisCompras(rentabilidades: VehiculoRentabilidad[]) {
    const sold = rentabilidades.filter(r => r.estado_logico === 'venta');
    const totalUtil = sold.reduce((sum, r) => sum + (r.utilidad_real || 0), 0);
    const avgDays = sold.length > 0 ? sold.reduce((acc, r) => acc + r.dias_inventario, 0) / sold.length : 0;
    
    return {
      utilidadPromedioPorUnidad: sold.length > 0 ? totalUtil / sold.length : 0,
      tiempoPromedioDeRotacion: Math.round(avgDays)
    };
  }

  private calcularKpisMarketing(apartados: Apartado[]) {
    const leadsMap = new Map<string, number>();
    const salesMap = new Map<string, number>();
    
    apartados.forEach(a => {
      const src = a.origen_prospecto || 'digital';
      leadsMap.set(src, (leadsMap.get(src) || 0) + 1);
      if (a.probabilidad === 'Venta') {
        salesMap.set(src, (salesMap.get(src) || 0) + 1);
      }
    });

    const leadsPorPlataforma = Array.from(leadsMap.entries()).map(([plataforma, cantidad]) => ({
      plataforma,
      cantidad
    }));

    const ventasPorPlataforma = Array.from(leadsMap.keys()).map(plat => ({
      plataforma: plat,
      cantidad: salesMap.get(plat) || 0
    }));

    return {
      leadsPorPlataforma,
      ventasPorPlataforma
    };
  }
}
