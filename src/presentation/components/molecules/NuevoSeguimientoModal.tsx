'use client';

import { useState, useTransition, useEffect } from "react";
import { X, User, Phone, MessageCircle, CheckCircle2, Loader2, AlertTriangle, Info } from "lucide-react";
import { createSeguimientoAction, checkDuplicatePhoneAction } from "@/app/(dashboard)/apartados/actions";
import { OrigenProspecto } from "@/core/domain/entities/Apartado";
import { StringFormatter } from "@/presentation/utils/formatters";

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
    const [phone, setPhone] = useState("");
    const [duplicateInfo, setDuplicateInfo] = useState<{ nombre: string, vendedor: string, type: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (phone.length === 13) {
            checkDuplicate();
        } else {
            setDuplicateInfo(null);
        }
    }, [phone]);

    async function checkDuplicate() {
        const res = await checkDuplicatePhoneAction(phone);
        if (res.found) {
            setDuplicateInfo({
                nombre: res.nombre!,
                vendedor: res.vendedor!,
                type: res.type!
            });
        }
    }

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        if (duplicateInfo) {
            alert(`ATENCIÓN: El número ${phone} ya tiene un registro a nombre de ${duplicateInfo.nombre} (Asesor: ${duplicateInfo.vendedor}). Por favor, revise el número.`);
            return;
        }

        setError(null);
        const formData = new FormData(e.currentTarget);
        formData.set('origen', origen);
        formData.set('telefono', phone);

        startTransition(async () => {
            const res = await createSeguimientoAction(formData);
            if (res.success) {
                setPhone("");
                setDuplicateInfo(null);
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
                                    value={phone}
                                    onChange={(e) => setPhone(StringFormatter.formatMexicanPhone(e.target.value))}
                                    placeholder="Ej: 614 119-66-53"
                                    className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-300"
                                />
                            </div>
                            {duplicateInfo && (
                                <div className="mt-2 flex items-start gap-2 bg-amber-50/50 border border-amber-100 rounded-xl p-3 animate-in slide-in-from-top-1 duration-300">
                                    <AlertTriangle className="size-3 text-amber-500 mt-0.5 shrink-0" />
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-[9px] text-amber-800 font-bold leading-tight">
                                            Ya registrado en <span className="underline">{duplicateInfo.type === 'seguimiento' ? 'Seguimientos' : 'Directorio'}</span>
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[8px] font-black text-slate-600 uppercase">{duplicateInfo.nombre}</span>
                                            <div className="size-1 rounded-full bg-amber-300" />
                                            <span className="text-[8px] text-slate-400 font-bold">Asesor: <span className="text-slate-900">{duplicateInfo.vendedor}</span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
