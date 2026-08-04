"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Coins, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  HelpCircle, 
  TrendingUp, 
  Wrench, 
  FileCheck 
} from "lucide-react";
import { updateAutoCostsAction } from "@/core/usecases/autoService";

interface AutoCostsTabProps {
  auto: any;
  role: string;
}

export function AutoCostsTab({ auto, role }: AutoCostsTabProps) {
  const isManagerOrDirector = ["gerente", "director"].includes(role);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    costo_adquisicion: Number(auto.costo_adquisicion || 0),
    precio_costo: Number(auto.precio_costo || 0),
    precio_publicacion: Number(auto.precio_publicacion || 0),
    precio_min_autorizado: Number(auto.precio_min_autorizado || 0),
    precio_objetivo: Number(auto.precio_objetivo || 0),
    publicidad: Number(auto.publicidad || 0),
    gestion_administrativa: Number(auto.gestion_administrativa || 0),
    comision: Number(auto.comision || 0),
    
    // Acondicionamientos
    acondicionamiento_llantas: Number(auto.acondicionamiento_llantas || 0),
    acondicionamiento_pintura: Number(auto.acondicionamiento_pintura || 0),
    acondicionamiento_mecanica: Number(auto.acondicionamiento_mecanica || 0),
    acondicionamiento_refacciones: Number(auto.acondicionamiento_refacciones || 0),
    acondicionamiento_accesorios: Number(auto.acondicionamiento_accesorios || 0),
    acondicionamiento_limpieza: Number(auto.acondicionamiento_limpieza || 0),
    acondicionamiento_tapiceria: Number(auto.acondicionamiento_tapiceria || 0),
    acondicionamiento_odometros: Number(auto.acondicionamiento_odometros || 0),
    acondicionamiento_pulido: Number(auto.acondicionamiento_pulido || 0),
    acondicionamiento_mecanica_servicios: Number(auto.acondicionamiento_mecanica_servicios || 0),
    acondicionamiento_mecanica_reparaciones: Number(auto.acondicionamiento_mecanica_reparaciones || 0),
  });


  // Calculate totals reactively
  const totalAcondicionamiento = 
    formData.acondicionamiento_llantas +
    formData.acondicionamiento_pintura +
    formData.acondicionamiento_mecanica +
    formData.acondicionamiento_refacciones +
    formData.acondicionamiento_accesorios +
    formData.acondicionamiento_limpieza +
    formData.acondicionamiento_tapiceria +
    formData.acondicionamiento_odometros +
    formData.acondicionamiento_pulido +
    formData.acondicionamiento_mecanica_servicios +
    formData.acondicionamiento_mecanica_reparaciones;

  const totalInvertido = 
    formData.costo_adquisicion +
    totalAcondicionamiento +
    formData.publicidad +
    formData.gestion_administrativa +
    formData.comision;

  const diasEnInventario = auto.fecha_registro_inventario 
    ? Math.floor((Date.now() - new Date(auto.fecha_registro_inventario).getTime()) / (1000 * 60 * 60 * 24)) 
    : (auto.fecha_creacion ? Math.floor((Date.now() - new Date(auto.fecha_creacion).getTime()) / (1000 * 60 * 60 * 24)) : 0);


  const handleInputChange = (field: string, value: string) => {
    const numericValue = Math.max(0, parseFloat(value) || 0);
    setFormData(prev => ({ ...prev, [field]: numericValue }));
  };

  const handleSave = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
          data.append(key, val.toString());
        });
        const result = await updateAutoCostsAction(auto.id, data);
        if (result?.error) {
          setErrorMsg(result.error);
        } else {
          setSuccessMsg("¡Costos actualizados con éxito!");
          setTimeout(() => setSuccessMsg(null), 3000);
          router.refresh();
        }
      } catch (err) {
        setErrorMsg("Error al guardar cambios financieros");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <CostsHeader
        isManagerOrDirector={isManagerOrDirector}
        isPending={isPending}
        successMsg={successMsg}
        errorMsg={errorMsg}
        onSave={handleSave}
      />

      {/* Resumen financiero compacto arriba */}
      <FinancialSummaryCard
        totalInvertido={totalInvertido}
        precioObjetivo={formData.precio_objetivo}
        diasEnInventario={diasEnInventario}
      />

      {/* Distribución en Grid para Escritorio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Costos Base y Operativos */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <MainCostsCard
            formData={formData}
            isEditable={isManagerOrDirector}
            onChange={handleInputChange}
          />
        </div>

        {/* Columna Derecha: Acondicionamiento Detallado */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ConditioningCard
            formData={formData}
            isEditable={isManagerOrDirector}
            onChange={handleInputChange}
            totalAcondicionamiento={totalAcondicionamiento}
          />
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Costs Header
interface CostsHeaderProps {
  isManagerOrDirector: boolean;
  isPending: boolean;
  successMsg: string | null;
  errorMsg: string | null;
  onSave: () => void;
}

function CostsHeader({ isManagerOrDirector, isPending, successMsg, errorMsg, onSave }: CostsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          Finanzas y Acondicionamiento
        </h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">
          Estructura de costos, acondicionamiento y precio de costo de la unidad
        </p>
      </div>

      <div className="flex items-center gap-3 self-end md:self-center">
        {errorMsg && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl animate-in fade-in duration-300">
            {errorMsg}
          </span>
        )}
        {successMsg && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl animate-in fade-in duration-300">
            {successMsg}
          </span>
        )}
        
        {isManagerOrDirector ? (
          <button
            onClick={onSave}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-md shadow-slate-900/10 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            Guardar Cambios
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
            <ShieldAlert className="size-4 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest">Solo Vista (Vendedor)</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper: Format Currency
function formatCurrency(val: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(val);
}

// Subcomponent: Input Field
interface CostInputProps {
  label: string;
  name: string;
  value: number;
  isEditable: boolean;
  onChange: (field: string, value: string) => void;
  tooltip?: string;
}

function CostInput({ label, name, value, isEditable, onChange, tooltip }: CostInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
        {tooltip && (
          <HelpCircle 
            title={tooltip} 
            className="size-3 text-slate-300 hover:text-slate-400 cursor-help transition-colors" 
          />
        )}
      </div>
      
      {isEditable ? (
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 pl-8 pr-4 text-xs font-extrabold text-slate-900 focus:outline-none transition-all"
          />
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black text-slate-700 shadow-sm flex items-center justify-between">
          <span>{formatCurrency(value)}</span>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Main Costs Card
interface MainCostsCardProps {
  formData: any;
  isEditable: boolean;
  onChange: (field: string, value: string) => void;
}

function MainCostsCard({ formData, isEditable, onChange }: MainCostsCardProps) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
          <TrendingUp className="size-4 text-emerald-500" />
        </div>
        <h4 className="font-extrabold text-sm text-slate-800">Estructura de Costos</h4>
      </div>

      {/* Grupo 1: Precios de Compra */}
      <div className="flex flex-col gap-2">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Compra y Valor</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <CostInput label="Costo de Adquisición" name="costo_adquisicion" value={formData.costo_adquisicion} isEditable={isEditable} onChange={onChange} tooltip="Precio de compra original" />
          </div>
          <CostInput label="Precio de Costo" name="precio_costo" value={formData.precio_costo} isEditable={isEditable} onChange={onChange} tooltip="Costo asignado comercialmente" />
          <CostInput label="Precio Objetivo" name="precio_objetivo" value={formData.precio_objetivo} isEditable={isEditable} onChange={onChange} tooltip="Precio ideal de venta" />
          <CostInput label="Publicación" name="precio_publicacion" value={formData.precio_publicacion} isEditable={isEditable} onChange={onChange} tooltip="Precio en portales" />
          <CostInput label="Mín. Autorizado" name="precio_min_autorizado" value={formData.precio_min_autorizado} isEditable={isEditable} onChange={onChange} tooltip="Piso de negociación" />
        </div>
      </div>

      {/* Grupo 2: Gastos Operativos */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Gastos Operativos</p>
        <div className="grid grid-cols-2 gap-3">
          <CostInput label="Publicidad" name="publicidad" value={formData.publicidad} isEditable={isEditable} onChange={onChange} tooltip="Gasto promocional" />
          <CostInput label="Gestión Admin." name="gestion_administrativa" value={formData.gestion_administrativa} isEditable={isEditable} onChange={onChange} tooltip="Notaría, placas, trámites" />
          <div className="col-span-2">
            <CostInput label="Comisión" name="comision" value={formData.comision} isEditable={isEditable} onChange={onChange} tooltip="Comisión por venta" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Financial Summary Card
interface FinancialSummaryCardProps {
  totalInvertido: number;
  precioObjetivo: number;
  diasEnInventario: number;
}

function FinancialSummaryCard({ totalInvertido, precioObjetivo, diasEnInventario }: FinancialSummaryCardProps) {
  const profitMargin = precioObjetivo - totalInvertido;
  const isProfitable = profitMargin > 0;

  return (
    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col gap-6 relative overflow-hidden group border border-white/5 shadow-2xl">
      <div className="absolute -top-12 -right-12 opacity-5 group-hover:scale-115 transition-transform duration-700">
        <Coins className="size-48 text-emerald-500" />
      </div>

      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Total Invertido en Unidad
          </span>
          <h4 className="text-3xl font-black text-white tracking-tighter">
            {formatCurrency(totalInvertido)}
          </h4>
        </div>
        <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <FileCheck className="size-5 text-emerald-400" />
        </div>
      </div>

      <div className="h-[1px] bg-white/10 w-full" />

      <div className="grid grid-cols-2 gap-4 z-10">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
            Utilidad Proyectada
          </span>
          <span className={`text-sm font-extrabold ${isProfitable ? "text-emerald-400" : "text-amber-400"}`}>
            {formatCurrency(profitMargin)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
            ROI Estimado
          </span>
          <span className="text-sm font-extrabold text-indigo-300">
            {totalInvertido > 0 ? `${Math.round((profitMargin / totalInvertido) * 100)}%` : "0%"}
          </span>
        </div>
        <div className="flex flex-col col-span-2 mt-2">
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
            Días en Inventario
          </span>
          <span className={`text-sm font-extrabold ${diasEnInventario >= 90 ? "text-red-400 animate-pulse font-black" : "text-slate-300"}`}>
            {diasEnInventario} días {diasEnInventario >= 90 && "⚠️ (Rezago Crítico)"}
          </span>
        </div>
      </div>
    </div>
  );
}


// Subcomponent: Conditioning Card
interface ConditioningCardProps {
  formData: any;
  isEditable: boolean;
  onChange: (field: string, value: string) => void;
  totalAcondicionamiento: number;
}

function ConditioningCard({ formData, isEditable, onChange, totalAcondicionamiento }: ConditioningCardProps) {
  const fields = [
    { name: "acondicionamiento_llantas", label: "Llantas" },
    { name: "acondicionamiento_pintura", label: "Pintura" },
    { name: "acondicionamiento_mecanica", label: "Mec\u00e1nica" },
    { name: "acondicionamiento_refacciones", label: "Refacciones" },
    { name: "acondicionamiento_accesorios", label: "Accesorios" },
    { name: "acondicionamiento_limpieza", label: "Limpieza" },
    { name: "acondicionamiento_tapiceria", label: "Tapice\u00eda" },
    { name: "acondicionamiento_odometros", label: "Odómetros" },
    { name: "acondicionamiento_pulido", label: "Pulido" },
    { name: "acondicionamiento_mecanica_servicios", label: "Servicios" },
    { name: "acondicionamiento_mecanica_reparaciones", label: "Reparaciones" },
  ];

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Wrench className="size-4 text-indigo-500" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-800">Acondicionamiento</h4>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl text-right">
          <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest">Subtotal</span>
          <span className="text-xs font-black text-indigo-600">{formatCurrency(totalAcondicionamiento)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <CostInput
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            isEditable={isEditable}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
