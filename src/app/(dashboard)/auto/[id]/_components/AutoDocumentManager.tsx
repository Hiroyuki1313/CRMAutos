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
import { DocumentCard } from '@/presentation/components/molecules/DocumentCard';
import { uploadAutoDocumentAction, deleteAutoDocumentAction } from '../documentActions';

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
    role?: string;
}

export function AutoDocumentManager({ autoId, initialData, role }: Props) {
    const isManagerOrDirector = ['gerente', 'director'].includes(role || '');
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VEHICLE_DOCS.map((doc) => (
                <DocumentCard 
                    key={doc.id} 
                    id={autoId}
                    field={doc.id} 
                    label={doc.label} 
                    url={initialData[doc.id] || undefined} 
                    onUpload={uploadAutoDocumentAction}
                    onDelete={deleteAutoDocumentAction}
                    readOnly={!isManagerOrDirector}
                />
            ))}
        </div>
    );
}

