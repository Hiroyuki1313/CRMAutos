'use client';

import { useState } from 'react';
import { 
    FileText, 
    Upload, 
    Trash2, 
    CheckCircle2, 
    Loader2, 
    User, 
    Info, 
    CreditCard, 
    FileCheck, 
    ShieldCheck,
    Eye
} from 'lucide-react';
import { Cliente } from '@/core/domain/entities/Cliente';
import { uploadClientDocumentAction, deleteClientDocumentAction } from '../documentActions';

import Image from 'next/image';

interface Props {
    cliente: Cliente;
}

export function DocumentManager({ cliente }: Props) {
    const documents = [
        { id: 'ine_url', label: 'Identificación (INE)', icon: <User className="size-5" /> },
        { id: 'comprobante_domicilio_url', label: 'Comprobante Domicilio', icon: <Info className="size-5" /> },
        { id: 'estados_cuenta_url', label: 'Estados de Cuenta', icon: <CreditCard className="size-5" /> },
        { id: 'licencia_contrato_url', label: 'Licencia / Contrato', icon: <FileCheck className="size-5" /> },
        { id: 'seguro_url', label: 'Póliza de Seguro', icon: <ShieldCheck className="size-5" /> },
    ];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h3 className="font-black uppercase text-xs leading-4 tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                    <ShieldCheck className="size-4" /> Expediente Digital Autenticado
                </h3>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest pl-7">Control de documentación para procesos administrativos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                    <DocumentCard 
                        key={doc.id} 
                        clienteId={cliente.id}
                        field={doc.id} 
                        label={doc.label} 
                        url={(cliente as any)[doc.id]} 
                        icon={doc.icon} 
                    />
                ))}
            </div>
            
            <div className="mt-4 p-8 rounded-[2rem] bg-zinc-900/20 border border-dashed border-white/5 flex items-center justify-center text-center">
                <div className="flex flex-col gap-2 max-w-sm">
                    <p className="text-[10px] font-black uppercase text-zinc-700 tracking-widest leading-loose">
                        Los archivos se almacenan de forma organizada en el servidor de Hostinger asociados directamente al ID de este cliente.
                    </p>
                </div>
            </div>
        </div>
    );
}

function DocumentCard({ clienteId, field, label, url, icon }: { clienteId: number, field: string, label: string, url?: string, icon: React.ReactNode }) {
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
            await uploadClientDocumentAction(clienteId, field, formData);
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
            await deleteClientDocumentAction(clienteId, field);
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`group relative flex flex-col gap-5 p-6 rounded-[2.5rem] border transition-all duration-500 ${url ? 'bg-zinc-900/60 border-emerald-500/10 hover:border-emerald-500/30' : 'bg-zinc-950 border-white/5 hover:border-white/10'}`}>
            <div className="flex items-center gap-5">
                {/* Visual Area (Icon or Preview) */}
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

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-2">
                    <p className="text-white font-extrabold text-[13px] uppercase tracking-normal leading-tight mb-2 break-words">
                        {label}
                    </p>
                    <div className="flex items-center gap-2">
                        {url ? (
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                    <CheckCircle2 className="size-3" /> Validado
                                </span>
                            </div>
                        ) : (
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest opacity-60">Requerido</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5">
                    {url ? (
                        <>
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="size-11 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all border border-white/5 shadow-lg shadow-black/20"
                                title="Ver en grande"
                            >
                                <Eye className="size-5" />
                            </a>
                            <button 
                                onClick={handleDelete}
                                className="size-11 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                                title="Borrar"
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

            {/* Path Breadcrumb */}
            {url && (
                <div className="flex items-center gap-2 px-2">
                    <div className="flex-1 h-[1px] bg-white/5" />
                    <span className="text-[8px] font-mono text-zinc-600 truncate opacity-30 max-w-[150px]">
                        {url.split('/').pop()}
                    </span>
                </div>
            )}
        </div>
    );
}
