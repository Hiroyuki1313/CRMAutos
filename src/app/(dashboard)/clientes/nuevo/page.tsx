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
    const [probabilidad, setProbabilidad] = useState<'frio' | 'tibio' | 'caliente'>('frio');
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
        <div className="bg-zinc-950 text-neutral-50 w-full min-h-screen flex flex-col font-sans">
            {/* Header */}
            <div className="flex px-6 pt-12 pb-6 items-center gap-4 border-b border-white/5 bg-zinc-900/30">
                <Link href="/clientes" className="flex justify-center items-center size-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                    <ArrowLeft className="size-5 text-neutral-50" />
                </Link>
                <h1 className="text-xl font-bold text-neutral-50">Nuevo Cliente</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex px-6 pt-8 pb-32 flex-col gap-8 flex-1 max-w-2xl mx-auto w-full">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Nombre */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[#9f9fa9] uppercase tracking-wider">
                            Nombre Completo
                        </label>
                        <div className="flex items-center gap-4 bg-[#1E1E1E] rounded-2xl px-4 py-4 border border-white/10 focus-within:border-[var(--color-primary)] transition-colors text-white">
                            <User className="size-5 text-[#9f9fa9] shrink-0" />
                            <input 
                                name="nombre"
                                required
                                type="text" 
                                placeholder="Ingresa el nombre completo"
                                className="bg-transparent border-none outline-none text-base w-full placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[#9f9fa9] uppercase tracking-wider">
                            Teléfono
                        </label>
                        <div className="flex items-center gap-4 bg-[#1E1E1E] rounded-2xl px-4 py-4 border border-white/10 focus-within:border-[var(--color-primary)] transition-colors text-white">
                            <Phone className="size-5 text-[#9f9fa9] shrink-0" />
                            <input 
                                name="telefono"
                                required
                                type="tel" 
                                placeholder="55 1234 5678"
                                className="bg-transparent border-none outline-none text-base w-full placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Origen */}
                <div className="flex flex-col gap-4">
                    <label className="text-[13px] font-semibold text-[#9f9fa9] uppercase tracking-wider">
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
                    <label className="text-[13px] font-semibold text-[#9f9fa9] uppercase tracking-wider flex items-center gap-2">
                        <Thermometer className="size-4" /> Temperatura del Lead
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-1 rounded-2xl border border-white/5">
                        <button 
                            type="button"
                            onClick={() => setProbabilidad('frio')}
                            className={`py-3 rounded-xl text-xs font-bold transition-all ${probabilidad === 'frio' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-800'}`}
                        >
                            FRIO
                        </button>
                        <button 
                            type="button"
                            onClick={() => setProbabilidad('tibio')}
                            className={`py-3 rounded-xl text-xs font-bold transition-all ${probabilidad === 'tibio' ? 'bg-yellow-500 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-800'}`}
                        >
                            TIBIO
                        </button>
                        <button 
                            type="button"
                            onClick={() => setProbabilidad('caliente')}
                            className={`py-3 rounded-xl text-xs font-bold transition-all ${probabilidad === 'caliente' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-800'}`}
                        >
                            CALIENTE
                        </button>
                    </div>
                </div>

                {/* Comentarios */}
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#9f9fa9] uppercase tracking-wider">
                        Primer Comentario / Seguimiento Inicial
                    </label>
                    <div className="bg-[#1E1E1E] rounded-2xl px-4 py-4 border border-white/10 focus-within:border-[var(--color-primary)] transition-colors text-white">
                        <textarea 
                            name="comentarios"
                            placeholder="Ej: Interesado en Pickups..."
                            rows={3}
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600 resize-none"
                        />
                    </div>
                    <span className="text-[11px] text-[#9f9fa9] italic px-1">
                        * Al registrar, se creará automáticamente un nuevo seguimiento en el grid.
                    </span>
                </div>

                {/* Submit Button */}
                <button 
                    disabled={pending}
                    type="submit"
                    className="w-full bg-[#f0b100] hover:bg-[#ffe040] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[#733e0a] font-extrabold text-lg py-5 rounded-2xl shadow-xl shadow-[#f0b100]/20 flex justify-center items-center gap-3 mt-4"
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
            className={`flex-1 flex flex-col justify-center items-center gap-2 py-5 rounded-2xl border-2 transition-all cursor-pointer ${active ? 'bg-zinc-900 border-current shadow-lg shadow-current/5' : 'bg-[#1E1E1E] border-white/10 hover:border-white/20'}`}
            style={{ color: active ? color : 'inherit' }}
        >
            <div className={`size-10 rounded-xl flex justify-center items-center ${active ? '' : 'bg-zinc-800'}`} style={{ backgroundColor: active ? color : undefined }}>
                <div style={{ color: active ? '#000' : '#9f9fa9' }}>
                    {icon}
                </div>
            </div>
            <span className={`text-[13px] ${active ? 'font-bold' : 'font-semibold text-[#9f9fa9]'}`}>
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
