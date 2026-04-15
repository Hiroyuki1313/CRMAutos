'use client';

import { useState } from "react";
import { 
    ArrowLeft, 
    User, 
    Phone, 
    Megaphone, 
    Building2, 
    Share2, 
    Thermometer,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { createClientAction } from "./actions";
import { BottomNav } from "@/presentation/components/organisms/BottomNav";

export default function NuevoClientePage() {
    const [origen, setOrigen] = useState<'ads' | 'piso' | 'redes'>('piso');
    const [probabilidad, setProbabilidad] = useState<'rechazo' | 'frio' | 'medio' | 'alto' | 'venta'>('frio');
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPending(true);
        setError(null);
        
        const formData = new FormData(e.currentTarget);
        formData.set('origen', origen);
        formData.set('probabilidad', probabilidad);
        
        const result = await createClientAction(formData);
        if (result?.error) {
            setError(result.error);
            setPending(false);
        }
    }

    return (
        <div className="bg-white text-slate-900 w-full min-h-screen flex flex-col font-sans animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex px-6 pt-12 pb-8 items-center gap-6 border-b border-slate-100 bg-slate-50/50">
                <Link href="/clientes" className="flex justify-center items-center size-10 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                    <ArrowLeft className="size-5 text-slate-600" />
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nuevo Cliente</h1>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registro de prospecto</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex px-6 pt-10 pb-32 flex-col gap-10 flex-1 max-w-2xl mx-auto w-full">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-xs font-bold shadow-sm animate-in shake-in">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Nombre */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Nombre Completo
                        </label>
                        <div className="flex items-center gap-4 bg-slate-50 rounded-[1.5rem] px-5 py-4 border border-slate-200 focus-within:bg-white focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/5 transition-all">
                            <User className="size-5 text-slate-300 shrink-0" />
                            <input 
                                name="nombre"
                                required
                                type="text" 
                                placeholder="Ingresa el nombre completo"
                                className="bg-transparent border-none outline-none text-sm w-full font-bold text-slate-900 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Teléfono
                        </label>
                        <div className="flex items-center gap-4 bg-slate-50 rounded-[1.5rem] px-5 py-4 border border-slate-200 focus-within:bg-white focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/5 transition-all">
                            <Phone className="size-5 text-slate-300 shrink-0" />
                            <input 
                                name="telefono"
                                required
                                type="tel" 
                                placeholder="55 1234 5678"
                                className="bg-transparent border-none outline-none text-sm w-full font-bold text-slate-900 placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Origen */}
                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Origen del Cliente
                    </label>
                    <div className="flex gap-4">
                        <OriginButton 
                            active={origen === 'ads'} 
                            onClick={() => setOrigen('ads')}
                            icon={<Megaphone className="size-5" />}
                            label="Ads"
                            color="var(--color-primary)"
                        />
                        <OriginButton 
                            active={origen === 'piso'} 
                            onClick={() => setOrigen('piso')}
                            icon={<Building2 className="size-5" />}
                            label="Piso"
                            color="#3b82f6" 
                        />
                        <OriginButton 
                            active={origen === 'redes'} 
                            onClick={() => setOrigen('redes')}
                            icon={<Share2 className="size-5" />}
                            label="Redes"
                            color="#10b981"
                        />
                    </div>
                </div>

                {/* Probabilidad */}
                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Thermometer className="size-4" /> Temperatura del Lead
                    </label>
                    <div className="grid grid-cols-5 gap-1.5 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-200">
                        <button 
                            type="button"
                            onClick={() => setProbabilidad('rechazo')}
                            className={`py-3 rounded-xl text-[8px] font-black tracking-tight transition-all ${probabilidad === 'rechazo' ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/20' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            RECHAZO
                        </button>
                        <button 
                            type="button"
                            onClick={() => setProbabilidad('frio')}
                            className={`py-3 rounded-xl text-[8px] font-black tracking-tight transition-all ${probabilidad === 'frio' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            FRIO
                        </button>
                        <button 
                            type="button"
                            onClick={() => setProbabilidad('medio')}
                            className={`py-3 rounded-xl text-[8px] font-black tracking-tight transition-all ${probabilidad === 'medio' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            MEDIO
                        </button>
                        <button 
                            type="button"
                            onClick={() => setProbabilidad('alto')}
                            className={`py-3 rounded-xl text-[8px] font-black tracking-tight transition-all ${probabilidad === 'alto' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            ALTO
                        </button>
                        <button 
                            type="button"
                            onClick={() => setProbabilidad('venta')}
                            className={`py-3 rounded-xl text-[8px] font-black tracking-tight transition-all ${probabilidad === 'venta' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            VENTA
                        </button>
                    </div>
                </div>

                {/* Comentarios */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Primer Comentario / Seguimiento Inicial
                    </label>
                    <div className="bg-slate-50 rounded-[1.5rem] px-5 py-5 border border-slate-200 focus-within:bg-white focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/5 transition-all">
                        <textarea 
                            name="comentarios"
                            placeholder="Ej: Interesado en Pickups..."
                            rows={4}
                            className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-900 placeholder:text-slate-300 resize-none"
                        />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold italic px-2">
                        * Al registrar, se creará automáticamente un nuevo seguimiento en el grid.
                    </span>
                </div>

                {/* Submit Button */}
                <button 
                    disabled={pending}
                    type="submit"
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:opacity-50 active:scale-95 transition-all text-white font-black text-sm py-5 rounded-[1.5rem] shadow-xl shadow-[var(--color-primary)]/20 flex justify-center items-center gap-3 mt-4 uppercase tracking-widest"
                >
                    {pending ? 'Registrando...' : 'Registrar Cliente'}
                    {!pending && <CheckCircle2 className="size-5" />}
                </button>
            </form>

            <BottomNav />
        </div>
    );
}

function OriginButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) {
    return (
        <div 
            onClick={onClick}
            className={`flex-1 flex flex-col justify-center items-center gap-3 py-6 rounded-3xl border-2 transition-all cursor-pointer shadow-sm active:scale-95 ${active ? 'bg-white border-current' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
            style={{ color: active ? color : '#94a3b8' }}
        >
            <div className={`size-12 rounded-2xl flex justify-center items-center transition-all ${active ? '' : 'bg-white border border-slate-100'}`} style={{ backgroundColor: active ? color : undefined, color: active ? '#fff' : '#94a3b8' }}>
                {icon}
            </div>
            <span className={`text-[10px] uppercase tracking-widest ${active ? 'font-black' : 'font-bold text-slate-400'}`}>
                {label}
            </span>
        </div>
    );
}

function ChevronRight({ className }: { className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    )
}
