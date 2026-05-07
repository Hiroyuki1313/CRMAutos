'use client';

import { useState, useTransition, useEffect } from "react";
import { X, User, Phone, FileText, UploadCloud, CheckCircle2, Loader2, Download, Trash2, Calendar, Globe } from "lucide-react";
import { updateApartadoFieldAction, uploadApartadoDocumentAction, deleteApartadoDocumentAction } from "@/app/(dashboard)/apartados/actions";
import { Apartado } from "@/core/domain/entities/Apartado";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    apartado: Apartado;
}

export function ProspectoDetailModal({ isOpen, onClose, apartado: initialApartado }: Props) {
    const [isPending, startTransition] = useTransition();
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [apartado, setApartado] = useState<Apartado>(initialApartado);

    // Sincronizar estado local si el prop cambia (ej: al abrir otro prospecto)
    useEffect(() => {
        setApartado(initialApartado);
    }, [initialApartado]);

    if (!isOpen) return null;

    const handleUpload = async (field: string, file: File) => {
        setUploadingField(field);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id_venta', apartado.id_venta.toString());
        formData.append('field', field);

        startTransition(async () => {
            try {
                const res = await uploadApartadoDocumentAction(formData);
                if (res.success && res.url) {
                    // Actualizar estado local para feedback inmediato
                    setApartado(prev => ({ ...prev, [field]: res.url }));
                    console.log('Upload successful:', res.url);
                } else if (res.error) {
                    alert(res.error);
                }
            } catch (err: any) {
                console.error('Upload Error:', err);
                alert(`Error crítico de subida: ${err.message || 'Error desconocido'}`);
            } finally {
                setUploadingField(null);
            }
        });
    };

    const handleDelete = async (field: string) => {
        if (!confirm('¿Eliminar este documento?')) return;
        try {
            const res = await deleteApartadoDocumentAction(apartado.id_venta, field);
            if (res.success) {
                // Actualizar estado local para feedback inmediato
                setApartado(prev => ({ ...prev, [field]: null }));
            } else if (res.error) {
                alert(res.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const DOCS = [
        { field: 'ine_url', label: 'Identificación Oficial (INE)', icon: <User className="size-5" /> },
        { field: 'comprobante_domicilio_url', label: 'Comprobante de Domicilio', icon: <FileText className="size-5" /> },
        { field: 'estados_cuenta_url', label: 'Estados de Cuenta', icon: <Download className="size-5" /> },
        { field: 'licencia_contrato_url', label: 'Licencia / Contrato', icon: <FileText className="size-5" /> },
        { field: 'seguro_url', label: 'Póliza de Seguro', icon: <CheckCircle2 className="size-5" /> },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500 max-h-[90vh]">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center border border-indigo-700 shadow-lg shadow-indigo-200">
                            <User className="size-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Ficha del Prospecto</h2>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gestión de Expediente</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center transition-all">
                        <X className="size-5 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Info Básica */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Información de Contacto</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                        <User className="size-4 text-slate-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</span>
                                        <span className="text-sm font-bold text-slate-900">{apartado.nombre_prospecto || (apartado as any).cliente?.nombre || 'S/N'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                        <Phone className="size-4 text-slate-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Teléfono</span>
                                        <span className="text-sm font-bold text-slate-900">{apartado.telefono_prospecto || (apartado as any).cliente?.telefono || 'S/N'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                        <Globe className="size-4 text-slate-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Origen</span>
                                        <span className="text-sm font-bold text-slate-900 uppercase">{apartado.origen_prospecto || (apartado as any).cliente?.origen || 'prospectos de piso'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Registro */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Detalles de Registro</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                        <Calendar className="size-4 text-slate-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha de Captura</span>
                                        <span className="text-sm font-bold text-slate-900">
                                            {apartado.fecha_registro_prospecto ? new Date(apartado.fecha_registro_prospecto).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No disponible'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="size-4 text-slate-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID Seguimiento</span>
                                        <span className="text-sm font-bold text-slate-900">#{apartado.id_venta}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expediente Digital */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Expediente Digital (Documentos)</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {DOCS.map((doc) => {
                                const currentUrl = (apartado as any)[doc.field];
                                const isUploading = uploadingField === doc.field;

                                return (
                                    <div key={doc.field} className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-indigo-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-12 rounded-xl flex items-center justify-center transition-all ${currentUrl ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                                {doc.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{doc.label}</span>
                                                <span className="text-[9px] font-bold text-slate-400">
                                                    {currentUrl ? 'Documento cargado correctamente' : 'Pendiente de carga'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {currentUrl ? (
                                                <>
                                                    <a 
                                                        href={currentUrl} 
                                                        target="_blank" 
                                                        className="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                                                        title="Ver documento"
                                                    >
                                                        <Download className="size-4" />
                                                    </a>
                                                    <button 
                                                        onClick={() => handleDelete(doc.field)}
                                                        className="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <label className="cursor-pointer size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                                                    {isUploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*,application/pdf"
                                                        className="hidden" 
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleUpload(doc.field, file);
                                                                e.target.value = ''; // Reset para permitir re-selección
                                                            }
                                                        }}
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm"
                    >
                        Cerrar Ficha
                    </button>
                </div>
            </div>
        </div>
    );
}
