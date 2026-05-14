'use client';

import { useState, useEffect } from "react";
import { Search, X, Car as CarIcon, ChevronRight, Loader2, ImageOff } from "lucide-react";
import { Auto } from "@/core/domain/entities/Auto";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (auto: Auto) => void;
  onTemporalSelect?: (reference: string) => void;
  searchAction: (query: string) => Promise<Auto[]>;
}

export function VehicleSelectorModal({ isOpen, onClose, onSelect, onTemporalSelect, searchAction }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [autos, setAutos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTemporalMode, setIsTemporalMode] = useState(false);
  const [temporalRef, setTemporalRef] = useState("");

  useEffect(() => {
    if (isOpen) {
        setSearchTerm("");
        setIsTemporalMode(false);
        setTemporalRef("");
        loadInitialData();
    }
  }, [isOpen]);

  async function loadInitialData() {
    setLoading(true);
    try {
        const results = await searchAction("");
        setAutos(results);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  }

  async function handleSearch(term: string) {
    setSearchTerm(term);
    setLoading(true);
    try {
      const results = await searchAction(term);
      setAutos(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-[2.5rem] shadow-2xl flex flex-col h-[70dvh] overflow-hidden animate-in zoom-in-95 duration-200 transition-all ${isTemporalMode ? 'ring-2 ring-indigo-500/20' : ''}`}>
        
        {!isTemporalMode ? (
          <>
            {/* Header: Inventory Mode */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-white/50">
                <div className="relative flex-1 group">
                    <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <input 
                        autoFocus
                        type="text"
                        placeholder="Buscar marca, modelo o año..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:bg-white focus:border-[var(--color-primary)]/30 transition-all text-slate-900 font-medium"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {onTemporalSelect && (
                        <button 
                            onClick={() => setIsTemporalMode(true)}
                            className="px-5 py-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all whitespace-nowrap shadow-sm active:scale-95"
                        >
                            Registro Temporal
                        </button>
                    )}
                    <button 
                        onClick={onClose}
                        className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100 active:scale-95"
                    >
                        <X className="size-5" />
                    </button>
                </div>
            </div>

            {/* Body: Inventory List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                        <Loader2 className="size-8 animate-spin text-[var(--color-primary)]" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Consultando Inventario...</p>
                    </div>
                ) : autos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {autos.map((auto) => {
                            const fotos = typeof auto.fotos_url === 'string' ? JSON.parse(auto.fotos_url) : auto.fotos_url;
                            const mainPhotoRaw = Array.isArray(fotos) && fotos.length > 0 ? fotos[0] : null;
                            const isRealPhoto = mainPhotoRaw && (mainPhotoRaw.startsWith('http') || mainPhotoRaw.startsWith('/uploads/'));
                            const mainPhoto = isRealPhoto ? mainPhotoRaw : null;

                            return (
                                <div 
                                    key={auto.id}
                                    onClick={() => onSelect(auto)}
                                    className="group relative flex items-center gap-4 p-3 rounded-[1.5rem] bg-white border border-slate-100 hover:border-[var(--color-primary)]/50 hover:bg-slate-50 transition-all cursor-pointer overflow-hidden shadow-sm"
                                >
                                    <div className="relative size-20 shrink-0 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center">
                                        {mainPhoto ? (
                                            <Image 
                                                src={mainPhoto} 
                                                alt={auto.modelo} 
                                                fill 
                                                unoptimized
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : null}
                                        <CarIcon className="size-8 text-slate-200 absolute" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors truncate uppercase text-sm tracking-tight">
                                            {auto.marca} {auto.modelo}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 border border-slate-100">
                                                {auto.anio}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                {auto.tipo || 'Vehículo'}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="size-5 text-slate-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                                </div>
                            );
                        })}
                    </div>
                ) : searchTerm.length > 1 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                        <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                            <CarIcon className="size-10 text-slate-200" />
                        </div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">No hay coincidencias</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest leading-relaxed">Prueba con otra marca o revisa el inventario general.</p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50 animate-in fade-in duration-700">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">Buscador Inteligente</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Escribe para explorar el inventario disponible</p>
                    </div>
                )}
            </div>

            {/* Footer: Inventory Mode */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 text-center uppercase font-black tracking-[0.2em]">
                    Resultados sincronizados con inventario real
                </p>
            </div>
          </>
        ) : (
          <>
            {/* Header: Temporal Mode */}
            <div className="p-8 border-b border-indigo-100 bg-indigo-50/50 flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <CarIcon className="size-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-black text-slate-900 uppercase tracking-tight">Registro Temporal</h3>
                        <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Interés sin unidad asignada</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsTemporalMode(false)}
                    className="p-3 rounded-xl bg-white text-slate-400 hover:text-slate-900 transition-all border border-indigo-100 shadow-sm active:scale-95"
                >
                    <X className="size-5" />
                </button>
            </div>

            {/* Body: Temporal Form */}
            <div className="flex-1 p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Referencia o Descripción del Interés</label>
                    <textarea 
                        autoFocus
                        value={temporalRef}
                        onChange={(e) => setTemporalRef(e.target.value)}
                        placeholder="Ej: Cliente busca pickup doble cabina, prefiere Toyota o Nissan. Presupuesto máx 450k..."
                        className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 focus:bg-white transition-all text-slate-900 resize-none shadow-inner leading-relaxed"
                    />
                </div>
                
                <div className="flex flex-col gap-3 mt-auto">
                    <button 
                        onClick={() => {
                            if(temporalRef.trim()) {
                                onTemporalSelect?.(temporalRef);
                                onClose();
                            }
                        }}
                        className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-600/30"
                    >
                        Confirmar Registro Temporal
                    </button>
                    <button 
                        onClick={() => setIsTemporalMode(false)}
                        className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all"
                    >
                        Volver a la selección de inventario
                    </button>
                </div>
            </div>

            {/* Footer: Temporal Mode */}
            <div className="p-6 bg-white border-t border-slate-50">
                <div className="flex items-center gap-3 text-slate-300">
                    <Loader2 className="size-3" />
                    <p className="text-[9px] uppercase font-bold tracking-widest">
                        Esta nota se guardará en la bitácora del seguimiento
                    </p>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
