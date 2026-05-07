'use client';

import { useState, useTransition } from "react";
import { X, User, Phone, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createSeguimientoAction } from "@/app/(dashboard)/apartados/actions";
import { OrigenProspecto } from "@/core/domain/entities/Apartado";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ORIGEN_OPTIONS: { id: OrigenProspecto; label: string; color: string }[] = [
    { id: 'digital', label: 'Digital', color: 'indigo' },
    { id: 'prospecto del asesor', label: 'Prospecto del Asesor', color: 'blue' },
    { id: 'base de datos', label: 'Base de Datos', color: 'emerald' },
    { id: 'prospecciones de cartera', label: 'Pros. Cartera', color: 'cyan' },
    { id: 'prospectos de piso', label: 'Pros. Piso', color: 'sky' },
    { id: 'puntos de venta', label: 'Puntos de Venta', color: 'violet' },
    { id: 'recomendados', label: 'Recomendados', color: 'fuchsia' },
    { id: 'redes sociales propias', label: 'Redes Propias', color: 'pink' },
    { id: 'ofrecimiento a cliente', label: 'Ofrecimiento', color: 'orange' },
    { id: 'volanteo y cabezeo (seguimineto)', label: 'Volanteo/Cabezeo', color: 'slate' }
];

export function NuevoSeguimientoModal({ isOpen, onClose }: Props) {
    const [origen, setOrigen] = useState<OrigenProspecto>('prospectos de piso');
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        formData.set('origen', origen);
        
        startTransition(async () => {
            const res = await createSeguimientoAction(formData);
            if (res.success) {
                onClose();
            } else {
                setError(res.error || 'Error al guardar');
            }
        });
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            <User className="size-6 text-indigo-600" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Nuevo Seguimiento</h2>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registro de Prospecto</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-colors">
                        <X className="size-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[10px] font-bold">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                                <User className="size-5 text-slate-300" />
                                <input 
                                    required
                                    name="nombre"
                                    type="text"
                                    placeholder="Ej: Juan Pérez"
                                    className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono de Contacto</label>
                            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                                <Phone className="size-5 text-slate-300" />
                                <input 
                                    required
                                    name="telefono"
                                    type="tel"
                                    placeholder="55 1234 5678"
                                    className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Origen */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origen del Prospecto</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {ORIGEN_OPTIONS.map((o) => (
                                <button
                                    key={o.id}
                                    type="button"
                                    onClick={() => setOrigen(o.id)}
                                    className={`py-3 px-2 rounded-xl text-[8px] font-black uppercase tracking-tight transition-all border-2 text-center flex items-center justify-center leading-tight min-h-[48px] ${origen === o.id ? `bg-slate-900 border-slate-900 text-white shadow-lg` : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comentario Inicial</label>
                        <div className="flex items-start gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                            <MessageCircle className="size-5 text-slate-300 mt-0.5" />
                            <textarea 
                                name="comentarios"
                                rows={3}
                                placeholder="Interesado en unidad específica, procedencia..."
                                className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full placeholder:text-slate-300 resize-none"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-slate-900 text-white font-black text-xs py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 uppercase tracking-widest disabled:opacity-50"
                    >
                        {isPending ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            <>
                                <span>Registrar Seguimiento</span>
                                <CheckCircle2 className="size-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
