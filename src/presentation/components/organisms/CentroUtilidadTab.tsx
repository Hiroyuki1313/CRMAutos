import React, { useState } from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import { VehiculoRentabilidad } from '@/core/domain/services/ICentroUtilidadService';

interface CentroUtilidadTabProps {
  rentabilidades: VehiculoRentabilidad[];
  formatCurrency: (v: number) => string;
}

export function CentroUtilidadTab({ rentabilidades, formatCurrency }: CentroUtilidadTabProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'inventario' | 'venta'>('todos');

  const filtered = rentabilidades.filter(r => {
    const matchesSearch = 
      r.marca.toLowerCase().includes(search.toLowerCase()) ||
      r.modelo.toLowerCase().includes(search.toLowerCase()) ||
      r.folio_interno.toLowerCase().includes(search.toLowerCase()) ||
      (r.vin && r.vin.toLowerCase().includes(search.toLowerCase()));
      
    if (filterType === 'todos') return matchesSearch;
    return matchesSearch && r.estado_logico === filterType;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tab controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
        <div className="flex gap-2">
          {['todos', 'inventario', 'venta'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${
                filterType === type 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type === 'todos' ? 'Todos' : type === 'inventario' ? 'En Stock' : 'Vendidos'}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar por marca, modelo, folio o VIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-bold w-full sm:max-w-xs outline-none focus:border-indigo-500"
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] text-slate-800">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider text-[8px]">
                <th className="p-4">Folio / VIN</th>
                <th className="p-4">Vehículo</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Antigüedad</th>
                <th className="p-4 text-right">Inversión</th>
                <th className="p-4 text-right">Precio Actual</th>
                <th className="p-4 text-right">Utilidad</th>
                <th className="p-4 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id_auto} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 block">{item.folio_interno}</span>
                      <span className="text-[9px] font-medium text-slate-400 font-mono">{item.vin || 'Sin VIN'}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block text-xs">{item.marca} {item.modelo}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{item.anio} • {item.color} • {item.placas || 'Sin placas'}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                        item.estado_logico === 'venta' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      }`}>
                        {item.estado_logico === 'venta' ? 'Vendido' : 'En Stock'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-black text-slate-900 text-xs">{item.dias_inventario} días</span>
                        {item.alerta_antiguedad === 'rojo' && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-600 font-black text-[7px] uppercase tracking-wider animate-pulse">
                            ¡Crítico! 120+ días
                          </span>
                        )}
                        {item.alerta_antiguedad === 'amarillo' && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600 font-black text-[7px] uppercase tracking-wider">
                            Alerta 90+ días
                          </span>
                        )}
                        {item.alerta_antiguedad === 'normal' && item.estado_logico !== 'venta' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[7px] uppercase tracking-wider">
                            Saludable
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right font-semibold text-slate-700">{formatCurrency(item.inversion_total)}</td>
                    <td className="p-4 text-right font-black text-slate-900">{formatCurrency(item.precio_actual)}</td>
                    <td className="p-4 text-right">
                      {item.estado_logico === 'venta' ? (
                        <div className="flex flex-col items-end">
                          <span className="font-black text-emerald-600">{formatCurrency(item.utilidad_real || 0)}</span>
                          <span className="text-[7px] font-black uppercase text-emerald-500 tracking-wider">Real</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className={`font-black ${item.utilidad_proyectada >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {formatCurrency(item.utilidad_proyectada)}
                          </span>
                          <span className="text-[7px] font-black uppercase text-indigo-400 tracking-wider">Proyectada</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {item.estado_logico === 'venta' ? (
                        <div className="flex flex-col items-end">
                          <span className="font-black text-emerald-600">{parseFloat((item.roi_real || 0).toFixed(2))}%</span>
                          <span className="text-[7px] font-black uppercase text-emerald-500 tracking-wider">Real ROI</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className={`font-black ${item.roi_proyectado >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {parseFloat((item.roi_proyectado).toFixed(2))}%
                          </span>
                          <span className="text-[7px] font-black uppercase text-indigo-400 tracking-wider">Proyectado ROI</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                    No se encontraron registros de vehículos.
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
