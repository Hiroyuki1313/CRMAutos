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
    MessageSquare,
    HandCoins,
    Car as CarIcon,
    Search,
    CheckCircle2,
    X
} from "lucide-react";
import Link from "next/link";
import { createClientAction, getAvailableAutosAction } from "./actions";
import { BottomNav } from "@/presentation/components/organisms/BottomNav";
import { Auto } from "@/core/domain/entities/Auto";
import { VehicleSelectorModal } from "@/presentation/components/molecules/VehicleSelectorModal";
import Image from "next/image";

export default function NuevoClientePage() {
    const [origen, setOrigen] = useState<'ads' | 'piso' | 'redes'>('piso');
    const [probabilidad, setProbabilidad] = useState<'frio' | 'tibio' | 'caliente'>('frio');
    const [showApartado, setShowApartado] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAuto, setSelectedAuto] = useState<Auto | null>(null);
    const [metodoPago, setMetodoPago] = useState<'contado' | 'credito_bancario'>('contado');
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const handleAutoSelect = (auto: Auto) => {
        setSelectedAuto(auto);
        setIsModalOpen(false);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPending(true);
        setError(null);
        
        const formData = new FormData(e.currentTarget);
        formData.set('origen', origen);
        formData.set('probabilidad', probabilidad);
        
        if (showApartado) {
            if (selectedAuto) formData.set('id_carro', selectedAuto.id.toString());
            formData.set('metodo_pago', metodoPago);
            formData.set('abrir_tramite', 'true');
        }

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

            <form onSubmit={handleSubmit} className="flex px-6 pt-8 pb-32 flex-col gap-8 flex-1">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Nombre */}
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#9f9fa9] uppercase tracking-wider">
                        Nombre Completo
                    </label>
                    <div className="flex items-center gap-4 bg-[#1E1E1E] rounded-2xl px-4 py-4 border border-white/10 focus-within:border-[var(--color-primary)] transition-colors">
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
                    <div className="flex items-center gap-4 bg-[#1E1E1E] rounded-2xl px-4 py-4 border border-white/10 focus-within:border-[var(--color-primary)] transition-colors">
                        <Phone className="size-5 text-[#9f9fa9] shrink-0" />
                        <input 
                            name="telefono"
                            required
                            type="tel" 
                            placeholder="55 1234 5678"
                            className="bg-transparent border-none outline-none text-base w-full placeholder:text-zinc-600"
                        />
                    </div>
                    <span className="text-[11px] text-[#9f9fa9] pl-1">
                        El teléfono debe ser único en el sistema
                    </span>
                </div>

                {/* Origen */}
                <div className="flex flex-col gap-4">
                    <label className="text-[13px] font-semibold text-[#9f9fa9] uppercase tracking-wider">
                        Origen
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
                            color="oklch(0.581 0.174 252.3)" // Blueish
                        />
                        <OriginButton 
                            active={origen === 'redes'} 
                            onClick={() => setOrigen('redes')}
                            icon={<Share2 className="size-5" />}
                            label="Redes"
                            color="oklch(0.627 0.194 149.2)" // Greenish
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
                        Primer Comentario / Seguimiento
                    </label>
                    <div className="bg-[#1E1E1E] rounded-2xl px-4 py-4 border border-white/10 focus-within:border-[var(--color-primary)] transition-colors">
                        <textarea 
                            name="comentarios"
                            placeholder="Ej: Interesado en Pickups..."
                            rows={3}
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600 resize-none"
                        />
                    </div>
                </div>

                {/* Botón Amarillo "Abrir Apartado" */}
                {!showApartado ? (
                    <button 
                        type="button"
                        onClick={() => setShowApartado(true)}
                        className="w-full bg-[#f0b100] hover:bg-[#ffe040] transition-all text-[#733e0a] font-bold text-sm py-4 rounded-xl flex justify-center items-center gap-2 border-none cursor-pointer"
                    >
                        <HandCoins className="size-4" />
                        ¿Desea iniciar un trámite / proceso ahora?
                    </button>
                ) : (
                    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-zinc-900 border border-[var(--color-primary)]/30 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-[var(--color-primary)] text-sm flex items-center gap-2 uppercase tracking-tight">
                                <HandCoins className="size-4" /> Configuración de Trámite
                            </h3>
                            <button type="button" onClick={() => setShowApartado(false)} className="text-[10px] text-zinc-500 hover:text-white uppercase font-bold">Cancelar</button>
                        </div>

                        {/* Seleccion de Auto */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-bold text-zinc-400">Vehículo de Interés</label>
                            {selectedAuto ? (
                                <div className="group relative flex items-center gap-4 bg-zinc-800 p-3 rounded-2xl border border-[var(--color-primary)]/50 shadow-lg shadow-[var(--color-primary)]/5 animate-in zoom-in-95 duration-200">
                                    <div className="relative size-16 rounded-xl bg-zinc-700 overflow-hidden border border-white/5 flex items-center justify-center">
                                        {(() => {
                                            const fotos = typeof selectedAuto.fotos_url === 'string' ? JSON.parse(selectedAuto.fotos_url) : selectedAuto.fotos_url;
                                            const photoRaw = Array.isArray(fotos) && fotos.length > 0 ? fotos[0] : null;
                                            const isReal = photoRaw && (photoRaw.startsWith('http') || photoRaw.startsWith('/uploads/'));
                                            const photo = isReal ? photoRaw : null;
                                            return photo ? (
                                                <Image 
                                                    src={photo} 
                                                    alt={selectedAuto.modelo} 
                                                    fill 
                                                    unoptimized
                                                    className="object-cover" 
                                                    onError={(e) => { (e.target as any).style.display = 'none'; }}
                                                />
                                            ) : null;
                                        })()}
                                        <CarIcon className="size-6 text-zinc-500 absolute" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[var(--color-primary)] font-bold text-sm">{selectedAuto.marca} {selectedAuto.modelo}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase font-black">{selectedAuto.anio} · {selectedAuto.tipo || 'Vehículo'}</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedAuto(null)} 
                                        className="p-2 bg-zinc-900 rounded-full hover:bg-red-500/10 hover:text-red-500 text-zinc-500 transition-all border border-white/5"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full bg-zinc-800 border-2 border-dashed border-white/10 hover:border-[var(--color-primary)]/50 hover:bg-zinc-800/80 transition-all rounded-2xl py-6 flex flex-col items-center gap-2 group"
                                >
                                    <div className="size-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Search className="size-5 text-zinc-500 group-hover:text-[var(--color-primary)]" />
                                    </div>
                                    <span className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300">Presiona para buscar en inventario</span>
                                </button>
                            )}
                        </div>

                        {/* Modal Reemplazado */}
                        <VehicleSelectorModal 
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSelect={handleAutoSelect}
                            searchAction={getAvailableAutosAction}
                        />

                        {/* Monto y Pago */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Monto Apartado</label>
                                <div className="relative flex items-center bg-zinc-800 rounded-xl overflow-hidden border border-white/5 focus-within:border-[var(--color-primary)]/50">
                                    <span className="pl-4 pr-1 text-[var(--color-primary)] font-bold text-sm">$</span>
                                    <input 
                                        name="monto_apartado"
                                        type="number" 
                                        placeholder="0.00"
                                        className="w-full bg-transparent border-none py-3 pr-4 text-sm outline-none font-bold text-neutral-50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Método Pago</label>
                                <select 
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value as any)}
                                    className="w-full bg-zinc-800 border border-white/5 rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-bold text-neutral-300"
                                >
                                    <option value="contado">CONTADO</option>
                                    <option value="credito_bancario">CRÉDITO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    disabled={pending}
                    type="submit"
                    className="w-full bg-[#f0b100] hover:bg-[#ffe040] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[#733e0a] font-extrabold text-lg py-5 rounded-2xl shadow-xl shadow-[#f0b100]/10 flex justify-center items-center gap-2"
                >
                    {pending ? 'Procesando...' : (showApartado ? (selectedAuto ? 'Registrar y Apartar' : 'Registrar e Iniciar Trámite') : 'Registrar Cliente')}
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
