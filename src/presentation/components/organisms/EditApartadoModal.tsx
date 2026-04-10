'use client';

import { useState } from "react";
import { 
    X, 
    Search, 
    Car as CarIcon, 
    AlertTriangle, 
    CheckCircle2, 
    Loader2, 
    HandCoins, 
    Calendar, 
    FileText, 
    Handshake, 
    MessageSquare,
    Building2,
    Target
} from "lucide-react";
import { VehicleSelectorModal } from "../molecules/VehicleSelectorModal";
import { Auto } from "@/core/domain/entities/Auto";
import { Apartado } from "@/core/domain/entities/Apartado";
import { updateApartadoAction, getAvailableAutosAction } from "@/app/apartado/[id]/actions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apartado: Apartado;
  initialAuto: Auto | null;
}

export function EditApartadoModal({ isOpen, onClose, apartado, initialAuto }: Props) {
  const [selectedAuto, setSelectedAuto] = useState<Auto | null>(initialAuto);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form State
  const [monto, setMonto] = useState(apartado.monto_apartado?.toString() || "");
  const [metodoPago, setMetodoPago] = useState(apartado.metodo_pago || 'contado');
  const [banco, setBanco] = useState(apartado.banco_financiera || "");
  const [ofrecimiento, setOfrecimiento] = useState(apartado.ofrecimiento_cliente?.toString() || "");
  const [tomaACuenta, setTomaACuenta] = useState(!!apartado.toma_a_cuenta);
  const [acudioCita, setAcudioCita] = useState(!!apartado.acudio_cita);
  const [hizoDemo, setHizoDemo] = useState(!!apartado.hizo_demo);
  const [cotizacionUrl, setCotizacionUrl] = useState(apartado.cotizacion_url || "");
  const [comentarios, setComentarios] = useState(apartado.comentarios_vendedor || "");
  
  // Dates handling
  const formatForInput = (date?: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const [citaProgramada, setCitaProgramada] = useState(formatForInput(apartado.cita_programada));
  const [proxSeguimiento, setProxSeguimiento] = useState(formatForInput(apartado.fecha_proximo_seguimiento));

  if (!isOpen) return null;

  async function handleSave() {
    setLoading(true);
    setError(null);
    
    if (!selectedAuto) {
        setShowDeleteConfirm(true);
        setLoading(false);
        return;
    }

    const res = await updateApartadoAction(apartado.id_venta, {
      id_carro: selectedAuto.id,
      monto_apartado: parseFloat(monto) || 0,
      metodo_pago: metodoPago,
      banco_financiera: banco,
      ofrecimiento_cliente: parseFloat(ofrecimiento) || 0,
      toma_a_cuenta: tomaACuenta,
      acudio_cita: acudioCita,
      hizo_demo: hizoDemo,
      cotizacion_url: cotizacionUrl,
      comentarios_vendedor: comentarios,
      fecha_proximo_seguimiento: proxSeguimiento || null
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      onClose();
    }
  }

  async function handleConfirmCancel() {
    setLoading(true);
    const res = await updateApartadoAction(apartado.id_venta, {
      id_carro: null,
      estatus_proceso: 'cancelado'
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95dvh] overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl">
          <div>
            <h2 className="text-xl font-bold text-neutral-50">Gestionar Apartado</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Expediente de Venta #{apartado.id_venta}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10 custom-scrollbar pb-12">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* 1. SECCIÓN VEHÍCULO */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <CarIcon className="size-4" /> Unidad Reservada
            </h3>
            {selectedAuto ? (
              <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-2xl border border-[var(--color-primary)]/30">
                <div className="size-16 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/5 relative">
                    <CarIcon className="size-8 text-zinc-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-50 truncate">{selectedAuto.marca} {selectedAuto.modelo}</p>
                  <p className="text-xs text-zinc-500 uppercase font-bold">{selectedAuto.anio} · {selectedAuto.tipo}</p>
                </div>
                <button onClick={() => setIsVehicleModalOpen(true)} className="p-2 bg-zinc-800 rounded-lg text-zinc-500 hover:text-[var(--color-primary)] transition-colors border border-white/5">
                    <Search className="size-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsVehicleModalOpen(true)}
                className="w-full bg-zinc-900 border-2 border-dashed border-white/5 hover:border-[var(--color-primary)]/50 rounded-2xl py-6 flex flex-col items-center gap-2 transition-all"
              >
                <Search className="size-4 text-zinc-600" />
                <span className="text-xs font-bold text-zinc-600 uppercase">Seleccionar Auto</span>
              </button>
            )}
          </div>

          {/* 2. SECCIÓN FINANCIERA */}
          <div className="flex flex-col gap-4">
             <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <HandCoins className="size-4" /> Condiciones del Negocio
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Monto Apartado</label>
                    <div className="flex items-center bg-zinc-900 rounded-xl px-4 py-3 border border-white/5 focus-within:border-[var(--color-primary)]/50 transition-all">
                        <span className="text-[var(--color-primary)] font-bold mr-2 text-sm">$</span>
                        <input type="number" value={monto} onChange={e => setMonto(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold w-full" placeholder="0.00" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Ofrecimiento Cliente</label>
                    <div className="flex items-center bg-zinc-900 rounded-xl px-4 py-3 border border-white/5 focus-within:border-[var(--color-primary)]/50 transition-all">
                        <span className="text-[var(--color-primary)] font-bold mr-2 text-sm">$</span>
                        <input type="number" value={ofrecimiento} onChange={e => setOfrecimiento(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold w-full" placeholder="Precio final propuesto" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Método de Pago</label>
                    <select value={metodoPago} onChange={e => setMetodoPago(e.target.value as any)} className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 px-4 text-xs font-bold outline-none text-neutral-300">
                      <option value="contado">CONTADO</option>
                      <option value="credito_bancario">CRÉDITO</option>
                    </select>
                </div>
                {metodoPago === 'credito_bancario' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Banco / Financiera</label>
                    <div className="flex items-center bg-zinc-900 rounded-xl px-4 py-3 border border-white/5 focus-within:border-[var(--color-primary)]/50 transition-all">
                        <Building2 className="size-4 text-zinc-500 mr-2" />
                        <input type="text" value={banco} onChange={e => setBanco(e.target.value)} className="bg-transparent border-none outline-none text-xs font-medium w-full" placeholder="Ej: BBVA, Banorte..." />
                    </div>
                  </div>
                )}
                <div className="col-span-full pt-2">
                    <label className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-white/5 cursor-pointer hover:bg-zinc-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-lg flex items-center justify-center ${tomaACuenta ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                <Handshake className="size-4" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold">¿Entrega auto a cuenta?</p>
                                <p className="text-[10px] text-zinc-500 uppercase">Ajustar valor final de la oferta</p>
                            </div>
                        </div>
                        <input type="checkbox" checked={tomaACuenta} onChange={e => setTomaACuenta(e.target.checked)} className="size-5 accent-[var(--color-primary)]" />
                    </label>
                </div>
            </div>
          </div>

          {/* 3. SECCIÓN SEGUIMIENTO */}
          <div className="flex flex-col gap-4">
             <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <Target className="size-4" /> Hitos del Proceso
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <ToggleCard 
                    active={acudioCita} 
                    onChange={setAcudioCita} 
                    icon={<Calendar className="size-4" />} 
                    label="¿Acudió a Cita?" 
                    desc="Confirmar asistencia física"
                />
                <ToggleCard 
                    active={hizoDemo} 
                    onChange={setHizoDemo} 
                    icon={<CarIcon className="size-4" />} 
                    label="¿Realizó Demo?" 
                    desc="Prueba de manejo hecha"
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Próximo Seguimiento</label>
                    <input type="datetime-local" value={proxSeguimiento} onChange={e => setProxSeguimiento(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold outline-none text-neutral-300" />
                </div>
            </div>
          </div>

          {/* 4. SECCIÓN EXPEDIENTE Y NOTAS */}
          <div className="flex flex-col gap-6 pt-2">
            <div className="space-y-2">
                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="size-4" /> Expediente Digital
                </label>
                <div className="flex items-center bg-zinc-900 rounded-xl px-4 py-4 border border-white/5 focus-within:border-[var(--color-primary)]/50 transition-all">
                    <FileText className="size-4 text-zinc-500 mr-3" />
                    <input type="text" value={cotizacionUrl} onChange={e => setCotizacionUrl(e.target.value)} className="bg-transparent border-none outline-none text-xs font-medium w-full text-zinc-300" placeholder="Pega el link del PDF de cotización aquí..." />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="size-4" /> Bitácora del Vendedor
                </label>
                <textarea 
                    value={comentarios} 
                    onChange={e => setComentarios(e.target.value)} 
                    rows={4} 
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all italic text-zinc-300 resize-none" 
                    placeholder="Escribe aquí los acuerdos o detalles de la última interacción..."
                />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex gap-4 backdrop-blur-md">
          <button onClick={onClose} className="px-6 py-4 rounded-2xl text-zinc-500 font-bold hover:text-white transition-all text-sm">Cancelar</button>
          <button 
                onClick={handleSave} 
                disabled={loading} 
                className="flex-1 bg-[var(--color-primary)] hover:bg-[#ffe040] disabled:opacity-50 text-[var(--color-primary-dark)] font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-[var(--color-primary)]/10 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin size-5" /> : <><CheckCircle2 className="size-5" /> Actualizar Expediente</>}
          </button>
        </div>

        {/* Cancel Confirm */}
        {showDeleteConfirm && (
            <div className="absolute inset-0 z-50 bg-zinc-950 p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
                <AlertTriangle className="size-16 text-red-500 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-neutral-50 mb-2">¿Cancelar Apartado?</h3>
                <p className="text-sm text-zinc-500 mb-8 max-w-xs">Esta acción liberará el vehículo y removerá al cliente del flujo de reservación activa.</p>
                <div className="flex flex-col w-full gap-3">
                    <button onClick={handleConfirmCancel} className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl">Confirmar Cancelación</button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="text-zinc-500 font-bold py-2 text-sm uppercase">Cerrar</button>
                </div>
            </div>
        )}

        <VehicleSelectorModal isOpen={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} onSelect={v => {setSelectedAuto(v); setIsVehicleModalOpen(false);}} searchAction={getAvailableAutosAction} />
      </div>
    </div>
  );
}

function ToggleCard({ active, onChange, icon, label, desc }: any) {
    return (
        <div 
            onClick={() => onChange(!active)}
            className={`flex flex-col gap-2 p-4 rounded-2xl border cursor-pointer transition-all ${active ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-900 border-white/5 hover:border-white/10'}`}
        >
            <div className="flex justify-between items-center">
                <div className={`p-2 rounded-lg ${active ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{icon}</div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${active ? 'bg-green-500 border-green-500' : 'border-zinc-700'}`}>
                    {active && <CheckCircle2 className="size-3 text-white" />}
                </div>
            </div>
            <div>
                <p className={`text-[13px] font-bold ${active ? 'text-green-500' : 'text-neutral-50'}`}>{label}</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-tighter">{desc}</p>
            </div>
        </div>
    );
}
