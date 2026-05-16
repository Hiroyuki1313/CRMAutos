'use client';

import { useState } from 'react';
import { Upload, Trash2, Loader2, Plus, Image as ImageIcon, CheckCircle2, Eye } from 'lucide-react';
import Image from 'next/image';
import { uploadAutoDocumentAction, deleteAutoDocumentAction } from '../documentActions';
import { optimizeImage } from '@/presentation/utils/imageUtils';

interface Props {
    autoId: number;
    initialPhotos: string[];
}

export function AutoPhotoManager({ autoId, initialPhotos }: Props) {
    const [photos, setPhotos] = useState<string[]>(initialPhotos);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            let finalFile = file;
            if (file.type.startsWith('image/')) {
                finalFile = await optimizeImage(file);
            }

            const formData = new FormData();
            formData.append('file', finalFile);

            const res = await uploadAutoDocumentAction(autoId, 'fotos_url', formData);
            if (res.success && res.url) {
                setPhotos(prev => [...prev, res.url!]);
            } else {
                alert(res.error || 'Error al subir foto');
            }
        } catch (error) {
            console.error(error);
            alert('Error al procesar imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (url: string) => {
        if (!confirm('¿Deseas eliminar esta foto de la galería?')) return;

        setUploading(true);
        try {
            const res = await deleteAutoDocumentAction(autoId, 'fotos_url', url);
            if (res.success) {
                setPhotos(prev => prev.filter(p => p !== url));
            } else {
                alert(res.error || 'Error al eliminar');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <ImageIcon className="size-5" /> Galería de Inventario
                    </h3>
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest pl-8">Imágenes reales de la unidad</p>
                </div>

                <label className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-primary-dark)] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--color-primary)]/10">
                    {uploading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    Subir Foto
                    <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
                </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map((url, index) => (
                    <div key={url} className="group relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl">
                        <Image 
                            src={url} 
                            alt={`Foto ${index + 1}`} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-all duration-500" 
                            unoptimized={true}
                        />
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="size-10 rounded-xl bg-white/90 flex items-center justify-center text-zinc-900 hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-lg"
                            >
                                <Eye className="size-5" />
                            </a>
                            <button 
                                onClick={() => handleDelete(url)}
                                className="size-10 rounded-xl bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                            >
                                <Trash2 className="size-5" />
                            </button>
                        </div>

                        {/* Index Badge */}
                        <div className="absolute top-3 left-3 size-6 rounded-lg bg-zinc-950/60 backdrop-blur-md flex items-center justify-center text-[9px] font-black text-white border border-white/10">
                            {index + 1}
                        </div>
                    </div>
                ))}

                {photos.length === 0 && (
                    <div className="col-span-full aspect-[4/1] rounded-[2.5rem] bg-zinc-950 border border-dashed border-white/5 flex flex-col items-center justify-center gap-3">
                        <ImageIcon className="size-10 text-zinc-800" />
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Sin fotos en la galería</p>
                    </div>
                )}
            </div>
        </div>
    );
}
