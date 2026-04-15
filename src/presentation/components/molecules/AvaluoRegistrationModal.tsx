'use client';

import { X, DollarSign } from 'lucide-react';
import AvaluoCreationForm from '../organisms/AvaluoCreationForm';

interface AvaluoRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    id_venta: number;
    id_cliente?: number;
    id_vendedor?: number;
    clientName: string;
}

export default function AvaluoRegistrationModal({ 
    isOpen, 
    onClose, 
    id_venta, 
    id_cliente, 
    id_vendedor,
    clientName 
}: AvaluoRegistrationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />
            
            <div className="relative bg-slate-50 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl border border-white animate-in zoom-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md p-8 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <DollarSign className="size-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-black text-slate-900 leading-none">Nuevo Avalúo</h2>
                            <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Cliente: {clientName}</span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10">
                    <AvaluoCreationForm 
                        vendedorId={id_vendedor}
                        clientId={id_cliente}
                        ventaId={id_venta}
                        onSuccess={() => {
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
