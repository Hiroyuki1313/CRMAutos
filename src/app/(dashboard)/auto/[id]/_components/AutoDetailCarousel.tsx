'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Car as CarIcon } from 'lucide-react';
import Image from 'next/image';

interface Props {
    photos: string[];
    alt: string;
}

export function AutoDetailCarousel({ photos, alt }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!photos || photos.length === 0) {
        return (
            <div className="aspect-video w-full rounded-[2.5rem] bg-zinc-950 flex flex-col items-center justify-center border border-dashed border-white/5">
                <CarIcon className="size-12 text-zinc-900 mb-2" />
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Sin imágenes disponibles</p>
            </div>
        );
    }

    const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

    return (
        <div className="flex flex-col gap-6 group">
            {/* Main Image Viewport */}
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-zinc-950">
                <Image 
                    src={photos[currentIndex]} 
                    alt={`${alt} - Foto ${currentIndex + 1}`} 
                    fill 
                    className="object-cover transition-all duration-500"
                    priority
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none" />

                {/* Navigation Arrows */}
                {photos.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.preventDefault(); prev(); }}
                            className="absolute left-6 top-1/2 -translate-y-1/2 size-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                        >
                            <ChevronLeft className="size-6" />
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); next(); }}
                            className="absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                        >
                            <ChevronRight className="size-6" />
                        </button>
                    </>
                )}

                {/* Counter Badge */}
                <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-[10px] font-black text-white backdrop-blur-md tracking-widest uppercase">
                    {currentIndex + 1} / {photos.length}
                </div>
            </div>

            {/* Thumbnails Strip */}
            {photos.length > 1 && (
                <div className="flex gap-4 px-2 overflow-x-auto no-scrollbar justify-center">
                    {photos.map((photo, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative size-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                currentIndex === idx ? 'border-[var(--color-primary)] scale-105 shadow-lg shadow-[var(--color-primary)]/20' : 'border-transparent opacity-40 hover:opacity-100'
                            }`}
                        >
                            <Image src={photo} alt={`Thumb ${idx}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
