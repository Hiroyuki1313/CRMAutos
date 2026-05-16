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
import { DocumentCard } from '@/presentation/components/molecules/DocumentCard';
import { Cliente } from '@/core/domain/entities/Cliente';
import { uploadClientDocumentAction, deleteClientDocumentAction } from '../documentActions';

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
                <h3 className="font-black uppercase text-xs leading-4 tracking-[0.2em] text-slate-400 flex items-center gap-3">
                    <ShieldCheck className="size-4" /> Expediente Digital Autenticado
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pl-7">Control de documentación para procesos administrativos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                    <DocumentCard 
                        key={doc.id} 
                        id={cliente.id}
                        field={doc.id} 
                        label={doc.label} 
                        url={(cliente as any)[doc.id]} 
                        icon={doc.icon}
                        onUpload={uploadClientDocumentAction}
                        onDelete={deleteClientDocumentAction}
                    />
                ))}
            </div>
            
            <div className="mt-4 p-8 rounded-[2rem] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-center shadow-sm">
                <div className="flex flex-col gap-2 max-w-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-loose">
                        Los archivos se almacenan de forma organizada en el servidor de Hostinger asociados directamente al ID de este registro.
                    </p>
                </div>
            </div>
        </div>
    );
}

