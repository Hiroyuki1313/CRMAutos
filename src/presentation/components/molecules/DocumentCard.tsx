'use client';

import { useState, useEffect } from "react";
import { 
    FileText, 
    Loader2, 
    Eye, 
    Trash2, 
    Upload, 
    CheckCircle2, 
    X, 
    ExternalLink, 
    Download, 
    AlertTriangle, 
    Maximize2,
    FileCheck,
    File
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { optimizeImage } from "@/presentation/utils/imageUtils";

interface DocumentCardProps {
    id: number | string;
    field: string;
    label: string;
    description?: string;
    url?: string;
    icon?: React.ReactNode;
    onUpload: (id: any, field: string, formData: FormData) => Promise<any>;
    onDelete: (id: any, field: string, url?: string) => Promise<any>;
    accept?: string;
    readOnly?: boolean;
}

export function DocumentCard({ 
    id, 
    field, 
    label, 
    description,
    url, 
    icon, 
    onUpload, 
    onDelete,
    accept = "image/*,application/pdf",
    readOnly = false
}: DocumentCardProps) {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const isPDF = Boolean(url && (url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf')));
    const isImage = Boolean(url && !isPDF && (
        url.toLowerCase().endsWith('.webp') || 
        url.toLowerCase().endsWith('.jpg') || 
        url.toLowerCase().endsWith('.jpeg') || 
        url.toLowerCase().endsWith('.png') ||
        url.toLowerCase().includes('.webp') ||
        url.toLowerCase().includes('.jpg') ||
        url.toLowerCase().includes('.jpeg') ||
        url.toLowerCase().includes('.png') ||
        url.startsWith('blob:') ||
        url.startsWith('data:image')
    ));

    // Cerrar modales con tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showDeleteModal) setShowDeleteModal(false);
                else if (showPreview) setShowPreview(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showDeleteModal, showPreview]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setActionError(null);
        
        let finalFile = file;
        if (file.type.startsWith('image/')) {
            try {
                finalFile = await optimizeImage(file);
            } catch (e) {
                console.warn("Could not optimize image, using original", e);
            }
        }

        const formData = new FormData();
        formData.append('file', finalFile);
        formData.append('field', field);

        try {
            await onUpload(id, field, formData);
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert("Error al subir archivo: " + (error?.message || "Error desconocido"));
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        setActionError(null);
        try {
            const res = await onDelete(id, field, url);
            if (res && res.success === false) {
                setActionError(res.error || "No se pudo eliminar el archivo.");
                setDeleting(false);
                return;
            }
            setShowDeleteModal(false);
            setShowPreview(false);
            router.refresh();
        } catch (error: any) {
            console.error(error);
            setActionError(error?.message || "Ocurrió un error al eliminar el documento.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            {/* Tarjeta Principal */}
            <div className={`group relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
                url
                  ? 'bg-white border-emerald-400/40 shadow-sm hover:shadow-md hover:border-emerald-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}>
                {/* Área de Previsualización / Sneak Peek trigger */}
                <div 
                    onClick={() => {
                        if (url) setShowPreview(true);
                    }}
                    className={`relative w-full aspect-square flex items-center justify-center overflow-hidden transition-all select-none ${
                        url ? 'bg-slate-50 cursor-pointer group/preview' : 'bg-slate-50/70'
                    }`}
                >
                    {isImage ? (
                        <Image 
                            src={url!} 
                            alt={label} 
                            fill 
                            unoptimized={true}
                            sizes="(max-width: 640px) 100vw, 300px"
                            className="object-cover opacity-90 group-hover/preview:scale-105 group-hover/preview:opacity-100 transition-all duration-300" 
                        />
                    ) : isPDF ? (
                        <div className="flex flex-col items-center gap-2 p-4 text-center">
                            <div className="size-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-sm group-hover/preview:scale-110 transition-transform">
                                <FileText className="size-7" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                                PDF Document
                            </span>
                        </div>
                    ) : url ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="size-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                <FileCheck className="size-7" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                Archivo Adjunto
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 border border-dashed border-slate-200">
                                {icon || <File className="size-6 text-slate-300" />}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Sin documento
                            </span>
                        </div>
                    )}

                    {/* Hover Sneak Peek Overlay */}
                    {url && (
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/preview:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                            <div className="bg-white/95 text-slate-900 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transform translate-y-1 group-hover/preview:translate-y-0 transition-transform">
                                <Eye className="size-3.5 text-[var(--color-primary)]" />
                                Sneak Peek
                            </div>
                        </div>
                    )}

                    {/* Loader de Subida */}
                    {uploading && (
                        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                            <Loader2 className="size-7 animate-spin text-[var(--color-primary)]" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Subiendo...</span>
                        </div>
                    )}

                    {/* Badge de Estatus Superior Derecho */}
                    {url && (
                        <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-sm z-10">
                            <CheckCircle2 className="size-3" />
                            <span className="text-[8px] font-black uppercase tracking-wider">Cargado</span>
                        </div>
                    )}
                </div>

                {/* Textos y Acciones */}
                <div className="flex flex-col gap-2 p-3.5 border-t border-slate-100 bg-white">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-slate-900 font-extrabold text-[11px] uppercase tracking-wide leading-tight line-clamp-1">
                            {label}
                        </p>
                        {description && (
                            <p className="text-slate-400 text-[9px] font-bold mt-0.5 line-clamp-1">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-1">
                        {url ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(true)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-wider active:scale-95 shadow-sm"
                                    title="Vista previa del documento"
                                >
                                    <Eye className="size-3.5 text-[var(--color-primary)]" />
                                    <span>Sneak Peek</span>
                                </button>

                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteModal(true);
                                        }}
                                        className="size-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center border border-slate-200 hover:border-rose-200 transition-all shrink-0 active:scale-90"
                                        title="Eliminar documento"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </button>
                                )}
                            </>
                        ) : (
                            !readOnly ? (
                                <label className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-sm shadow-[var(--color-primary)]/20 active:scale-95 transition-all">
                                    {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                                    <span>Subir Archivo</span>
                                    <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept={accept} />
                                </label>
                            ) : (
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest py-1">Pendiente</span>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* ================= MODAL SNEAK PEEK (VISTA PREVIA) ================= */}
            {showPreview && url && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setShowPreview(false)}
                >
                    <div 
                        className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del Sneak Peek */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                                    isPDF 
                                        ? 'bg-red-50 text-red-600 border-red-100' 
                                        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20'
                                }`}>
                                    {isPDF ? <FileText className="size-5" /> : <Eye className="size-5" />}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight truncate">
                                        {label}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                        {description || (isPDF ? 'Formato PDF' : 'Archivo de Imagen')}
                                    </span>
                                </div>
                            </div>

                            {/* Acciones Rápidas */}
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
                                    title="Abrir en pestaña nueva"
                                >
                                    <ExternalLink className="size-4" />
                                </a>
                                <a
                                    href={url}
                                    download
                                    className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
                                    title="Descargar archivo"
                                >
                                    <Download className="size-4" />
                                </a>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 transition-colors shadow-sm ml-1"
                                    title="Cerrar vista previa"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Visor / Cuerpo del Sneak Peek */}
                        <div className="flex-1 overflow-auto bg-slate-900/5 p-4 sm:p-6 flex items-center justify-center min-h-[400px] max-h-[70vh]">
                            {isPDF ? (
                                <iframe 
                                    src={url} 
                                    className="w-full h-[65vh] rounded-2xl border border-slate-200 shadow-inner bg-white"
                                    title={`Previsualización de ${label}`}
                                />
                            ) : isImage ? (
                                <div className="relative w-full h-[65vh] flex items-center justify-center">
                                    <img 
                                        src={url} 
                                        alt={label} 
                                        className="max-w-full max-h-full object-contain rounded-2xl shadow-xl select-none"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm gap-3">
                                    <FileText className="size-16 text-slate-300" />
                                    <p className="text-sm font-bold text-slate-700">Previsualización no disponible para este tipo de archivo</p>
                                    <a 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-black uppercase tracking-wider"
                                    >
                                        Abrir directamente
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Footer del Modal Sneak Peek */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Expediente Oficial de Unidad
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all text-xs font-extrabold uppercase tracking-wider"
                                    >
                                        <Trash2 className="size-3.5" />
                                        <span>Eliminar</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(false)}
                                    className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-extrabold uppercase tracking-wider"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= POPUP MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ================= */}
            {showDeleteModal && (
                <div 
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => {
                        if (!deleting) setShowDeleteModal(false);
                    }}
                >
                    <div 
                        className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Ícono de Advertencia */}
                        <div className="size-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-600/10">
                            <AlertTriangle className="size-8" />
                        </div>

                        {/* Mensajes */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                ¿Eliminar este documento?
                            </h3>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                ¿Estás seguro de que deseas eliminar <strong className="text-slate-900">{label}</strong>? El archivo físico será borrado del servidor y esta acción no se puede deshacer.
                            </p>
                        </div>

                        {/* Mensaje de error si falla */}
                        {actionError && (
                            <div className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold text-center">
                                {actionError}
                            </div>
                        )}

                        {/* Botones de Confirmación */}
                        <div className="flex items-center gap-3 w-full pt-2">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={confirmDelete}
                                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Borrando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="size-4" />
                                        <span>Sí, eliminar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

