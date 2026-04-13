'use client';

import { useState, useRef } from 'react';
import { 
    MessageSquare, 
    Send, 
    Clock, 
    Car as CarIcon,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Plus as PlusIcon,
    Image as ImageIcon,
    AlertCircle,
    Loader2,
    ShieldCheck,
    FileText,
    CheckCircle2,
    Eye,
    Upload
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    addAvaluoCommentAction, 
    updateAvaluoStatusAction, 
    updateAvaluoCompleteAction,
    addPhotosToAvaluoAction,
    removePhotoFromAvaluoAction 
} from '@/app/(dashboard)/avaluos/actions';
import { 
    uploadAvaluoDocumentAction, 
    deleteAvaluoDocumentAction 
} from '@/app/(dashboard)/avaluos/[id]/documentActions';
import { SubEstadoAvaluo } from '@/core/domain/entities/Avaluo';

interface Props {
    avaluo: any;
}

export default function AvaluoDetailView({ avaluo }: Props) {
    // UI State
    const [activeTab, setActiveTab] = useState<'gestion' | 'expediente'>('gestion');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // ... (rest of the state and handlers remain the same, just adding the tab logic)
    const [editedOferta, setEditedOferta] = useState(avaluo.oferta || 0);
    const [editedVenta, setEditedVenta] = useState(avaluo.venta || 0);
    const [note, setNote] = useState('');
    
    const photos = (() => {
        if (Array.isArray(avaluo.fotos_url)) return avaluo.fotos_url;
        if (typeof avaluo.fotos_url === 'string' && avaluo.fotos_url.trim()) {
            try {
                const parsed = JSON.parse(avaluo.fotos_url);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                // Si no es JSON válido, asumimos que es una URL única (fallback para producción)
                return [avaluo.fotos_url];
            }
        }
        return [];
    })();
            
    const fileInputRef = useRef<HTMLInputElement>(null);

    const history = Array.isArray(avaluo.comentarios_historial) 
        ? avaluo.comentarios_historial 
        : typeof avaluo.comentarios_historial === 'string' 
            ? JSON.parse(avaluo.comentarios_historial || '[]') 
            : [];

    const hasPriceChanges = 
        editedOferta !== (avaluo.oferta || 0) || 
        editedVenta !== (avaluo.venta || 0);

    const handleUpdateStatus = async (newStatus: SubEstadoAvaluo) => {
        if (confirm(`¿Cambiar estado a ${newStatus.toUpperCase()}?`)) {
            await updateAvaluoStatusAction(avaluo.id, newStatus);
        }
    };

    const handleDeletePhoto = async (photoUrl: string) => {
        if (!confirm("¿Eliminar esta foto permanentemente?")) return;
        setIsUploading(true);
        try {
            await removePhotoFromAvaluoAction(avaluo.id, avaluo.id_auto, photoUrl);
            if (currentIndex >= photos.length - 1) setCurrentIndex(Math.max(0, photos.length - 2));
        } catch (error) {
            console.error(error);
            alert("Error al eliminar la foto");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                Array.from(e.target.files).forEach(file => {
                    formData.append('newPhotos', file);
                });
                await addPhotosToAvaluoAction(avaluo.id, avaluo.id_auto, formData);
            } catch (error) {
                console.error(error);
                alert("Error al subir las fotos");
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const handleUnifiedSubmit = async () => {
        if (hasPriceChanges && !note.trim()) {
            alert("Es obligatorio añadir una nota/comentario que justifique los cambios de precio.");
            return;
        }

        if (!hasPriceChanges && !note.trim()) return;

        setIsSubmitting(true);
        try {
            if (hasPriceChanges) {
                const formData = new FormData();
                formData.append('avaluoId', avaluo.id.toString());
                formData.append('id_auto', avaluo.id_auto.toString());
                formData.append('oferta', editedOferta.toString());
                formData.append('venta', editedVenta.toString());
                formData.append('justification', note);
                formData.append('currentPhotos', JSON.stringify(photos)); 
                
                await updateAvaluoCompleteAction(formData);
                setNote('');
            } else {
                await addAvaluoCommentAction(avaluo.id, note);
                setNote('');
            }
        } catch (error) {
            console.error(error);
            alert("Error al procesar la solicitud");
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusOptions: SubEstadoAvaluo[] = ['frio', 'medio', 'alto', 'toma', 'rechazo'];

    return (
        <div className="flex flex-col gap-8">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/avaluos" className="size-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white">
                        <ArrowLeft className="size-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white leading-none">{avaluo.marca} {avaluo.modelo}</h1>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{avaluo.year || avaluo.anio} • {avaluo.ubicacion}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => handleUpdateStatus(status)}
                            className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                avaluo.sub_estado_avaluo === status 
                                ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20' 
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex gap-8 border-b border-white/5 px-4 mb-2">
                <button 
                    onClick={() => setActiveTab('gestion')}
                    className={`font-black text-[10px] uppercase tracking-[0.2em] pb-4 transition-all relative ${activeTab === 'gestion' ? 'text-[var(--color-primary)]' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    Gestión & Fotos
                    {activeTab === 'gestion' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
                </button>
                <button 
                    onClick={() => setActiveTab('expediente')}
                    className={`font-black text-[10px] uppercase tracking-[0.2em] pb-4 transition-all relative ${activeTab === 'expediente' ? 'text-[var(--color-primary)]' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    Expediente Digital
                    {activeTab === 'expediente' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
                </button>
            </div>

            {activeTab === 'gestion' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Left Column: Media & Info */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Financial Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-4 relative overflow-hidden group">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Oferta Compra</span>
                                    {editedOferta !== (avaluo.oferta || 0) && <AlertCircle className="size-3 text-[var(--color-primary)]" />}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        value={editedOferta}
                                        onChange={(e) => setEditedOferta(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-zinc-950/50 border border-white/5 focus:border-[var(--color-primary)]/40 rounded-2xl pl-8 pr-4 py-3 text-2xl font-black text-white outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-4 border-l-4 border-l-[var(--color-primary)] relative overflow-hidden group">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Venta Estimada</span>
                                    {editedVenta !== (avaluo.venta || 0) && <AlertCircle className="size-3 text-[var(--color-primary)]" />}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/50 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        value={editedVenta}
                                        onChange={(e) => setEditedVenta(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-zinc-950/50 border border-white/5 focus:border-[var(--color-primary)]/40 rounded-2xl pl-8 pr-4 py-3 text-2xl font-black text-[var(--color-primary)] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-3 relative overflow-hidden group text-center sm:text-left">
                                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Margen Bruto</span>
                                <span className="text-3xl font-black text-emerald-500 tabular-nums py-3">${(editedVenta - editedOferta).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Carousel Gallery */}
                        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-4 relative group">
                            {isUploading && (
                                <div className="absolute inset-0 z-50 bg-zinc-950/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2.5rem]">
                                    <Loader2 className="size-10 text-[var(--color-primary)] animate-spin mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest text-white">Procesando Imágenes...</p>
                                </div>
                            )}

                            {photos.length > 0 ? (
                                <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-zinc-950 border border-white/5">
                                    <Image 
                                        src={photos[currentIndex]} 
                                        alt={`Foto ${currentIndex + 1}`} 
                                        fill 
                                        className="object-cover transition-all duration-500 shadow-2xl" 
                                        priority
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none" />

                                    {photos.length > 1 && (
                                        <>
                                            <button 
                                                onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                                                className="absolute left-6 top-1/2 -translate-y-1/2 size-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                                            >
                                                <ChevronLeft className="size-6" />
                                            </button>
                                            <button 
                                                onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                                            >
                                                <ChevronRight className="size-6" />
                                            </button>
                                        </>
                                    )}

                                    <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-[10px] font-black text-white backdrop-blur-md tracking-widest uppercase">
                                        {currentIndex + 1} / {photos.length}
                                    </div>

                                    <button 
                                        onClick={() => handleDeletePhoto(photos[currentIndex])}
                                        className="absolute top-6 right-6 size-12 rounded-2xl bg-red-500/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                                    >
                                        <Trash2 className="size-6" />
                                    </button>
                                </div>
                            ) : (
                                <div className="aspect-[21/9] bg-zinc-950 rounded-3xl flex flex-col items-center justify-center border border-dashed border-white/10">
                                    <CarIcon className="size-12 text-zinc-900 mb-2" />
                                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Sin imágenes disponibles</p>
                                </div>
                            )}

                            {/* Thumbnails Strip */}
                            <div className="flex gap-3 mt-4 px-2 overflow-x-auto no-scrollbar pb-2 items-center">
                                {photos.map((foto, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`relative size-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 group/thumb ${
                                            currentIndex === idx ? 'border-[var(--color-primary)] scale-105 shadow-lg shadow-[var(--color-primary)]/10' : 'border-transparent opacity-40 hover:opacity-100'
                                        }`}
                                    >
                                        <Image src={foto} alt={`Thumb ${idx}`} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-red-500">
                                            <Trash2 className="size-4" />
                                        </div>
                                    </button>
                                ))}
                                
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="size-20 rounded-xl bg-zinc-950 border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-700 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all flex-shrink-0"
                                >
                                    <PlusIcon className="size-6 mb-1" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Nueva Foto</span>
                                </button>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    hidden 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Timeline & Note */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6 h-full min-h-[600px]">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="size-5 text-[var(--color-primary)]" />
                                <h2 className="text-xl font-black text-white">Notas e Historial</h2>
                            </div>

                            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar">
                                {hasPriceChanges && (
                                    <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 p-5 rounded-2xl flex items-start gap-3 animate-pulse">
                                        <AlertCircle className="size-4 text-[var(--color-primary)] mt-1 shrink-0" />
                                        <p className="text-xs text-[var(--color-primary)] font-bold leading-relaxed">Se detectaron cambios en los precios. Debes escribir una nota de justificación para guardarlos.</p>
                                    </div>
                                )}

                                {history.length > 0 ? history.map((entry: any, idx: number) => (
                                    <div key={idx} className="relative pl-6 border-l-2 border-zinc-800 flex flex-col gap-2 pb-2">
                                        <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-zinc-800 border-2 border-zinc-950 shadow-lg" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">{entry.usuario}</span>
                                            <span className="text-[9px] font-bold text-zinc-600">{new Date(entry.fecha).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/40 p-4 rounded-2xl border border-white/5 shadow-inner leading-relaxed">
                                            {entry.comentario}
                                        </p>
                                        {entry.metadata && (
                                            <div className="flex gap-4 mt-1 bg-zinc-900/20 p-2 rounded-lg inline-flex self-start">
                                                <span className="text-[8px] font-black text-zinc-500 uppercase">Oferta Compra: ${entry.metadata.oferta?.toLocaleString()}</span>
                                                <span className="text-[8px] font-black text-zinc-500 uppercase">Venta Est: ${entry.metadata.venta?.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                )).reverse() : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 text-center gap-2">
                                        <Clock className="size-8 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Sin actividad registrada</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                                <textarea 
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder={hasPriceChanges ? "Justifica el cambio de precios..." : "Añadir una nota al historial..."}
                                    className={`bg-zinc-950 border rounded-2xl p-5 text-sm outline-none transition-all resize-none h-28 text-white ${
                                        hasPriceChanges ? 'border-[var(--color-primary)]/40' : 'border-white/10 focus:border-[var(--color-primary)]/40 shadow-xl'
                                    }`}
                                />
                                <button 
                                    onClick={handleUnifiedSubmit}
                                    disabled={isSubmitting || (!hasPriceChanges && !note.trim())}
                                    className="w-full bg-[var(--color-primary)] text-[var(--color-primary-dark)] font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--color-primary)]/90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-2xl shadow-[var(--color-primary)]/10 uppercase tracking-widest text-xs"
                                >
                                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                                    <span>{hasPriceChanges ? "Guardar Cambios y Nota" : "Añadir Nota"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* EXPEDIENTE DIGITAL TAB */
                <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <ShieldCheck className="size-5" /> Expediente Digital del Avalúo
                        </h3>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest pl-8">Control documental de la oferta y evaluación mecánica</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AvaluoDocumentCard 
                            avaluoId={avaluo.id}
                            field="hoja_avaluo_url"
                            label="Hoja de Avalúo"
                            url={avaluo.hoja_avaluo_url}
                            icon={<FileText className="size-6" />}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function AvaluoDocumentCard({ avaluoId, field, label, url, icon }: { avaluoId: number, field: string, label: string, url?: string, icon: React.ReactNode }) {
    const [uploading, setUploading] = useState(false);

    const isImage = url && (url.endsWith('.webp') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'));
    const isPDF = url && url.endsWith('.pdf');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadAvaluoDocumentAction(avaluoId, field, formData);
        } catch (error) {
            console.error(error);
            alert("Error al subir archivo");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`¿Deseas eliminar el documento: ${label}?`)) return;
        setUploading(true);
        try {
            await deleteAvaluoDocumentAction(avaluoId, field);
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`group relative flex flex-col gap-5 p-6 rounded-[2.5rem] border transition-all duration-500 ${url ? 'bg-zinc-900/60 border-emerald-500/10 hover:border-emerald-500/30' : 'bg-zinc-950 border-white/5 hover:border-white/10'}`}>
            <div className="flex items-center gap-5">
                <div className={`relative size-16 rounded-2xl flex items-center justify-center transition-all overflow-hidden shrink-0 border border-white/5 ${url ? 'bg-zinc-800' : 'bg-zinc-900 text-zinc-700'}`}>
                    {isImage ? (
                        <Image src={url!} alt={label} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : isPDF ? (
                        <div className="flex flex-col items-center gap-1">
                            <FileText className="size-6 text-red-500" />
                            <span className="text-[8px] font-black uppercase text-red-500/50">PDF</span>
                        </div>
                    ) : (
                        icon
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="size-5 animate-spin text-[var(--color-primary)]" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                    <p className="text-white font-extrabold text-[13px] uppercase tracking-normal leading-tight mb-2 break-word">
                        {label}
                    </p>
                    <div className="flex items-center gap-2">
                        {url ? (
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                <CheckCircle2 className="size-3" /> Digitalizado
                            </span>
                        ) : (
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest opacity-60">Requerido</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2.5">
                    {url ? (
                        <>
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="size-11 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all border border-white/5 shadow-lg shadow-black/20"
                            >
                                <Eye className="size-5" />
                            </a>
                            <button 
                                onClick={handleDelete}
                                className="size-11 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                            >
                                {uploading ? <Loader2 className="size-5 animate-spin" /> : <Trash2 className="size-5" />}
                            </button>
                        </>
                    ) : (
                        <label className="size-14 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-dark)] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xl shadow-[var(--color-primary)]/10">
                            {uploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
                            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,application/pdf" />
                        </label>
                    )}
                </div>
            </div>

            {url && (
                <div className="flex items-center gap-2 px-2">
                    <div className="flex-1 h-[1px] bg-white/5" />
                    <span className="text-[8px] font-mono text-zinc-600 truncate opacity-30">
                        {url.split('/').pop()}
                    </span>
                </div>
            )}
        </div>
    );
}

