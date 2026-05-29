'use client';

import { useState, useEffect, useTransition } from "react";
import { X, CheckCircle2, Loader2, DollarSign, Calendar, Wrench, Coins, TrendingUp } from "lucide-react";
import { getAutoByIdAction } from "@/core/usecases/autoService";
import { confirmSaleFromSeguimientoAction } from "@/app/(dashboard)/apartados/actions";
import { Auto } from "@/core/domain/entities/Auto";
import { Apartado } from "@/core/domain/entities/Apartado";
import { autoFinancialCalculator } from "@/core/domain/services/AutoFinancialCalculator";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  apartado: Apartado;
  onSuccess: () => void;
}

export function ConfirmarVentaModal({ isOpen, onClose, apartado, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const [auto, setAuto] = useState<Auto | null>(null);
  const [loadingAuto, setLoadingAuto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [precioVenta, setPrecioVenta] = useState<string>("");
  const [fechaVenta, setFechaVenta] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (isOpen && apartado.id_carro) {
      setLoadingAuto(true);
      setError(null);
      getAutoByIdAction(apartado.id_carro)
        .then((res) => {
          if (res.success && res.auto) {
            setAuto(res.auto);
            // Default suggested price to the client's offer or a default
            setPrecioVenta(apartado.ofrecimiento_cliente?.toString() || "");
          } else {
            setError("No se pudo cargar la información financiera del vehículo.");
          }
        })
        .catch(() => {
          setError("Error de red al consultar el vehículo.");
        })
        .finally(() => {
          setLoadingAuto(false);
        });
    } else if (isOpen && !apartado.id_carro) {
      setError("Este seguimiento no tiene ningún vehículo asignado. Por favor asigna uno primero.");
    }
  }, [isOpen, apartado]);

  if (!isOpen) return null;

  // Compile detailed conditioning costs using domain calculator
  const getConditioningBreakdown = (car: Auto) => {
    return autoFinancialCalculator.getConditioningBreakdown(car);
  };

  const getConditioningTotal = (car: Auto) => {
    return autoFinancialCalculator.calculateAcondicionamiento(car);
  };


  const handleConfirm = () => {
    const price = parseFloat(precioVenta);
    if (isNaN(price) || price <= 0) {
      alert("El precio de venta debe ser un monto numérico válido mayor a cero.");
      return;
    }
    if (!fechaVenta) {
      alert("Por favor selecciona la fecha oficial de la venta.");
      return;
    }

    startTransition(async () => {
      setError(null);
      const res = await confirmSaleFromSeguimientoAction(apartado.id_venta, price, fechaVenta);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Ocurrió un error al registrar la venta.");
      }
    });
  };

  const format = (v: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN"
    }).format(v);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500 max-h-[95vh]">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center border border-indigo-700 shadow-lg shadow-indigo-200">
              <CheckCircle2 className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Confirmación de Venta</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Traspaso al Directorio Financiero</span>
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center transition-all">
            <X className="size-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3">
              <span>{error}</span>
            </div>
          )}

          {loadingAuto ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="size-8 animate-spin text-indigo-500" />
              <span className="text-[9px] font-black uppercase tracking-widest">Analizando expediente del auto...</span>
            </div>
          ) : auto ? (
            <div className="flex flex-col gap-8">
              
              {/* Resumen del Cliente y Vehículo */}
              <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cliente Adquiriente</span>
                  <span className="text-base font-black text-slate-900 uppercase">
                    {apartado.nombre_prospecto || "Desconocido"}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500">{apartado.telefono_prospecto}</span>
                </div>
                <div className="text-right flex flex-col gap-1.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unidad Vendida</span>
                  <span className="text-base font-black text-slate-900">
                    {auto.marca} {auto.modelo}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Año {auto.anio} · #{auto.id}</span>
                </div>
              </div>

              {/* Pequeño Reporte de Gastos y Acondicionamiento */}
              <div className="flex flex-col gap-4 border border-slate-200 rounded-3xl p-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Wrench className="size-4 text-slate-700" />
                  <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Reporte Financiero de la Unidad</h3>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Adquisición / Costo Base</span>
                    <span className="text-slate-900">{format(autoFinancialCalculator.calculateBaseCost(auto))}</span>
                  </div>
                  
                  {getConditioningBreakdown(auto).length > 0 ? (
                    <>
                      <div className="border-t border-dashed border-slate-100 my-1" />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Detalle Acondicionamientos:</span>
                      {getConditioningBreakdown(auto).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] text-slate-500 font-semibold pl-2">
                          <span>{item.label}</span>
                          <span>{format(item.val)}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic py-1 pl-2">Sin gastos de acondicionamiento registrados.</div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center font-black">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">Inversión Total Acumulada</span>
                  <span className="text-sm text-slate-900">
                    {format(autoFinancialCalculator.calculateBaseCost(auto) + getConditioningTotal(auto))}
                  </span>
                </div>
              </div>

              {/* Formulario de Configuración de la Venta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Precio de Venta Final</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-sm">
                    <DollarSign className="size-4 text-slate-400 mr-2" />
                    <input 
                      type="number"
                      value={precioVenta}
                      onChange={(e) => setPrecioVenta(e.target.value)}
                      placeholder="Monto final acordado..."
                      className="bg-transparent border-none outline-none text-sm font-black w-full text-slate-900 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Fecha Oficial de la Venta</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-sm">
                    <Calendar className="size-4 text-slate-400 mr-3" />
                    <input 
                      type="date"
                      value={fechaVenta}
                      onChange={(e) => setFechaVenta(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs font-bold w-full text-slate-900"
                    />
                  </div>
                </div>
              </div>

            </div>
          ) : null}

        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <button 
            onClick={onClose} 
            disabled={isPending}
            className="px-6 py-4 rounded-2xl text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-100 transition-all text-xs uppercase tracking-widest"
          >
            Cancelar
          </button>
          
          <button 
            onClick={handleConfirm}
            disabled={isPending || !auto}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-emerald-600/10 flex justify-center items-center gap-2"
          >
            {isPending ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <>
                <CheckCircle2 className="size-4" /> 
                Confirmar Venta y Traspasar Cliente
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
