import React from 'react';
import { TrendingUp, BarChart3, Package, Users, Car, Calendar } from 'lucide-react';

interface KpisTabProps {
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
  formatCurrency: (v: number) => string;
}

export function KpisTab({ kpisInventario, kpisVentas, kpisCompras, formatCurrency }: KpisTabProps) {
  const totalStockCount = kpisInventario.inventarioPorAntiguedad.reduce((sum, r) => sum + r.cantidad, 0) || 1;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Cards de KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIOverviewCard
          title="Valor Total Inventario"
          value={formatCurrency(kpisInventario.valorTotalInventario)}
          subtitle="En stock disponible"
          icon={<Package className="size-5 text-indigo-600" />}
        />
        <KPIOverviewCard
          title="Días Promedio Venta"
          value={`${kpisInventario.diasPromedioParaVender} días`}
          subtitle="Tiempo medio en stock"
          icon={<Calendar className="size-5 text-indigo-600" />}
        />
        <KPIOverviewCard
          title="Rotación Mensual"
          value={`${kpisInventario.rotacionMensual}%`}
          subtitle="Velocidad de venta mensual"
          icon={<TrendingUp className="size-5 text-indigo-600" />}
        />
        <KPIOverviewCard
          title="Utilidad Promedio"
          value={formatCurrency(kpisCompras.utilidadPromedioPorUnidad)}
          subtitle="Margen neto medio por unidad"
          icon={<BarChart3 className="size-5 text-emerald-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Antigüedad de Inventario */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Package className="size-4 text-indigo-500" />
            Reporte de Inventario por Antigüedad
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] text-slate-700">
              <thead>
                <tr className="text-slate-400 uppercase font-black tracking-wider text-[8px] border-b border-slate-100">
                  <th className="py-2">Rango de Antigüedad</th>
                  <th className="py-2 text-center">Unidades</th>
                  <th className="py-2 text-right">Valor Stock</th>
                  <th className="py-2 text-right">% Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {kpisInventario.inventarioPorAntiguedad.map(r => (
                  <tr key={r.rango} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-slate-800">{r.rango}</td>
                    <td className="py-3 text-center font-black text-slate-900">{r.cantidad} uds</td>
                    <td className="py-3 text-right font-semibold text-slate-600">{formatCurrency(r.valor)}</td>
                    <td className="py-3 text-right font-black text-indigo-600">
                      {parseFloat(((r.cantidad / totalStockCount) * 100).toFixed(1))}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversión por Vendedor */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Users className="size-4 text-indigo-500" />
            Conversión de Ventas por Vendedor
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] text-slate-700">
              <thead>
                <tr className="text-slate-400 uppercase font-black tracking-wider text-[8px] border-b border-slate-100">
                  <th className="py-2">Asesor Vendedor</th>
                  <th className="py-2 text-center">Leads (CRM)</th>
                  <th className="py-2 text-center">Ventas Cerradas</th>
                  <th className="py-2 text-right">Tasa Cierre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {kpisVentas.conversionPorVendedor.length > 0 ? (
                  kpisVentas.conversionPorVendedor.map(v => (
                    <tr key={v.id_vendedor} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-bold text-slate-800">{v.vendedor}</td>
                      <td className="py-3 text-center text-slate-500 font-semibold">{v.leads}</td>
                      <td className="py-3 text-center text-slate-900 font-black">{v.ventas}</td>
                      <td className="py-3 text-right font-black text-indigo-600">{v.tasa}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[8px]">
                      Sin datos comerciales de asesores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Conversión por Vehículo (Tabla de leads de interés) */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 w-full">
        <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
          <Car className="size-4 text-indigo-500" />
          Conversión por Vehículo (Modelos de Mayor Interés / Leads)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] text-slate-700">
            <thead>
              <tr className="text-slate-400 uppercase font-black tracking-wider text-[8px] border-b border-slate-100">
                <th className="py-2">Vehículo</th>
                <th className="py-2 text-center">Prospectos Asignados</th>
                <th className="py-2 text-center">Estado Venta</th>
                <th className="py-2 text-right">Tasa Conversión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {kpisVentas.conversionPorVehiculo.length > 0 ? (
                kpisVentas.conversionPorVehiculo.map(c => (
                  <tr key={c.id_auto} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-slate-800">{c.vehiculo}</td>
                    <td className="py-3 text-center text-slate-500 font-semibold">{c.leads}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        c.vendido ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {c.vendido ? 'Vendido' : 'Disponible'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-black text-indigo-600">{c.tasa}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[8px]">
                    Sin registros de prospectos vinculados a vehículos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface KPIOverviewCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

function KPIOverviewCard({ title, value, subtitle, icon }: KPIOverviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{title}</span>
        <span className="text-xl font-black text-slate-900 tracking-tight">{value}</span>
        <span className="text-[9px] font-bold text-slate-400">{subtitle}</span>
      </div>
      <div className="size-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  );
}
