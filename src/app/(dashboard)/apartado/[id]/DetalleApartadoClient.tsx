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
    AlertTriangle,
    ChevronRight,
    Upload,
    Eye,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { VehicleSelectorModal } from "@/presentation/components/molecules/VehicleSelectorModal";
import { updateApartadoAction, getAvailableAutosAction, deleteLastCommentAction } from "./actions";
import { uploadApartadoDocumentAction, deleteApartadoDocumentAction } from "./documentActions";
import Image from 'next/image';
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
    <div className="px-6 py-12 lg:px-12 lg:py-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Header Dashboard Style */}
        <div className="bg-zinc-900/40 p-6 lg:p-10 rounded-[2.5rem] border border-white/5 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex items-center gap-6 flex-1">
                <div className="size-20 rounded-3xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 shadow-2xl relative">
                    <HandCoins className="size-10 text-[var(--color-primary)]" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">Expediente de Venta</span>
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${statusColors[apartado.estatus_proceso] || 'bg-zinc-800'}`}>
                            {apartado.estatus_proceso}
                        </span>
                    </div>
                    <h1 className="font-extrabold text-white text-3xl lg:text-4xl tracking-tighter">Detalle del <span className="text-[var(--color-primary)]">Apartado</span></h1>
                </div>
            </div>

            <div className="flex gap-4">
                <Link href="/apartados" className="rounded-2xl bg-zinc-800 px-6 py-4 flex justify-center items-center gap-2 hover:bg-zinc-700 transition-all active:scale-95 border border-white/5 font-black text-xs uppercase tracking-widest">
                    <ArrowLeft className="size-4" />
                    Volver Listado
                </Link>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-white/5">
             <button onClick={() => setActiveTab('info')} className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'info' ? 'text-[var(--color-primary)]' : 'text-zinc-600 hover:text-zinc-400'}`}>
                Información & Seguimiento
                {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
             </button>
             <button onClick={() => setActiveTab('docs')} className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'docs' ? 'text-[var(--color-primary)]' : 'text-zinc-600 hover:text-zinc-400'}`}>
                Expediente Digital
                {activeTab === 'docs' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
             </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {activeTab === 'info' ? (
              <>
                {/* 1. SECCIÓN CLIENTE Y AUTO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cliente Card */}
                    <div className="bg-zinc-900/40 rounded-[2rem] p-6 border border-white/5 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/5">
                                <User className="size-7" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Comprador</p>
                                <p className="text-lg font-extrabold text-white leading-tight">{cliente?.nombre || "N/D"}</p>
                            </div>
                            <Link href={`/cliente/${cliente?.id}`} className="p-4 rounded-xl bg-zinc-800 text-[var(--color-primary)] border border-white/5 hover:bg-zinc-700 transition-colors">
                                <User className="size-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Auto Visualizer */}
                    <div className="bg-zinc-900/40 rounded-[2rem] p-6 border border-white/5 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-[var(--color-primary)]/5 flex items-center justify-center border border-white/5">
                                <Car className="size-7 text-zinc-700" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Unidad Seleccionada</p>
                                <p className="text-lg font-extrabold text-white leading-tight">{selectedAuto ? `${selectedAuto.marca} ${selectedAuto.modelo}` : "Unidad por definir"}</p>
                            </div>
                            <button onClick={() => setIsVehicleModalOpen(true)} className="p-4 bg-zinc-800 rounded-xl text-zinc-500 hover:text-[var(--color-primary)] border border-white/5 hover:bg-zinc-700 transition-colors">
                                <Search className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. GESTIÓN FINANCIERA */}
                <div className="bg-zinc-900/20 rounded-[2.5rem] border border-white/5 p-8 lg:p-10 flex flex-col gap-8">
                   <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <HandCoins className="size-5" /> Condiciones de Negocio
                   </h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputGroup label="Monto del Apartado" value={monto} onChange={setMonto} prefix="$" />
                        <InputGroup label="Precio Acordado" value={ofrecimiento} onChange={setOfrecimiento} prefix="$" />

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-widest">Método de Adquisición</label>
                            <select value={metodoPago} onChange={e => setMetodoPago(e.target.value as any)} className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none text-white focus:border-[var(--color-primary)] transition-all">
                                <option value="contado">PAGO DE CONTADO</option>
                                <option value="credito_bancario">CRÉDITO / FINANCIERA</option>
                            </select>
                        </div>

                        <InputGroup label="Institución Financiera" value={banco} onChange={setBanco} placeholder="Ej: BBVA, Santander..." icon={<Building2 className="size-5" />} />

                        <div className="col-span-full">
                            <label className="flex items-center justify-between p-6 bg-zinc-900/60 rounded-[1.5rem] border border-white/5 cursor-pointer hover:bg-zinc-900 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-xl flex items-center justify-center transition-all ${tomaACuenta ? 'bg-green-500/20 text-green-400 border border-green-500/20 shadow-lg shadow-green-900/10' : 'bg-zinc-800 text-zinc-600'}`}>
                                        <Handshake className="size-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold text-white">Unidad a cuenta</span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">¿Se recibe toma?</span>
                                    </div>
                                </div>
                                <input type="checkbox" checked={tomaACuenta} onChange={e => setTomaACuenta(e.target.checked)} className="size-6 rounded-lg accent-[var(--color-primary)]" />
                            </label>
                        </div>
                   </div>
                </div>

                {/* 3. BITÁCORA TIMELINE */}
                <div className="flex flex-col gap-8">
                   <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <MessageCircle className="size-5" /> Bitácora de Actividades
                   </h3>

                   <div className="bg-zinc-900/40 rounded-[2.5rem] p-8 border border-white/5 flex flex-col gap-8 shadow-2xl">
                        <div className="flex flex-wrap gap-2.5">
                            <ActionButton active={tipoAccion === 'Llamada'} onClick={() => setTipoAccion('Llamada')} icon={<Phone className="size-3.5" />} label="Llamada" />
                            <ActionButton active={tipoAccion === 'WhatsApp'} onClick={() => setTipoAccion('WhatsApp')} icon={<MessageCircle className="size-3.5" />} label="WhatsApp" />
                            <ActionButton active={tipoAccion === 'Visita'} onClick={() => setTipoAccion('Visita')} icon={<Building2 className="size-3.5" />} label="Visita" />
                            <ActionButton active={tipoAccion === 'Demo'} onClick={() => setTipoAccion('Demo')} icon={<Car className="size-3.5" />} label="Demo" />
                            <ActionButton active={tipoAccion === 'Tramite'} onClick={() => setTipoAccion('Tramite')} icon={<FileText className="size-3.5" />} label="Trámite" />
                            <ActionButton active={tipoAccion === 'Otro'} onClick={() => setTipoAccion('Otro')} icon={<Info className="size-3.5" />} label="Otro" />
                        </div>

                        <textarea 
                            value={comentarios} 
                            onChange={e => setComentarios(e.target.value)} 
                            rows={4} 
                            className="w-full bg-zinc-950 border border-white/5 rounded-[1.5rem] p-6 text-base outline-none focus:border-[var(--color-primary)]/50 transition-all text-white resize-none shadow-inner placeholder:text-zinc-700" 
                            placeholder={tipoAccion ? `Escribe los detalles de la ${tipoAccion}...` : "Selecciona una categoría para registrar una nota..."} 
                        />
                   </div>

                   {/* Timeline Histórico */}
                   <div className="space-y-6 relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-900">
                      {historial.map((item, index) => (
                         <div key={index} className="relative group">
                            <div className="absolute -left-[29px] top-1 size-3.5 rounded-full bg-zinc-800 border-2 border-zinc-950 group-first:bg-[var(--color-primary)] group-first:border-[var(--color-primary)] shadow-xl" />
                            <div className="bg-zinc-900/40 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                   <div className="flex items-center gap-3">
                                      <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.tipo_accion === 'Llamada' ? 'bg-blue-600/10 text-blue-400' : item.tipo_accion === 'WhatsApp' ? 'bg-green-600/10 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                         {item.tipo_accion || 'Nota'}
                                      </div>
                                      <span className="text-[11px] font-extrabold text-zinc-400">@{item.user || 'Vendedor'}</span>
                                   </div>
                                   <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                                      {new Date(item.date).toLocaleDateString()} · {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </span>
                                </div>
                                <p className="text-sm text-zinc-300 leading-relaxed font-medium">"{item.text}"</p>
                                
                                {index === 0 && ['gerente', 'director', 'ti'].includes(role || '') && (
                                   <button 
                                      onClick={async () => {
                                         if(confirm('¿Eliminar última entrada?')) await deleteLastCommentAction(apartado.id_venta);
                                      }}
                                      className="absolute top-4 right-4 text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-2 bg-zinc-900 rounded-xl"
                                   >
                                      <AlertTriangle className="size-4" />
                                   </button>
                                )}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              </>
            ) : (
              /* PESTAÑA DOCUMENTOS */
              <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex flex-col gap-2">
                    <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <FileText className="size-5" /> Expediente Digital de Venta
                    </h3>
                    <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest pl-8">Documentación oficial vinculada a este proceso de apartado</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ApartadoDocumentCard 
                        idVenta={apartado.id_venta}
                        field="cotizacion_url"
                        label="Cotización Oficial"
                        url={apartado.cotizacion_url}
                        icon={<FileText className="size-6" />}
                    />
                 </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (Sticky Stats) */}
          <div className="lg:col-span-4 flex flex-col gap-8 sticky top-24">
             <div className="bg-zinc-900/40 rounded-[2.5rem] p-8 border border-white/5 flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Control Ético</span>
                    <h4 className="text-white font-extrabold text-2xl tracking-tight italic">Estatus de <span className="text-[var(--color-primary)]">Follow-up</span></h4>
                </div>

                <div className="space-y-4">
                   <StatusToggleCard 
                        active={acudioCita} 
                        onToggle={setAcudioCita} 
                        disabled={!!apartado.acudio_cita}
                        icon={<Calendar className="size-5" />} 
                        label="Primer Contacto Físico" 
                    />
                    <StatusToggleCard 
                        active={hizoDemo} 
                        onToggle={setHizoDemo} 
                        disabled={!!apartado.hizo_demo}
                        icon={<Car className="size-5" />} 
                        label="Prueba de Manejo" 
                    />
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-widest">Agenda de Seguimiento</label>
                    <input type="datetime-local" value={proxSeguimiento} onChange={e => setProxSeguimiento(e.target.value)} className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-primary)] transition-all shadow-inner" />
                </div>

                <div className="pt-8 flex flex-col gap-3">
                    {error && <p className="text-red-500 text-[10px] font-black text-center animate-pulse uppercase tracking-[0.2em] mb-2">{error}</p>}
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className={`w-full font-black uppercase tracking-[0.2em] text-sm py-5 rounded-[1.5rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/5 ${saveSuccess ? 'bg-emerald-600 text-white shadow-emerald-900/20' : 'bg-[#f0b100] text-[#733e0a] shadow-[#f0b100]/20 hover:bg-[#ffbe0a]'}`}
                    >
                        {loading ? <Loader2 className="size-5 animate-spin" /> : saveSuccess ? <><CheckCircle2 className="size-5" /> Registrado</> : <><CheckCircle2 className="size-5" /> Sincronizar</>}
                    </button>
                </div>
             </div>

             <div className="bg-blue-600/5 p-8 rounded-[2.5rem] border border-blue-500/10 flex items-center gap-5">
                <div className="size-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/10">
                    <Target className="size-6 text-blue-400" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Meta de Venta</span>
                    <span className="text-sm font-extrabold text-white">Seguimiento Activo</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <VehicleSelectorModal 
        isOpen={isVehicleModalOpen} 
        onClose={() => setIsVehicleModalOpen(false)} 
        onSelect={v => {setSelectedAuto(v); setIsVehicleModalOpen(false);}} 
        searchAction={getAvailableAutosAction} 
      />
    </div>
  );
}

function InputGroup({ label, value, onChange, prefix, placeholder, icon }: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-widest">{label}</label>
            <div className="flex items-center bg-zinc-900/60 rounded-2xl px-6 py-4 border border-white/5 focus-within:border-[var(--color-primary)] transition-all">
                {prefix && <span className="text-[var(--color-primary)] font-black mr-3 text-lg">{prefix}</span>}
                {icon && <div className="text-zinc-600 mr-3">{icon}</div>}
                <input 
                    type={prefix ? "number" : "text"} 
                    value={value} 
                    onChange={e => onChange(e.target.value)} 
                    className="bg-transparent border-none outline-none text-base font-extrabold w-full text-white placeholder:text-zinc-800" 
                    placeholder={placeholder || "0.00"} 
                />
            </div>
        </div>
    );
}

function StatusToggleCard({ active, onToggle, icon, label, disabled }: any) {
    return (
        <div 
            onClick={() => !disabled && onToggle(!active)}
            className={`cursor-pointer p-6 rounded-[1.5rem] border transition-all flex items-center justify-between group ${active ? 'bg-emerald-600/5 border-emerald-500/20' : 'bg-zinc-950 border-white/5 hover:bg-zinc-900'} ${disabled ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-900 text-zinc-700'}`}>{icon}</div>
                <div className="flex flex-col">
                    <p className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-emerald-500' : 'text-zinc-600'}`}>{label}</p>
                    <span className="text-[9px] font-bold text-zinc-700">{active ? 'Completado' : 'Pendiente'}</span>
                </div>
            </div>
            <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'bg-emerald-600 border-emerald-500' : 'border-zinc-800 group-hover:border-zinc-700'}`}>
                {active && <CheckCircle2 className="size-4 text-white" />}
            </div>
        </div>
    );
}

function ActionButton({ active, onClick, icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border ${active ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] border-transparent scale-105 shadow-xl shadow-[var(--color-primary)]/20' : 'bg-zinc-950 text-zinc-600 border-white/5 hover:border-white/10 hover:text-white'}`}
        >
            {icon}
            {label}
        </button>
    );
}

function ApartadoDocumentCard({ idVenta, field, label, url, icon }: { idVenta: number, field: string, label: string, url?: string, icon: React.ReactNode }) {
    const [uploading, setUploading] = useState(false);

    const isImage = url && (url.endsWith('.webp') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'));
    const isPDF = url && url.endsWith('.pdf');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadApartadoDocumentAction(idVenta, field, formData);
        } catch (error) {
            console.error(error);
            alert("Error al subir archivo");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`¿Deseas eliminar el documento: ${label}?`)) return;
        setUploading(true);
        try {
            await deleteApartadoDocumentAction(idVenta, field);
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`group relative flex flex-col gap-5 p-6 rounded-[2.5rem] border transition-all duration-500 ${url ? 'bg-zinc-900/60 border-emerald-500/10 hover:border-emerald-500/30' : 'bg-zinc-950 border-white/5 hover:border-white/10'}`}>
            <div className="flex items-center gap-5">
                {/* Visual Area (Icon or Preview) */}
                <div className={`relative size-16 rounded-2xl flex items-center justify-center transition-all overflow-hidden shrink-0 border border-white/5 ${url ? 'bg-zinc-800' : 'bg-zinc-900 text-zinc-700'}`}>
                    {isImage ? (
                        <Image src={url!} alt={label} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : isPDF ? (
                        <div className="flex flex-col items-center gap-1">
                            <FileText className="size-6 text-red-500" />
                            <span className="text-[8px] font-black uppercase text-red-500/50">PDF</span>
                        </div>
                    ) : (
                        icon
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="size-5 animate-spin text-[var(--color-primary)]" />
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-2">
                    <p className="text-white font-extrabold text-[13px] uppercase tracking-normal leading-tight mb-2 break-word">
                        {label}
                    </p>
                    <div className="flex items-center gap-2">
                        {url ? (
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                <CheckCircle2 className="size-3" /> Digitalizado
                            </span>
                        ) : (
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest opacity-60">Requerido</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5">
                    {url ? (
                        <>
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="size-11 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all border border-white/5 shadow-lg shadow-black/20"
                                title="Ver en grande"
                            >
                                <Eye className="size-5" />
                            </a>
                            <button 
                                onClick={handleDelete}
                                className="size-11 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                                title="Borrar"
                            >
                                {uploading ? <Loader2 className="size-5 animate-spin" /> : <Trash2 className="size-5" />}
                            </button>
                        </>
                    ) : (
                        <label className="size-14 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-dark)] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xl shadow-[var(--color-primary)]/10">
                            {uploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
                            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,application/pdf" />
                        </label>
                    )}
                </div>
            </div>

            {/* Path Breadcrumb */}
            {url && (
                <div className="flex items-center gap-2 px-2">
                    <div className="flex-1 h-[1px] bg-white/5" />
                    <span className="text-[8px] font-mono text-zinc-600 truncate opacity-30 max-w-[150px]">
                        {url.split('/').pop()}
                    </span>
                </div>
            )}
        </div>
    );
}
