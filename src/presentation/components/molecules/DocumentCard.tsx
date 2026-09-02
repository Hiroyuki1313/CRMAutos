'use client';

import { useState, useEffect } from "react";
import { 
    Loader2, 
    Trash2, 
    Upload, 
    CheckCircle2, 
    ExternalLink, 
    AlertTriangle, 
    File,
    FileText
} from "lucide-react";
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

    // Cerrar modal de eliminación con tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showDeleteModal) {
                setShowDeleteModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showDeleteModal]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setActionError(null);
        
        let finalFile = file;
        if (file.type.startsWith('image/')) {
            try {
                finalFile = await optimizeImage(file);
            } catch (err) {
                console.warn("Could not optimize image, using original", err);
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
                  ? 'bg-white border-emerald-400/50 shadow-sm hover:shadow-md hover:border-emerald-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}>
                {/* Área de Visualización Directa del Documento */}
                {url ? (
                    <a 
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-full aspect-square block overflow-hidden bg-slate-50 cursor-pointer group/preview border-b border-slate-100"
                        title={`Clic para abrir ${label} en pantalla completa`}
                    >
                        {isPDF ? (
                            <iframe 
                                src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                                className="w-full h-full pointer-events-none border-0 bg-white"
                                title={label}
                            />
                        ) : isImage ? (
                            <img 
                                src={url} 
                                alt={label} 
                                className="w-full h-full object-cover select-none group-hover/preview:scale-105 transition-transform duration-300" 
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <FileText className="size-12 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase text-emerald-600">Ver Documento</span>
                            </div>
                        )}

                        {/* Overlay sutil al pasar el cursor */}
                        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-end justify-end p-2.5 pointer-events-none">
                            <div className="bg-slate-900/80 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-sm">
                                <ExternalLink className="size-3" />
                                <span>{isPDF ? 'Abrir PDF' : 'Ver Completo'}</span>
                            </div>
                        </div>

                        {/* Loader si se está subiendo */}
                        {uploading && (
                            <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                                <Loader2 className="size-7 animate-spin text-[var(--color-primary)]" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Subiendo...</span>
                            </div>
                        )}

                        {/* Badge de Estado */}
                        <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-sm z-10">
                            <CheckCircle2 className="size-3" />
                            <span className="text-[8px] font-black uppercase tracking-wider">Cargado</span>
                        </div>
                    </a>
                ) : (
                    /* Estado Vacío cuando no hay documento */
                    <div className="relative w-full aspect-square flex flex-col items-center justify-center bg-slate-50/70 border-b border-slate-100 select-none">
                        {uploading ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Loader2 className="size-7 animate-spin text-[var(--color-primary)]" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Subiendo...</span>
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
                    </div>
                )}

                {/* Textos y Acciones */}
                <div className="flex flex-col gap-2 p-3.5 bg-white">
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
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-wider active:scale-95 shadow-sm"
                                    title="Abrir en pestaña nueva"
                                >
                                    <ExternalLink className="size-3.5 text-[var(--color-primary)]" />
                                    <span>{isPDF ? 'Abrir PDF' : 'Ver Archivo'}</span>
                                </a>

                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
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

            {/* ================= POPUP MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ================= */}
            {showDeleteModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
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


