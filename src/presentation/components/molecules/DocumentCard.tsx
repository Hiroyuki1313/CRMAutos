'use client';

import { useState } from "react";
import { FileText, Loader2, Eye, Trash2, Upload, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { optimizeImage } from "@/presentation/utils/imageUtils";

interface DocumentCardProps {
    id: number | string;
    field: string;
    label: string;
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
    url, 
    icon, 
    onUpload, 
    onDelete,
    accept = "image/*,application/pdf",
    readOnly = false
}: DocumentCardProps) {
    const [uploading, setUploading] = useState(false);

    const isImage = url && (url.endsWith('.webp') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'));
    const isPDF = url && url.endsWith('.pdf');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        
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
            await onDelete(id, field, url);
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`group relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
            url
              ? 'bg-white border-emerald-400/30 shadow-sm hover:shadow-md hover:border-emerald-400/60'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
        }`}>
            {/* Preview Area */}
            <div className={`relative w-full aspect-square flex items-center justify-center overflow-hidden ${
                url ? 'bg-slate-50' : 'bg-slate-50'
            }`}>
                {isImage ? (
                    <Image src={url!} alt={label} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                ) : isPDF ? (
                    <div className="flex flex-col items-center gap-1.5">
                        <FileText className="size-10 text-red-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-400/70">PDF</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <FileText className={`size-10 ${url ? 'text-emerald-400' : 'text-slate-300'}`} />
                    </div>
                )}

                {/* Uploading overlay */}
                {uploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="size-6 animate-spin text-[var(--color-primary)]" />
                    </div>
                )}

                {/* Status badge top-right */}
                {url && (
                    <div className="absolute top-2 right-2 bg-emerald-500 rounded-lg px-2 py-0.5 flex items-center gap-1">
                        <CheckCircle2 className="size-2.5 text-white" />
                        <span className="text-[7px] font-black text-white uppercase tracking-wide">OK</span>
                    </div>
                )}
            </div>

            {/* Label + Actions */}
            <div className="flex flex-col gap-2 p-3">
                <p className="text-slate-800 font-extrabold text-[10px] uppercase tracking-wide leading-tight text-center">
                    {label}
                </p>

                <div className="flex items-center justify-center gap-2">
                    {url ? (
                        <>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all text-[9px] font-black uppercase tracking-wide"
                                title="Ver"
                            >
                                <Eye className="size-3" /> Ver
                            </a>
                            {!readOnly && (
                                <button
                                    onClick={handleDelete}
                                    className="size-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-200 shrink-0"
                                    title="Borrar"
                                >
                                    {uploading ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                                </button>
                            )}
                        </>
                    ) : (
                        !readOnly ? (
                            <label className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-dark)] text-[9px] font-black uppercase tracking-wide cursor-pointer hover:opacity-90 active:scale-95 transition-all">
                                {uploading ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
                                Subir
                                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept={accept} />
                            </label>
                        ) : (
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Pendiente</span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
