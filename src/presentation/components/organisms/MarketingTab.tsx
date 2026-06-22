import React, { useState } from 'react';
import { Target, Calculator, DollarSign, ArrowRight } from 'lucide-react';

interface PlatformMetric {
  fuente: string;
  leads: number;
  ventas: number;
  tasa: number;
}

interface MarketingTabProps {
  conversionPorFuente: PlatformMetric[];
  formatCurrency: (v: number) => string;
}

export function MarketingTab({ conversionPorFuente, formatCurrency }: MarketingTabProps) {
  // Local state for platform budgets (initialized with default values)
  const [budgets, setBudgets] = useState<Record<string, number>>({
    digital: 15000,
    'redes sociales propias': 3000,
    'prospectos de piso': 1000,
    'prospecto del asesor': 500
  });

  const handleBudgetChange = (source: string, val: string) => {
    const numeric = parseFloat(val) || 0;
    setBudgets(prev => ({
      ...prev,
      [source]: numeric
    }));
  };

  const clientOriginLabels: Record<string, string> = {
    "digital": "Digital (Ads/Redes)",
    "prospecto del asesor": "Asesor",
    "base de datos": "Base de Datos",
    "prospecciones de cartera": "Cartera",
    "prospectos de piso": "Piso",
    "puntos de venta": "Punto de Venta",
    "recomendados": "Recomendados",
    "redes sociales propias": "Redes Propias",
    "ofrecimiento a cliente": "Ofrecimiento",
    "volanteo y cabezeo (seguimineto)": "Volanteo/Seguimiento"
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Target className="size-5 text-indigo-500" />
          Rendimiento y ROI de Canales de Marketing
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Mide el costo de adquisición de clientes y la eficiencia de conversión por origen de prospecto
        </p>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="size-4 text-indigo-500" />
            Simulador de Presupuestos y Costo por Lead (CPL)
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Ingresa el presupuesto mensual de cada canal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] text-slate-700">
            <thead>
              <tr className="text-slate-400 uppercase font-black tracking-wider text-[8px] border-b border-slate-100">
                <th className="py-2.5">Origen / Plataforma</th>
                <th className="py-2.5 text-center">Leads (CRM)</th>
                <th className="py-2.5 text-center">Ventas</th>
                <th className="py-2.5 text-center">Conversión</th>
                <th className="py-2.5 text-right w-[150px]">Presupuesto</th>
                <th className="py-2.5 text-right">Costo/Lead (CPL)</th>
                <th className="py-2.5 text-right">Costo/Adquisición (CPA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {conversionPorFuente.map(item => {
                const budget = budgets[item.fuente] || 0;
                const cpl = item.leads > 0 ? budget / item.leads : 0;
                const cpa = item.ventas > 0 ? budget / item.ventas : 0;

                return (
                  <tr key={item.fuente} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-slate-800">
                      {clientOriginLabels[item.fuente] || item.fuente}
                    </td>
                    <td className="py-3 text-center font-semibold text-slate-600">{item.leads}</td>
                    <td className="py-3 text-center font-black text-slate-900">{item.ventas}</td>
                    <td className="py-3 text-center font-black text-indigo-600">{item.tasa}%</td>
                    <td className="py-3 text-right">
                      <div className="relative inline-block w-full max-w-[120px]">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={budget || ''}
                          onChange={(e) => handleBudgetChange(item.fuente, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 pl-6 pr-2 text-right text-[11px] font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                    </td>
                    <td className="py-3 text-right font-black text-slate-800">
                      {cpl > 0 ? formatCurrency(cpl) : '$0.00'}
                    </td>
                    <td className="py-3 text-right font-black text-indigo-600">
                      {cpa > 0 ? formatCurrency(cpa) : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
