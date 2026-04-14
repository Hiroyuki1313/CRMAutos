'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
    ChevronLeft, 
    ChevronRight, 
    Info, 
    Car, 
    Gauge, 
    Users, 
    FileText
} from "lucide-react";
import Image from "next/image";
import { Auto } from "@/core/domain/entities/Auto";

interface VehicleDetailPopupProps {
    auto: Auto;
    anchorRect: DOMRect | null;
}

export function VehicleDetailPopup({ auto, anchorRect }: VehicleDetailPopupProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!auto.fotos_url) return;
        
        try {
            if (typeof auto.fotos_url === 'string') {
                const parsed = JSON.parse(auto.fotos_url);
                setImages(Array.isArray(parsed) ? parsed : [auto.fotos_url]);
            } else if (Array.isArray(auto.fotos_url)) {
                setImages(auto.fotos_url);
            }
        } catch (e) {
            setImages([auto.fotos_url as string]);
        }
    }, [auto.fotos_url]);

    if (!mounted || !anchorRect) return null;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const fallbackImage = "https://images.unsplash.com/photo-1642130204821-74126d1cb88e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBDb3JvbGxhJTIwd2hpdGUlMjBzZWRhbiUyMGNhcnxlbnwxfDJ8fHwxNzc1NzUwMzUyfDA&ixlib=rb-4.1.0&q=80&w=800";

    // Calculate position: Slightly to the right of the trigger
    const popupStyle: React.CSSProperties = {
        position: 'fixed',
        top: Math.max(20, Math.min(window.innerHeight - 500, anchorRect.top)),
        left: anchorRect.right + 20,
        width: '320px',
    };

    // If it goes off-screen to the right, place it to the left
    if (anchorRect.right + 340 > window.innerWidth) {
        popupStyle.left = anchorRect.left - 340;
    }

    const content = (
        <div 
            style={popupStyle}
            className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-[9999] overflow-hidden animate-in zoom-in-95 fade-in duration-300 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Carousel Section */}
            <div className="relative aspect-video bg-slate-100 group">
                {images.length > 0 ? (
                    <>
                        <Image 
                            src={images[currentImageIndex] || fallbackImage}
                            alt={`${auto.marca} ${auto.modelo}`}
                            fill
                            unoptimized={true}
                            className="object-cover transition-opacity duration-300"
                        />
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 border border-slate-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 border border-slate-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {images.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`size-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`} 
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                        <Car className="size-8" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sin Imágenes</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                        {auto.marca} {auto.modelo}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">{auto.anio}</span>
                        <span className="text-slate-400 text-[10px] font-bold">Version: <span className="text-slate-900">{auto.version || "N/A"}</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-5">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <Gauge className="size-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Recorrido</span>
                            <span className="text-[11px] font-bold text-slate-900">{auto.kilometraje?.toLocaleString() || 0} km</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            <Users className="size-4 text-indigo-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dueños</span>
                            <span className="text-[11px] font-bold text-slate-900">{auto.numero_duenos || 1} Propietario(s)</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="size-3" />
                        Documentación Disponible
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {auto.url_factura && <DocBadge label="Factura" />}
                        {auto.url_tarjeta_circulacion && <DocBadge label="Tarjeta" />}
                        {auto.url_poliza_seguro && <DocBadge label="Seguro" />}
                        {!auto.url_factura && !auto.url_tarjeta_circulacion && (
                            <span className="text-[9px] font-bold text-slate-300 italic">No cargada en sistema</span>
                        )}
                    </div>
                </div>

                {auto.es_toma_avaluo && (
                    <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                        <Info className="size-4 text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tight">Adquirido por Avalúo</span>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(content, document.body);
}

function DocBadge({ label }: { label: string }) {
    return (
        <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-tighter">
            {label}
        </span>
    );
}
