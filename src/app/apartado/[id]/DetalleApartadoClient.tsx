'use client';

import { BottomNav } from "@/presentation/components/organisms/BottomNav";
import { 
    ArrowLeft, 
    Calendar, 
    Info, 
    MessageCircle, 
    Phone, 
    User, 
    Car, 
    FileText, 
    Handshake, 
    Building2, 
    CheckCircle2, 
    Target,
    HandCoins,
    Loader2,
    Search,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { VehicleSelectorModal } from "@/presentation/components/molecules/VehicleSelectorModal";
import { updateApartadoAction, getAvailableAutosAction, deleteLastCommentAction } from "./actions";
import { Apartado } from "@/core/domain/entities/Apartado";
import { Cliente } from "@/core/domain/entities/Cliente";
import { Auto } from "@/core/domain/entities/Auto";

interface Props {
    apartado: Apartado;
    cliente: Cliente | null;
    auto: Auto | null;
    role?: string;
}

export function DetalleApartadoClient({ apartado, cliente, auto, role }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'docs'>('info');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // -- ESTADOS DEL FORMULARIO (EDICIÓN DIRECTA) --
  const [selectedAuto, setSelectedAuto] = useState<Auto | null>(auto);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  
  const [monto, setMonto] = useState(apartado.monto_apartado?.toString() || "");
  const [metodoPago, setMetodoPago] = useState(apartado.metodo_pago || 'contado');
  const [banco, setBanco] = useState(apartado.banco_financiera || "");
  const [ofrecimiento, setOfrecimiento] = useState(apartado.ofrecimiento_cliente?.toString() || "");
  const [tomaACuenta, setTomaACuenta] = useState(!!apartado.toma_a_cuenta);
  const [acudioCita, setAcudioCita] = useState(!!apartado.acudio_cita);
  const [hizoDemo, setHizoDemo] = useState(!!apartado.hizo_demo);
  const [cotizacionUrl, setCotizacionUrl] = useState(apartado.cotizacion_url || "");
  const [comentarios, setComentarios] = useState(""); // Nueva nota del día
  
  // Parsear historial de comentarios
  let historial: any[] = [];
  try {
    if (apartado.comentarios_vendedor) {
      const parsed = JSON.parse(apartado.comentarios_vendedor);
      historial = Array.isArray(parsed) ? parsed : [{ text: apartado.comentarios_vendedor, user: 'Sistema', date: new Date() }];
    }
  } catch (e) {
    historial = [{ text: apartado.comentarios_vendedor || "Sin notas previas", user: 'Sistema', date: new Date() }];
  }

  // Fechas (Formato para input datetime-local)
  const formatForInput = (date?: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  };

  const [proxSeguimiento, setProxSeguimiento] = useState(formatForInput(apartado.fecha_proximo_seguimiento));
  const [tipoAccion, setTipoAccion] = useState<string>(""); // Categoría de la nota


  async function handleSave() {
    if (tipoAccion === "") {
      setError("¡Atención! Por favor selecciona el tipo de acción (Llamada, WhatsApp, etc.).");
      return;
    }
    if (comentarios.trim() === "") {
      setError("¡Atención! Es obligatorio escribir una actualización en la bitácora.");
      return;
    }

    setLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
        const res = await updateApartadoAction(apartado.id_venta, {
            id_carro: selectedAuto?.id || null,
            monto_apartado: parseFloat(monto) || 0,
            metodo_pago: metodoPago,
            banco_financiera: banco,
            ofrecimiento_cliente: parseFloat(ofrecimiento) || 0,
            toma_a_cuenta: tomaACuenta,
            acudio_cita: acudioCita,
            hizo_demo: hizoDemo,
            cotizacion_url: cotizacionUrl,
            comentarios_vendedor: comentarios,
            tipo_accion: tipoAccion,
            fecha_proximo_seguimiento: proxSeguimiento || null
        });

        if (res.error) {
            setError(res.error);
        } else {
            setSaveSuccess(true);
            setComentarios(""); 
            setTipoAccion(""); // Resetear categoría
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    } catch (err) {
        setError("Error de conexión");
    } finally {
        setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    'proceso': 'bg-blue-600 text-white',
    'vendido': 'bg-green-600 text-white',
    'cancelado': 'bg-red-600 text-white'
  };

  return (
    <div className="bg-zinc-950 text-neutral-50 w-full min-h-[100dvh] overflow-y-auto font-sans pb-10">
      
      {/* Header Sticky */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex px-6 pt-10 pb-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/apartados" className="rounded-full bg-zinc-900 p-2">
                  <ArrowLeft className="size-5 text-neutral-50" />
              </Link>
              <h1 className="font-bold text-xl uppercase tracking-tight">Expediente</h1>
            </div>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${statusColors[apartado.estatus_proceso] || 'bg-zinc-800'}`}>
              {apartado.estatus_proceso}
            </span>
          </div>

          <div className="flex px-6 gap-8">
             <button onClick={() => setActiveTab('info')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'info' ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : 'text-zinc-500 border-transparent'}`}>Información</button>
             <button onClick={() => setActiveTab('docs')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'docs' ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : 'text-zinc-500 border-transparent'}`}>Documentos</button>
          </div>
      </div>

      <div className="px-6 py-6 flex flex-col gap-10">
        {activeTab === 'info' ? (
          <>
            {/* 1. SECCIÓN CLIENTE Y AUTO (HEAD) */}
            <div className="flex flex-col gap-4">
                {/* Cliente Card */}
                <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                            <User className="size-5" />
                        </div>
                        <div>
                            <p className="text-base font-bold leading-tight">{cliente?.nombre || "N/D"}</p>
                            <p className="text-xs text-zinc-500">ID Cliente: #{apartado.id_cliente}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href={`tel:${cliente?.telefono}`} className="p-2.5 rounded-xl bg-zinc-800 text-[var(--color-primary)]">
                            <Phone className="size-4" />
                        </a>
                    </div>
                </div>

                {/* Auto Selector / Visualizer */}
                <div className="bg-zinc-900/80 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                        <Car className="size-7 text-zinc-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-zinc-500 uppercase mb-0.5">Unidad de Interés</p>
                        <p className="font-bold text-sm text-neutral-50">{selectedAuto ? `${selectedAuto.marca} ${selectedAuto.modelo}` : "Sin auto asignado"}</p>
                    </div>
                    <button onClick={() => setIsVehicleModalOpen(true)} className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-[var(--color-primary)] border border-white/5">
                        <Search className="size-4" />
                    </button>
                </div>
            </div>

            {/* 2. SECCIÓN FINANCIERA (INPUTS) */}
            <div className="flex flex-col gap-5">
               <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <HandCoins className="size-4" /> Gestión de Negociación
               </h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Monto Apartado</label>
                        <div className="flex items-center bg-zinc-900 rounded-xl px-4 py-3 border border-white/5 focus-within:border-[var(--color-primary)]/50 transition-all">
                            <span className="text-[var(--color-primary)] font-bold mr-2">$</span>
                            <input type="number" value={monto} onChange={e => setMonto(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold w-full text-neutral-50" placeholder="0.00" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Ofrecimiento Cliente</label>
                        <div className="flex items-center bg-zinc-900 rounded-xl px-4 py-3 border border-white/5 focus-within:border-[var(--color-primary)]/50 transition-all">
                            <span className="text-[var(--color-primary)] font-bold mr-2">$</span>
                            <input type="number" value={ofrecimiento} onChange={e => setOfrecimiento(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold w-full text-neutral-50" placeholder="0.00" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Método de Pago</label>
                        <select value={metodoPago} onChange={e => setMetodoPago(e.target.value as any)} className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold outline-none text-zinc-300">
                            <option value="contado">CONTADO</option>
                            <option value="credito_bancario">CRÉDITO</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Banco / Financiera</label>
                        <div className="flex items-center bg-zinc-900 rounded-xl px-4 py-3 border border-white/5 focus-within:border-[var(--color-primary)]/50 transition-all">
                            <Building2 className="size-4 text-zinc-500 mr-2" />
                            <input type="text" value={banco} onChange={e => setBanco(e.target.value)} className="bg-transparent border-none outline-none text-xs font-medium w-full text-neutral-50" placeholder="Ej: BBVA..." />
                        </div>
                    </div>

                    <div className="col-span-full pt-2">
                        <label className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-white/5 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`size-8 rounded-lg flex items-center justify-center ${tomaACuenta ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                    <Handshake className="size-4" />
                                </div>
                                <span className="text-sm font-bold">¿Toma de auto a cuenta?</span>
                            </div>
                            <input type="checkbox" checked={tomaACuenta} onChange={e => setTomaACuenta(e.target.checked)} className="size-5 accent-[var(--color-primary)]" />
                        </label>
                    </div>
               </div>
            </div>

            {/* 3. SECCIÓN HITOS Y AGENDA */}
            <div className="flex flex-col gap-5">
               <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Target className="size-4" /> Hitos de Seguimiento
               </h3>
               <div className="grid grid-cols-2 gap-3">
                  <StatusToggleCard 
                    active={acudioCita} 
                    onToggle={setAcudioCita} 
                    disabled={!!apartado.acudio_cita}
                    icon={<Calendar className="size-4" />} 
                    label="Primera Cita" 
                  />
                  <StatusToggleCard 
                    active={hizoDemo} 
                    onToggle={setHizoDemo} 
                    disabled={!!apartado.hizo_demo}
                    icon={<Car className="size-4" />} 
                    label="Realizó Demo" 
                  />
               </div>

               <div className="grid grid-cols-1 gap-4 mt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Siguiente Cita / Seguimiento</label>
                    <input type="datetime-local" value={proxSeguimiento} onChange={e => setProxSeguimiento(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-[var(--color-primary)] outline-none" />
                  </div>
               </div>
            </div>

            {/* 4. COMENTARIOS Y NOTAS */}
            <div className="flex flex-col gap-3">
               <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageCircle className="size-4" /> Bitácora
               </h3>
               <div className="flex flex-wrap gap-2 mb-3">
                  <ActionButton active={tipoAccion === 'Llamada'} onClick={() => setTipoAccion('Llamada')} icon={<Phone className="size-3" />} label="Llamada" />
                  <ActionButton active={tipoAccion === 'WhatsApp'} onClick={() => setTipoAccion('WhatsApp')} icon={<MessageCircle className="size-3" />} label="WhatsApp" />
                  <ActionButton active={tipoAccion === 'Visita'} onClick={() => setTipoAccion('Visita')} icon={<Building2 className="size-3" />} label="Visita" />
                  <ActionButton active={tipoAccion === 'Demo'} onClick={() => setTipoAccion('Demo')} icon={<Car className="size-3" />} label="Demo" />
                  <ActionButton active={tipoAccion === 'Tramite'} onClick={() => setTipoAccion('Tramite')} icon={<FileText className="size-3" />} label="Trámite" />
                  <ActionButton active={tipoAccion === 'Otro'} onClick={() => setTipoAccion('Otro')} icon={<Info className="size-3" />} label="Otro" />
               </div>

               <textarea 
                  value={comentarios} 
                  onChange={e => setComentarios(e.target.value)} 
                  rows={4} 
                  className="w-full bg-zinc-900 focus:bg-zinc-800 border-2 border-dashed border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[var(--color-primary)]/50 transition-all text-neutral-50 resize-none shadow-inner" 
                  placeholder={tipoAccion ? `Detalles de la ${tipoAccion}...` : "Primero selecciona un tipo de acción arriba..."} 
               />

               {/* Historial de Bitácora */}
               <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Historial de Seguimiento</h4>
                  <div className="flex flex-col gap-3">
                     {historial.map((item, index) => (
                        <div key={index} className="bg-zinc-900/40 rounded-2xl p-4 border border-white/5 relative group">
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                 <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1 ${item.tipo_accion === 'Llamada' ? 'bg-blue-500/20 text-blue-400' : item.tipo_accion === 'WhatsApp' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                    {item.tipo_accion || 'Seguimiento'}
                                 </div>
                                 <span className="text-[11px] font-bold text-zinc-300">by {item.user || 'Vendedor'}</span>
                              </div>
                              <span className="text-[10px] font-medium text-zinc-500">
                                 {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                           <p className="text-xs text-zinc-400 leading-relaxed italic">"{item.text}"</p>
                           
                           {/* Botón de Borrar (Solo Gerencia y último comentario) */}
                           {index === 0 && ['gerente', 'director', 'ti'].includes(role || '') && (
                              <button 
                                 onClick={async () => {
                                    if(confirm('¿Estás seguro de eliminar el último comentario?')) {
                                       await deleteLastCommentAction(apartado.id_venta);
                                    }
                                 }}
                                 className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded-lg"
                                 title="Eliminar comentario"
                              >
                                 <AlertTriangle className="size-3" />
                              </button>
                           )}
                        </div>
                     ))}
                     {historial.length === 0 && (
                        <p className="text-[11px] text-zinc-600 italic text-center py-4">No hay registros previos en la bitácora.</p>
                     )}
                  </div>
               </div>
            </div>

            {/* BOTÓN GUARDAR (Ahora en el contenido) */}
            <div className="flex flex-col gap-3 mt-4">
                {error && <p className="text-red-500 text-[10px] font-bold text-center animate-bounce uppercase tracking-widest">{error}</p>}
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className={`w-full font-black uppercase tracking-[0.15em] text-sm py-4.5 rounded-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${saveSuccess ? 'bg-green-600 text-white' : 'bg-[#f0b100] text-[#733e0a] shadow-[#f0b100]/20'}`}
                >
                    {loading ? <Loader2 className="size-5 animate-spin" /> : saveSuccess ? <><CheckCircle2 className="size-5" /> Expediente Guardado</> : <><CheckCircle2 className="size-5" /> Guardar Apartado</>}
                </button>
            </div>
          </>
        ) : (
          /* PESTAÑA DOCUMENTOS (Mantiene inputs para URL) */
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
             <div className="space-y-4">
                <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileText className="size-4" /> Expediente Digital
                </h3>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Link de Cotización (PDF)</label>
                        <div className="flex items-center bg-zinc-950 rounded-xl px-4 py-4 border border-white/5">
                            <FileText className="size-4 text-zinc-600 mr-3" />
                            <input type="text" value={cotizacionUrl} onChange={e => setCotizacionUrl(e.target.value)} className="bg-transparent border-none outline-none text-xs font-medium w-full text-blue-400 underline" placeholder="https://drive.google.com/..." />
                        </div>
                    </div>
                </div>
             </div>

             {cotizacionUrl && (
                <a href={cotizacionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-zinc-900 p-5 rounded-2xl border border-[var(--color-primary)]/20 hover:bg-zinc-800 transition-colors">
                    <FileText className="size-5 text-[var(--color-primary)]" />
                    <span className="text-sm font-bold">Ver Cotización Actual</span>
                </a>
             )}
          </div>
        )}
      </div>



      <VehicleSelectorModal 
        isOpen={isVehicleModalOpen} 
        onClose={() => setIsVehicleModalOpen(false)} 
        onSelect={v => {setSelectedAuto(v); setIsVehicleModalOpen(false);}} 
        searchAction={getAvailableAutosAction} 
      />

      <BottomNav role={role} />
    </div>
  );
}

function StatusToggleCard({ active, onToggle, icon, label, disabled }: any) {
    return (
        <div 
            onClick={() => !disabled && onToggle(!active)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col gap-3 ${active ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-900 border-white/5'} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            <div className="flex justify-between items-center">
                <div className={`p-2 rounded-lg ${active ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{icon}</div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${active ? 'bg-green-500 border-green-500' : 'border-zinc-700'}`}>
                    {active && <CheckCircle2 className="size-3 text-white" />}
                </div>
            </div>
            <p className={`text-[11px] font-black uppercase tracking-tight ${active ? 'text-green-500' : 'text-zinc-400'}`}>{label} {disabled && "(Bloqueado)"}</p>
        </div>
    );
}

function ActionButton({ active, onClick, icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${active ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] border-transparent scale-105 shadow-lg shadow-[var(--color-primary)]/20' : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10'}`}
        >
            {icon}
            {label}
        </button>
    );
}
