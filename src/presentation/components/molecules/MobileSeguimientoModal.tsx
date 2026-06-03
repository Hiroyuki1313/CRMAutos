'use client';

import { useState, useTransition, useEffect } from "react";
import { 
    X, ArrowLeft, Loader2, Check, User, Phone, Calendar, Clock, 
    Activity, Users, Car, HandCoins, DollarSign, MessageCircle, Send, Globe, Award
} from "lucide-react";
import { 
    updateApartadoFieldAction, 
    updateClientFieldAction, 
    addApartadoCommentAction 
} from "@/app/(dashboard)/apartados/actions";
import { Apartado, OrigenProspecto } from "@/core/domain/entities/Apartado";
import { StringFormatter } from "@/presentation/utils/formatters";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    apartado: Apartado;
    vendedores: { id: number, nombre: string }[];
    isDirector: boolean;
    canReassign: boolean;
}

const ORIGEN_OPTIONS: { id: OrigenProspecto; label: string }[] = [
    { id: 'digital', label: 'Digital' },
    { id: 'prospecto del asesor', label: 'Prospecto del Asesor' },
    { id: 'base de datos', label: 'Base de Datos' },
    { id: 'prospecciones de cartera', label: 'Pros. Cartera' },
    { id: 'prospectos de piso', label: 'Pros. Piso' },
    { id: 'puntos de venta', label: 'Puntos de Venta' },
    { id: 'recomendados', label: 'Recomendados' },
    { id: 'redes sociales propias', label: 'Redes Propias' },
    { id: 'ofrecimiento a cliente', label: 'Ofrecimiento' },
    { id: 'volanteo y cabezeo (seguimineto)', label: 'Volanteo/Cabezeo' }
];

const PROB_OPTIONS = ['Rechazo', 'Frio', 'Bajo', 'Medio', 'Alto', 'Venta', 'Largo Plazo'];

const ESTATUS_CREDITO_OPTIONS = [
    'pendiente respuesta', 'autorizado', 'preautorizado', 'rechazado', 'condicionado', 'vendido', 'cancelado'
];

export function MobileSeguimientoModal({ isOpen, onClose, apartado, vendedores, isDirector, canReassign }: Props) {
    const [localApartado, setLocalApartado] = useState<Apartado>(apartado);
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [savedField, setSavedField] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const [newComment, setNewComment] = useState("");
    const [commentsHistory, setCommentsHistory] = useState<{ date: string, text: string }[]>([]);

    useEffect(() => {
        setLocalApartado(apartado);
        parseComments(apartado.comentarios_vendedor || "");
    }, [apartado]);

    if (!isOpen) return null;

    const parseComments = (json: string) => {
        try {
            if (json) {
                const parsed = JSON.parse(json);
                const history = Array.isArray(parsed) ? parsed : [{ date: new Date().toISOString(), text: json }];
                setCommentsHistory(history.filter((c: any) => !c.text.startsWith('[REGISTRO TEMPORAL]')));
            }
        } catch {
            setCommentsHistory(json ? [{ date: new Date().toISOString(), text: json }] : []);
        }
    };

    const handleSaveField = (field: string, value: any) => {
        setIsSaving(field);
        startTransition(async () => {
            const res = await updateApartadoFieldAction(apartado.id_venta, field, value);
            if (res.success) {
                setLocalApartado(prev => ({ ...prev, [field]: value }));
                triggerSavedAlert(field);
            }
        });
    };

    const handleSaveClientField = (field: string, value: any) => {
        if (!apartado.id_cliente) return;
        setIsSaving(field);
        startTransition(async () => {
            const res = await updateClientFieldAction(apartado.id_cliente!, field, value);
            if (res.success) {
                setLocalApartado(prev => ({ 
                    ...prev, 
                    cliente: { ...(prev.cliente || {}), [field]: value } 
                } as any));
                triggerSavedAlert(field);
            }
        });
    };

    const triggerSavedAlert = (field: string) => {
        setIsSaving(null);
        setSavedField(field);
        setTimeout(() => setSavedField(null), 1500);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        startTransition(async () => {
            const res = await addApartadoCommentAction(apartado.id_venta, newComment);
            if (res.success) {
                setNewComment("");
                const updatedComments = [{ date: new Date().toISOString(), text: newComment }, ...commentsHistory];
                setCommentsHistory(updatedComments);
                setLocalApartado(prev => ({ ...prev, comentarios_vendedor: JSON.stringify(updatedComments) }));
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col md:hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center gap-4 shrink-0 shadow-sm">
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <ArrowLeft className="size-6 text-slate-700" />
                </button>
                <div className="flex flex-col min-w-0">
                    <h2 className="text-sm font-black text-slate-900 truncate uppercase leading-tight">
                        {(localApartado as any).cliente?.nombre || localApartado.nombre_prospecto || 'Editar Seguimiento'}
                    </h2>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Trámite #{localApartado.id_venta}
                    </span>
                </div>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
                {/* 1. Información General */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User className="size-3.5 text-indigo-500" />
                        <span>Datos del Prospecto</span>
                    </h3>

                    {/* Nombre */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Nombre Completo</label>
                        <input 
                            type="text"
                            defaultValue={(localApartado as any).cliente?.nombre || localApartado.nombre_prospecto || ""}
                            onBlur={(e) => handleSaveClientField('nombre', e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                        {isSaving === 'nombre' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'nombre' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Teléfono</label>
                        <input 
                            type="tel"
                            defaultValue={(localApartado as any).cliente?.telefono || localApartado.telefono_prospecto || ""}
                            onBlur={(e) => {
                                const formatted = StringFormatter.formatMexicanPhone(e.target.value);
                                e.target.value = formatted;
                                handleSaveClientField('telefono', formatted);
                                handleSaveField('telefono_prospecto', formatted);
                            }}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                        {isSaving === 'telefono' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'telefono' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>

                    {/* Asesor */}
                    {canReassign && (
                        <div className="flex flex-col gap-1.5 relative">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Asesor Asignado</label>
                            <select 
                                value={localApartado.id_vendedor || ""}
                                onChange={(e) => handleSaveField('id_vendedor', e.target.value ? Number(e.target.value) : null)}
                                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner cursor-pointer appearance-none"
                            >
                                <option value="">Sin Asignar</option>
                                {vendedores.map(v => (
                                    <option key={v.id} value={v.id}>{v.nombre}</option>
                                ))}
                            </select>
                            {isSaving === 'id_vendedor' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                            {savedField === 'id_vendedor' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                        </div>
                    )}

                    {/* Origen */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Origen</label>
                        <select 
                            value={localApartado.origen_prospecto || "prospectos de piso"}
                            onChange={(e) => handleSaveField('origen_prospecto', e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner cursor-pointer appearance-none uppercase"
                        >
                            {ORIGEN_OPTIONS.map(o => (
                                <option key={o.id} value={o.id}>{o.label}</option>
                            ))}
                        </select>
                        {isSaving === 'origen_prospecto' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'origen_prospecto' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>
                </div>

                {/* 2. Fechas de Seguimiento */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="size-3.5 text-indigo-500" />
                        <span>Fechas de Control</span>
                    </h3>

                    {/* Fecha Próximo Seguimiento */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Fecha Próximo Seguimiento</label>
                        <input 
                            type="date"
                            value={localApartado.fecha_proximo_seguimiento ? new Date(localApartado.fecha_proximo_seguimiento).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleSaveField('fecha_proximo_seguimiento', e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                        {isSaving === 'fecha_proximo_seguimiento' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'fecha_proximo_seguimiento' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>

                    {/* Fecha Próxima Cita */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Fecha Próxima Cita</label>
                        <input 
                            type="datetime-local"
                            value={localApartado.fecha_proxima_cita 
                                ? new Date(new Date(localApartado.fecha_proxima_cita).getTime() - (new Date(localApartado.fecha_proxima_cita).getTimezoneOffset() * 60000)).toISOString().slice(0, 16) 
                                : ''}
                            onChange={(e) => handleSaveField('fecha_proxima_cita', e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                        {isSaving === 'fecha_proxima_cita' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'fecha_proxima_cita' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>
                </div>

                {/* 3. Negociación y Estado */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="size-3.5 text-indigo-500" />
                        <span>Estado Comercial</span>
                    </h3>

                    {/* Probabilidad */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Probabilidad</label>
                        <select 
                            value={localApartado.probabilidad || "Frio"}
                            onChange={(e) => handleSaveField('probabilidad', e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner cursor-pointer appearance-none"
                        >
                            {PROB_OPTIONS.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        {isSaving === 'probabilidad' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'probabilidad' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>

                    {/* Checkboxes de Negociación */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {/* Acudió Cita */}
                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={localApartado.acudio_cita || false}
                                onChange={(e) => handleSaveField('acudio_cita', e.target.checked)}
                                className="size-5 rounded-lg text-indigo-600 border-slate-200 focus:ring-indigo-500"
                            />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase leading-none">Acudió</span>
                                <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">A la cita</span>
                            </div>
                        </label>

                        {/* Hizo Demo */}
                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={localApartado.hizo_demo || false}
                                onChange={(e) => handleSaveField('hizo_demo', e.target.checked)}
                                className="size-5 rounded-lg text-indigo-600 border-slate-200 focus:ring-indigo-500"
                            />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase leading-none">Demo</span>
                                <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Prueba Manejo</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* 4. Financiamiento y Apartado */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <HandCoins className="size-3.5 text-indigo-500" />
                        <span>Financiamiento y Apartado</span>
                    </h3>

                    {/* Estado de Crédito */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Estado de Crédito</label>
                        <select 
                            value={localApartado.estatus_credito || "pendiente respuesta"}
                            onChange={(e) => handleSaveField('estatus_credito', e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner cursor-pointer appearance-none uppercase"
                        >
                            {ESTATUS_CREDITO_OPTIONS.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        {isSaving === 'estatus_credito' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'estatus_credito' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>

                    {/* Método de Pago */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Método de Pago</label>
                        <select 
                            value={localApartado.metodo_pago || ""}
                            onChange={(e) => handleSaveField('metodo_pago', e.target.value || null)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner cursor-pointer appearance-none"
                        >
                            <option value="">No Definido</option>
                            <option value="contado">Contado</option>
                            <option value="credito_bancario">Crédito Bancario</option>
                        </select>
                        {isSaving === 'metodo_pago' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'metodo_pago' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>

                    {/* Monto Apartado */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Monto Apartado ($)</label>
                        <div className="relative">
                            <DollarSign className="size-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input 
                                type="number"
                                defaultValue={localApartado.monto_apartado || ""}
                                onBlur={(e) => handleSaveField('monto_apartado', e.target.value ? Number(e.target.value) : null)}
                                className="bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 w-full outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                        {isSaving === 'monto_apartado' && <Loader2 className="size-3.5 animate-spin text-indigo-500 absolute right-3 bottom-3" />}
                        {savedField === 'monto_apartado' && <Check className="size-3.5 text-emerald-500 absolute right-3 bottom-3" />}
                    </div>

                    {/* Apartado Realizado */}
                    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={localApartado.apartado_realizado || false}
                            onChange={(e) => handleSaveField('apartado_realizado', e.target.checked)}
                            className="size-5 rounded-lg text-indigo-600 border-slate-200 focus:ring-indigo-500"
                        />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-900 uppercase leading-none">Apartado Realizado</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Recibo emitido</span>
                        </div>
                    </label>
                </div>

                {/* 5. Comentarios y Notas */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageCircle className="size-3.5 text-indigo-500" />
                        <span>Historial y Nueva Nota</span>
                    </h3>

                    {/* Agregar Nota */}
                    <div className="space-y-3">
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Agregar nueva nota de seguimiento comercial..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all min-h-[90px] resize-none shadow-inner"
                        />
                        <button 
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="w-full bg-slate-900 text-white font-black text-[10px] uppercase py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
                        >
                            <span>Guardar Nota</span>
                            <Send className="size-3" />
                        </button>
                    </div>

                    {/* Historial */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Notas Anteriores</span>
                        
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                            {commentsHistory.length === 0 ? (
                                <p className="text-[10px] text-slate-400 italic text-center py-4">Sin notas registradas</p>
                            ) : (
                                commentsHistory.map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
                                        <span className="text-[8px] font-black text-indigo-500 block uppercase">
                                            {new Date(item.date).toLocaleDateString('es-MX', { 
                                                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </span>
                                        <p className="text-[10px] text-slate-600 font-medium leading-normal whitespace-pre-wrap">{item.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
