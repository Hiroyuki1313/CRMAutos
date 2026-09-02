'use client';

import { useState } from 'react';
import { Upload, Trash2, Loader2, Plus, Image as ImageIcon, CheckCircle2, Eye } from 'lucide-react';
import Image from 'next/image';
import { uploadAutoDocumentAction, deleteAutoDocumentAction } from '../documentActions';
import { optimizeImage } from '@/presentation/utils/imageUtils';

interface Props {
    autoId: number;
    initialPhotos: string[];
    role?: string;
}

export function AutoPhotoManager({ autoId, initialPhotos, role }: Props) {
    const isManagerOrDirector = ['gerente', 'director'].includes(role || '');
    const [photos, setPhotos] = useState<string[]>(initialPhotos);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const processAndUploadFiles = async (files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) return;

        setUploading(true);
        setUploadStatus(`Optimizando ${imageFiles.length} foto${imageFiles.length > 1 ? 's' : ''}...`);

        try {
            const optimizedFiles: File[] = [];
            for (let i = 0; i < imageFiles.length; i++) {
                const f = imageFiles[i];
                if (imageFiles.length > 1) {
                    setUploadStatus(`Optimizando ${i + 1} de ${imageFiles.length}...`);
                }
                const opt = await optimizeImage(f);
                optimizedFiles.push(opt);
            }

            setUploadStatus(`Subiendo ${optimizedFiles.length} foto${optimizedFiles.length > 1 ? 's' : ''}...`);
            const formData = new FormData();
            optimizedFiles.forEach(f => formData.append('files', f));

            const res = await uploadAutoDocumentAction(autoId, 'fotos_url', formData);
            if (res.success && res.urls && res.urls.length > 0) {
                setPhotos(prev => [...prev, ...res.urls!]);
            } else if (res.success && res.url) {
                setPhotos(prev => [...prev, res.url!]);
            } else {
                alert(res.error || 'Error al subir fotos');
            }
        } catch (error: any) {
            console.error('Error al procesar y subir imágenes:', error);
            alert(error?.message || 'Error al procesar imágenes');
        } finally {
            setUploading(false);
            setUploadStatus(null);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const files = Array.from(e.target.files);
        await processAndUploadFiles(files);
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!uploading) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (uploading) return;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await processAndUploadFiles(Array.from(e.dataTransfer.files));
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
        <div 
            className="flex flex-col gap-6"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <ImageIcon className="size-5" /> Galería de Inventario
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md">
                            {photos.length} foto{photos.length !== 1 ? 's' : ''}
                        </span>
                    </h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pl-8">
                        Imágenes de la unidad (selecciona o arrastra varias a la vez)
                    </p>
                </div>

                <label className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-primary-dark)] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--color-primary)]/10">
                    {uploading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>{uploadStatus || 'Subiendo...'}</span>
                        </>
                    ) : (
                        <>
                            <Plus className="size-4" />
                            <span>Subir Fotos</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={handleFileInput} 
                        disabled={uploading} 
                        accept="image/*" 
                    />
                </label>
            </div>

            {/* Zona activa de arrastre */}
            {isDragging && (
                <div className="p-8 rounded-[2rem] border-2 border-dashed border-sky-500 bg-sky-50/80 flex flex-col items-center justify-center gap-2 text-center animate-in fade-in zoom-in-95 duration-200">
                    <Upload className="size-8 text-sky-600 animate-bounce" />
                    <span className="text-xs font-black uppercase tracking-wider text-sky-900">
                        Suelta tus fotos aquí para subirlas de un tirón
                    </span>
                    <span className="text-[10px] font-medium text-sky-700">
                        Se procesarán y optimizarán automáticamente
                    </span>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map((url, index) => (
                    <div key={url} className="group relative aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                        <Image 
                            src={url} 
                            alt={`Foto ${index + 1}`} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-all duration-500" 
                            unoptimized={true}
                        />
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="size-10 rounded-xl bg-white flex items-center justify-center text-slate-900 border border-slate-200 hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm"
                            >
                                <Eye className="size-5" />
                            </a>
                            {isManagerOrDirector && (
                                <button 
                                    onClick={() => handleDelete(url)}
                                    className="size-10 rounded-xl bg-white flex items-center justify-center text-red-500 border border-slate-200 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Eliminar foto"
                                >
                                    <Trash2 className="size-5" />
                                </button>
                            )}
                        </div>

                        {/* Index Badge */}
                        <div className="absolute top-3 left-3 size-6 rounded-lg bg-white/90 backdrop-blur-md flex items-center justify-center text-[9px] font-black text-slate-900 border border-slate-200 shadow-sm">
                            {index + 1}
                        </div>
                    </div>
                ))}

                {photos.length === 0 && (
                    <div className="col-span-full aspect-[4/1] rounded-[2.5rem] bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                        <ImageIcon className="size-10 text-slate-300" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sin fotos en la galería</p>
                    </div>
                )}
            </div>
        </div>
    );
}
