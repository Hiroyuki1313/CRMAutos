'use client';

import { useState } from 'react';
import { 
    FileText, 
    Upload, 
    Trash2, 
    Eye, 
    Loader2, 
    CheckCircle2, 
    AlertCircle 
} from 'lucide-react';
import Image from 'next/image';
import { uploadAutoDocumentAction, deleteAutoDocumentAction } from '../documentActions';
import { optimizeImage } from '@/presentation/utils/imageUtils';

interface DocField {
    id: string;
    label: string;
    description: string;
}

const VEHICLE_DOCS: DocField[] = [
    { id: 'url_factura', label: 'Factura / IVA', description: 'Documento de propiedad u origen' },
    { id: 'url_tarjeta_circulacion', label: 'Tarjeta de Circulación', description: 'Permiso de tránsito vigente' },
    { id: 'url_poliza_seguro', label: 'Póliza de Seguro', description: 'Seguro actual de la unidad' },
    { id: 'url_ine_propietario', label: 'INE Propietario', description: 'Identificación del dueño anterior' },
    { id: 'url_contrato_compraventa', label: 'Contrato Compra-Venta', description: 'Cierre de trato legal' },
];

interface Props {
    autoId: number;
    initialData: Record<string, string | null>;
}

export function AutoDocumentManager({ autoId, initialData }: Props) {
    const [docs, setDocs] = useState(initialData);
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    const handleUpload = async (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingField(field);
        
        try {
            let finalFile = file;
            if (file.type.startsWith('image/')) {
                finalFile = await optimizeImage(file);
            }

            const formData = new FormData();
            formData.append('file', finalFile);

            const res = await uploadAutoDocumentAction(autoId, field, formData);
            if (res.success && res.url) {
                setDocs(prev => ({ ...prev, [field]: res.url! }));
            } else {
                alert(res.error || 'Error al subir');
            }
        } catch (error) {
            console.error(error);
            alert('Error crítico en la subida');
        } finally {
            setUploadingField(null);
        }
    };

    const handleDelete = async (field: string, label: string) => {
        if (!confirm(`¿Estás seguro de eliminar el documento: ${label}?`)) return;

        setUploadingField(field);
        try {
            const res = await deleteAutoDocumentAction(autoId, field);
            if (res.success) {
                setDocs(prev => ({ ...prev, [field]: null }));
            } else {
                alert(res.error || 'Error al eliminar');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploadingField(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VEHICLE_DOCS.map((doc) => {
                const url = docs[doc.id];
                const isUploading = uploadingField === doc.id;
                const isImage = url && (url.endsWith('.webp') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'));

                return (
                    <div 
                        key={doc.id}
                        className={`group relative flex flex-col gap-5 p-6 rounded-[2.5rem] border transition-all duration-500 ${
                            url 
                            ? 'bg-emerald-50/30 border-emerald-500/10 hover:border-emerald-500/30' 
                            : 'bg-white border-slate-200 hover:border-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-slate-200/50'
                        }`}
                    >
                        <div className="flex items-center gap-5">
                            {/* Visual Indicator */}
                            <div className={`relative size-16 rounded-2xl flex items-center justify-center transition-all overflow-hidden shrink-0 border ${
                                url ? 'bg-white border-emerald-100' : 'bg-slate-50 border-slate-100 text-slate-300'
                            }`}>
                                {isImage ? (
                                    <Image src={url!} alt={doc.label} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" unoptimized={true} />
                                ) : url ? (
                                    <FileText className="size-7 text-red-500" />
                                ) : (
                                    <FileText className="size-7" />
                                )}
                                
                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="size-6 animate-spin text-[var(--color-primary)]" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-slate-900 font-extrabold text-[13px] uppercase tracking-normal leading-tight mb-1 truncate">
                                    {doc.label}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                    {url ? 'Digitalizado' : 'Pendiente'}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2.5">
                                {url ? (
                                    <>
                                        <a 
                                            href={url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="size-11 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all border border-slate-100 shadow-sm"
                                        >
                                            <Eye className="size-5" />
                                        </a>
                                        <button 
                                            onClick={() => handleDelete(doc.id, doc.label)}
                                            className="size-11 rounded-xl bg-white flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 transition-all border border-slate-100 shadow-sm"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="size-14 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[var(--color-primary)]/20">
                                        <Upload className="size-6" />
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={(e) => handleUpload(doc.id, e)}
                                            disabled={isUploading}
                                            accept="image/*,application/pdf"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                             {url ? (
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                    <CheckCircle2 className="size-3" /> Documento Validado
                                </span>
                             ) : (
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                    <AlertCircle className="size-3" /> Esperando Carga
                                </span>
                             )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
