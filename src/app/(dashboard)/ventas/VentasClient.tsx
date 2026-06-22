"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Printer, 
  Loader2, 
  FileCheck,
  TrendingUp,
  Target,
  ShieldCheck
} from "lucide-react";
import { getKPIAndUtilityReportAction } from "@/core/usecases/salesService";
import { CentroUtilidadTab } from "@/presentation/components/organisms/CentroUtilidadTab";
import { KpisTab } from "@/presentation/components/organisms/KpisTab";
import { MarketingTab } from "@/presentation/components/organisms/MarketingTab";


interface VentasClientProps {
  vendedores: { id: number; nombre: string }[];
}

export function VentasClient({ vendedores }: VentasClientProps) {
  // Filters State
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  
  const [selectedVendedores, setSelectedVendedores] = useState<number[]>(
    vendedores.map(v => v.id)
  );
  
  const [selectedTiposAuto, setSelectedTiposAuto] = useState<string[]>(
    ["sedan", "suv", "hatchback", "camion", "otro"]
  );
  
  const [selectedOrigenesAuto, setSelectedOrigenesAuto] = useState<string[]>(
    ["toma", "directo"]
  );

  const clientOrigins = [
    "digital", "prospecto del asesor", "base de datos", "prospecciones de cartera", 
    "prospectos de piso", "puntos de venta", "recomendados", "redes sociales propias", 
    "ofrecimiento a cliente", "volanteo y cabezeo (seguimineto)"
  ];
  
  const [selectedOrigenesCliente, setSelectedOrigenesCliente] = useState<string[]>(
    clientOrigins
  );

  // Analytics & Report State
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ventas' | 'utilidades' | 'kpis' | 'marketing'>('ventas');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const parsedFilters = {
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
        id_vendedores: selectedVendedores,
        tipos_auto: selectedTiposAuto,
        origenes_auto: selectedOrigenesAuto,
        origenes_cliente: selectedOrigenesCliente
      };
      const res = await getKPIAndUtilityReportAction(parsedFilters);
      if (res.success && res.report) {
        setReport(res.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Load report on start and filter changes
  useEffect(() => {
    fetchReport();
  }, [fechaInicio, fechaFin, selectedVendedores, selectedTiposAuto, selectedOrigenesAuto, selectedOrigenesCliente]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (v: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(v);
  };

  return (
    <div className="flex flex-col gap-8 w-full min-h-screen pb-24 relative max-w-[1600px] mx-auto">
      {/* Print styles override */}
      <style>{`
        @media print {
          /* Hide sidebar, headers, filters, actions */
          aside, nav, header, button, .no-print, main > div > div:first-child, .filter-panel {
            display: none !important;
          }
          /* occupy full space for content */
          body, main, .print-container {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .print-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* Header and Quick Actions (Hidden in Print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 no-print border-b border-slate-100 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="size-2.5 rounded-full bg-indigo-600 animate-pulse" />
            Reporte Ejecutivo de Ventas
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">
            Módulo de Inteligencia de Negocios y Auditoría de Ventas
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-xs"
          >
            <Printer className="size-4" />
            Imprimir Reporte (PDF)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-slate-400 no-print">
          <Loader2 className="size-10 animate-spin text-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Generando Reporte BI...</span>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full print-container">
          
          {/* LADO IZQUIERDO: Parámetros y Filtros de Consulta Múltiple (no-print) */}
          {activeTab === 'ventas' && (
            <div className="w-full lg:w-[440px] xl:w-[480px] shrink-0 no-print">
              <FilterPanel 
                fechaInicio={fechaInicio}
                setFechaInicio={setFechaInicio}
                fechaFin={fechaFin}
                setFechaFin={setFechaFin}
                vendedores={vendedores}
                selectedVendedores={selectedVendedores}
                setSelectedVendedores={setSelectedVendedores}
                selectedTiposAuto={selectedTiposAuto}
                setSelectedTiposAuto={setSelectedTiposAuto}
                selectedOrigenesAuto={selectedOrigenesAuto}
                setSelectedOrigenesAuto={setSelectedOrigenesAuto}
                clientOrigins={clientOrigins}
                selectedOrigenesCliente={selectedOrigenesCliente}
                setSelectedOrigenesCliente={setSelectedOrigenesCliente}
              />
            </div>
          )}

          {/* LADO DERECHO: Hoja Ejecutiva de Reporte */}
          <div className="flex-1 w-full print-sheet bg-white p-8 lg:p-12 border border-slate-200 shadow-lg rounded-[2.5rem] flex flex-col gap-8 min-h-[700px] justify-between">
            
            {/* Tabs de Navegación (no-print) */}
            <div className="flex border-b border-slate-100 pb-px no-print overflow-x-auto gap-4 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('ventas')}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 -mb-px ${
                  activeTab === 'ventas'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <FileCheck className="size-4" />
                Ventas y Transacciones
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('utilidades')}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 -mb-px ${
                  activeTab === 'utilidades'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className="size-4" />
                Centro de Utilidad
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kpis')}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 -mb-px ${
                  activeTab === 'kpis'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <TrendingUp className="size-4" />
                KPIs de Negocio
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('marketing')}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 -mb-px ${
                  activeTab === 'marketing'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Target className="size-4" />
                Marketing
              </button>
            </div>

            {/* Renderizado de Pestañas */}
            {activeTab === 'ventas' && (
              <div className="flex flex-col gap-6 flex-1 justify-between">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-2.5">
                        <FileCheck className="size-5 text-slate-800 shrink-0" />
                        Desglose Detallado de Transacciones
                      </h1>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                        Rango: {fechaInicio || "Inicio"} al {fechaFin || "Presente"}
                      </span>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-black text-[7px] uppercase tracking-widest">Confidencial</span>
                      <span className="text-[8px] font-bold text-slate-400 mt-1 block">Emitido: {new Date().toLocaleDateString("es-MX")}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] text-slate-800">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-400 uppercase font-black tracking-wider text-[8px]">
                          <th className="py-2.5">Fecha</th>
                          <th className="py-2.5">Vehículo</th>
                          <th className="py-2.5">Cliente</th>
                          <th className="py-2.5">Asesor</th>
                          <th className="py-2.5 text-right">Acondic.</th>
                          <th className="py-2.5 text-right">Monto Venta</th>
                          <th className="py-2.5 text-right">Margen Neto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report?.ventas && report.ventas.length > 0 ? (
                          report.ventas.map((item: any) => {
                            const margin = item.precio_venta - item.costo_acondicionamiento;
                            return (
                              <tr key={item.id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 whitespace-nowrap">{new Date(item.fecha_venta).toLocaleDateString("es-MX")}</td>
                                <td className="py-3 font-bold text-slate-900">
                                  {item.marca} {item.modelo} <span className="text-[8px] font-bold text-slate-400">#{item.id_auto}</span>
                                </td>
                                <td className="py-3 truncate max-w-[120px]">{item.nombre_cliente}</td>
                                <td className="py-3">{item.nombre_vendedor}</td>
                                <td className="py-3 text-right font-semibold text-slate-700">{formatCurrency(item.costo_acondicionamiento)}</td>
                                <td className="py-3 text-right font-black text-slate-950">{formatCurrency(item.precio_venta)}</td>
                                <td className={`py-3 text-right font-black ${margin > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {formatCurrency(margin)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                              No se encontraron ventas para los filtros seleccionados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fila Inferior del Reporte (KPIs de Ventas en la base del documento) */}
                {report && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-slate-200 pt-6 mt-auto">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Total Unidades</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{report.ventas?.length || 0} uds</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Monto Facturado</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {formatCurrency(report.ventas?.reduce((acc: number, curr: any) => acc + curr.precio_venta, 0) || 0)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Inversión Acond.</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {formatCurrency(report.ventas?.reduce((acc: number, curr: any) => acc + curr.costo_acondicionamiento, 0) || 0)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Retorno Neto</span>
                      <span className="text-2xl font-black text-emerald-600 tracking-tight">
                        {formatCurrency(
                          (report.ventas?.reduce((acc: number, curr: any) => acc + curr.precio_venta, 0) || 0) -
                          (report.ventas?.reduce((acc: number, curr: any) => acc + curr.costo_acondicionamiento, 0) || 0)
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Firmas de Auditoría */}
                <div className="hidden print:grid grid-cols-2 gap-16 mt-12 border-t border-dashed border-slate-200 pt-8">
                  <div className="flex flex-col items-center gap-1 border-t border-slate-900 pt-3">
                    <span className="text-[9px] font-bold text-slate-800 uppercase">Firma del Director de Operaciones</span>
                    <span className="text-[8px] text-slate-400 font-bold">AUTOSUZ AUDITORÍA CENTRAL</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-t border-slate-900 pt-3">
                    <span className="text-[9px] font-bold text-slate-800 uppercase">Firma de Gerencia Comercial</span>
                    <span className="text-[8px] text-slate-400 font-bold">REGISTRO DE INVENTARIO Y CONTROL</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'utilidades' && report && (
              <CentroUtilidadTab
                rentabilidades={report.rentabilidadVehiculos || []}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === 'kpis' && report && (
              <KpisTab
                kpisInventario={report.kpisInventario}
                kpisVentas={report.kpisVentas}
                kpisCompras={report.kpisCompras}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === 'marketing' && report && (
              <MarketingTab
                conversionPorFuente={report.kpisVentas.conversionPorFuente || []}
                formatCurrency={formatCurrency}
              />
            )}

          </div>

        </div>
      )}
    </div>
  );
}

// Subcomponent: Compact Filter Panel
interface FilterPanelProps {
  fechaInicio: string;
  setFechaInicio: (v: string) => void;
  fechaFin: string;
  setFechaFin: (v: string) => void;
  vendedores: { id: number; nombre: string }[];
  selectedVendedores: number[];
  setSelectedVendedores: React.Dispatch<React.SetStateAction<number[]>>;
  selectedTiposAuto: string[];
  setSelectedTiposAuto: React.Dispatch<React.SetStateAction<string[]>>;
  selectedOrigenesAuto: string[];
  setSelectedOrigenesAuto: React.Dispatch<React.SetStateAction<string[]>>;
  clientOrigins: string[];
  selectedOrigenesCliente: string[];
  setSelectedOrigenesCliente: React.Dispatch<React.SetStateAction<string[]>>;
}

function FilterPanel(props: FilterPanelProps) {
  const toggleItem = <T,>(list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
    setList(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
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

  const carTypes = [
    { value: "sedan", label: "Sedán" },
    { value: "suv", label: "SUV / Crossover" },
    { value: "hatchback", label: "Hatchback" },
    { value: "camion", label: "Camión / Pickup" },
    { value: "otro", label: "Otro" }
  ];

  const carOrigins = [
    { value: "toma", label: "Toma de Avalúo" },
    { value: "directo", label: "Compra Directa" }
  ];

  return (
    <div className="filter-panel bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6 w-full">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <BarChart3 className="size-5 text-indigo-500" />
        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">Filtros de Consulta Múltiple (BI)</h3>
      </div>
      
      {/* Date Filters Row */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Fecha de Venta (Desde)</label>
          <input 
            type="date"
            value={props.fechaInicio}
            onChange={(e) => props.setFechaInicio(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-indigo-500" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Fecha de Venta (Hasta)</label>
          <input 
            type="date"
            value={props.fechaFin}
            onChange={(e) => props.setFechaFin(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-indigo-500" 
          />
        </div>
      </div>

      {/* Grid de Checklist de 2 columnas internas */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Section 1: Vendedores */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-1.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Asesor Vendedor</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button" 
                onClick={() => props.setSelectedVendedores(props.vendedores.map(v => v.id))}
                className="text-[7px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
              >
                Todos
              </button>
              <span className="text-[7px] text-slate-300">|</span>
              <button 
                type="button" 
                onClick={() => props.setSelectedVendedores([])}
                className="text-[7px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider"
              >
                Ninguno
              </button>
            </div>
          </div>
          
          <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-[1.2rem] w-full max-h-[180px] overflow-y-auto pr-1">
            {props.vendedores.map(v => (
              <label key={v.id} className="flex items-center gap-2 cursor-pointer group text-[11px] text-slate-700 font-bold hover:text-slate-900 transition-colors">
                <input 
                  type="checkbox"
                  checked={props.selectedVendedores.includes(v.id)}
                  onChange={() => toggleItem(props.selectedVendedores, props.setSelectedVendedores, v.id)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer shrink-0"
                />
                <span className="truncate">{v.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Carrocería */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-1.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Carrocería</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button" 
                onClick={() => props.setSelectedTiposAuto(carTypes.map(c => c.value))}
                className="text-[7px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
              >
                Todos
              </button>
              <span className="text-[7px] text-slate-300">|</span>
              <button 
                type="button" 
                onClick={() => props.setSelectedTiposAuto([])}
                className="text-[7px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider"
              >
                Ninguno
              </button>
            </div>
          </div>
          
          <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-[1.2rem] w-full max-h-[180px] overflow-y-auto pr-1">
            {carTypes.map(c => (
              <label key={c.value} className="flex items-center gap-2 cursor-pointer group text-[11px] text-slate-700 font-bold hover:text-slate-900 transition-colors">
                <input 
                  type="checkbox"
                  checked={props.selectedTiposAuto.includes(c.value)}
                  onChange={() => toggleItem(props.selectedTiposAuto, props.setSelectedTiposAuto, c.value)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer shrink-0"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: Procedencia */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-1.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Procedencia Unidad</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button" 
                onClick={() => props.setSelectedOrigenesAuto(carOrigins.map(o => o.value))}
                className="text-[7px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
              >
                Todos
              </button>
              <span className="text-[7px] text-slate-300">|</span>
              <button 
                type="button" 
                onClick={() => props.setSelectedOrigenesAuto([])}
                className="text-[7px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider"
              >
                Ninguno
              </button>
            </div>
          </div>
          
          <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-[1.2rem] w-full max-h-[180px] overflow-y-auto pr-1">
            {carOrigins.map(o => (
              <label key={o.value} className="flex items-center gap-2 cursor-pointer group text-[11px] text-slate-700 font-bold hover:text-slate-900 transition-colors">
                <input 
                  type="checkbox"
                  checked={props.selectedOrigenesAuto.includes(o.value)}
                  onChange={() => toggleItem(props.selectedOrigenesAuto, props.setSelectedOrigenesAuto, o.value)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer shrink-0"
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Origen Cliente */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-1.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Origen Cliente</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button" 
                onClick={() => props.setSelectedOrigenesCliente(props.clientOrigins)}
                className="text-[7px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
              >
                Todos
              </button>
              <span className="text-[7px] text-slate-300">|</span>
              <button 
                type="button" 
                onClick={() => props.setSelectedOrigenesCliente([])}
                className="text-[7px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider"
              >
                Ninguno
              </button>
            </div>
          </div>
          
          <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-[1.2rem] w-full max-h-[220px] overflow-y-auto pr-1">
            {props.clientOrigins.map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer group text-[11px] text-slate-700 font-bold hover:text-slate-900 transition-colors">
                <input 
                  type="checkbox"
                  checked={props.selectedOrigenesCliente.includes(o)}
                  onChange={() => toggleItem(props.selectedOrigenesCliente, props.setSelectedOrigenesCliente, o)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer shrink-0"
                />
                <span className="truncate">{clientOriginLabels[o] || o}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
