'use client';

import { useState, useEffect } from "react";
import { Search, X, Car as CarIcon, ChevronRight, Loader2, ImageOff } from "lucide-react";
import { Auto } from "@/core/domain/entities/Auto";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (auto: Auto) => void;
  searchAction: (query: string) => Promise<Auto[]>;
}

export function VehicleSelectorModal({ isOpen, onClose, onSelect, searchAction }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [autos, setAutos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        // Initial load or clear
        setSearchTerm("");
        setAutos([]);
    }
  }, [isOpen]);

  async function handleSearch(term: string) {
    setSearchTerm(term);
    if (term.length > 1) {
      setLoading(true);
      try {
        const results = await searchAction(term);
        setAutos(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setAutos([]);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[80dvh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="relative flex-1">
                <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                    autoFocus
                    type="text"
                    placeholder="Buscar marca, modelo o año..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-zinc-900 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                />
            </div>
            <button 
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
                <X className="size-5" />
            </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-zinc-500">
                    <Loader2 className="size-8 animate-spin text-[var(--color-primary)]" />
                    <p className="text-xs font-medium uppercase tracking-widest">Consultando Inventario...</p>
                </div>
            ) : autos.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {autos.map((auto) => {
                        const fotos = typeof auto.fotos_url === 'string' ? JSON.parse(auto.fotos_url) : auto.fotos_url;
                        const mainPhotoRaw = Array.isArray(fotos) && fotos.length > 0 ? fotos[0] : null;
                        // Only try to load if it looks like a real external URL or a valid upload path
                        const isRealPhoto = mainPhotoRaw && (mainPhotoRaw.startsWith('http') || mainPhotoRaw.startsWith('/uploads/'));
                        const mainPhoto = isRealPhoto ? mainPhotoRaw : null;

                        return (
                            <div 
                                key={auto.id}
                                onClick={() => onSelect(auto)}
                                className="group relative flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[var(--color-primary)]/50 hover:bg-zinc-900 transition-all cursor-pointer overflow-hidden"
                            >
                                {/* Photo Container */}
                                <div className="relative size-20 shrink-0 rounded-xl bg-zinc-800 overflow-hidden border border-white/5 shadow-inner flex items-center justify-center">
                                    {mainPhoto ? (
                                        <Image 
                                            src={mainPhoto} 
                                            alt={auto.modelo} 
                                            fill 
                                            unoptimized
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                // If image fails, hide it and show icon
                                                (e.target as any).style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                    <CarIcon className="size-8 text-zinc-700 absolute" />
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-neutral-50 group-hover:text-[var(--color-primary)] transition-colors truncate">
                                        {auto.marca} {auto.modelo}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                                            {auto.anio}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-500">
                                            {auto.tipo || 'Vehículo'}
                                        </span>
                                    </div>
                                </div>

                                <ChevronRight className="size-5 text-zinc-700 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                                
                                {/* Background glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/0 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            ) : searchTerm.length > 1 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="size-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                        <CarIcon className="size-8 text-zinc-700" />
                    </div>
                    <p className="text-sm font-bold text-neutral-300">No encontramos ese auto</p>
                    <p className="text-xs text-zinc-500 mt-1">Verifica que el auto esté en el inventario o intenta con otra marca.</p>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 mb-2">Buscador Potente</p>
                    <p className="text-xs text-zinc-700">Comienza a escribir la marca o el modelo del auto que buscas.</p>
                </div>
            )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-zinc-900/80 border-t border-white/5 backdrop-blur-sm">
            <p className="text-[10px] text-zinc-600 text-center uppercase font-bold tracking-widest">
                Mostrando solo autos en inventario listo
            </p>
        </div>
      </div>
    </div>
  );
}
