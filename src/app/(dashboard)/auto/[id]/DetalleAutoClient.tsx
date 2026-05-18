'use client';

import { useState } from 'react';
import { 
    ArrowLeft, 
    Car, 
    FileText, 
    HandCoins, 
    Calendar,
    Gauge,
    Users,
    Activity,
    ShieldCheck,
    ChevronRight,
    MapPin,
    Edit2,
    Check,
    X,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { SelectionAction } from "./_components/SelectionAction";
import { AutoDetailCarousel } from "./_components/AutoDetailCarousel";
import { AutoDocumentManager } from "./_components/AutoDocumentManager";
import { AutoPhotoManager } from "./_components/AutoPhotoManager";
import { AutoTabs } from "./_components/AutoTabs";
import { ModuleHeader } from "@/presentation/components/molecules/ModuleHeader";
import { updateAutoAction } from "@/core/usecases/autoService";

export function DetalleAutoClient({ auto, vendingToClient, role }: { auto: any, vendingToClient?: string, role: string }) {
    const router = useRouter();
    const isManagerOrDirector = ['gerente', 'director'].includes(role);
    const isFrio = auto.estado_logico === 'frio';
    const [updating, setUpdating] = useState(false);

    // Parse Photos safely
    let photos: string[] = [];
    try {
        if (auto.fotos_url) {
            if (typeof auto.fotos_url === "string") {
                try {
                    const parsed = JSON.parse(auto.fotos_url);
                    photos = Array.isArray(parsed) ? parsed : (typeof parsed === 'string' ? [parsed] : []);
                } catch {
                    photos = [auto.fotos_url];
                }
            } else if (Array.isArray(auto.fotos_url)) {
                photos = auto.fotos_url;
            }
        }
    } catch (e) {
        console.error("Error parsing photos:", e);
    }

    const handleSaveField = async (field: string, value: string) => {
        setUpdating(true);
        try {
            const formData = new FormData();
            formData.append(field, value);
            // Re-enviar required fields that might be empty here but handled by updateAction (only changes what's provided)
            await updateAutoAction(auto.id, formData);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el campo");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="flex flex-col gap-10 bg-slate-50/50 min-h-screen pb-24">
            <div className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm w-fit mt-4 active:scale-95">
                    <ArrowLeft className="size-4" />
                    Volver al Inventario
                </Link>

                <ModuleHeader 
                    Icon={Car}
                    title={`${auto.marca} ${auto.modelo}`}
                    subtitle={`Stock ID: #${auto.id} · ${auto.anio}`}
                    // action removed as per requirements
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start px-6 lg:px-12">
                {/* Left Column: Media & Documents (Tabs) */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <AutoTabs 
                        photosContent={
                            <div className="flex flex-col gap-10">
                                <div className="bg-white rounded-[3rem] p-4 lg:p-6 border border-slate-200 shadow-sm">
                                    <AutoDetailCarousel photos={photos} alt={`${auto.marca} ${auto.modelo}`} />
                                </div>
                                {isManagerOrDirector && (
                                    <AutoPhotoManager autoId={auto.id} initialPhotos={photos} />
                                )}
                            </div>
                        }
                        docsContent={
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-1 px-2">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                                        <div className="size-2 rounded-full bg-indigo-500" />
                                        Expediente Digital
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Documentación legal y técnica de la unidad</p>
                                </div>
                                
                                <AutoDocumentManager 
                                    autoId={auto.id} 
                                    role={role}
                                    initialData={{
                                        url_factura: auto.url_factura || null,
                                        url_tarjeta_circulacion: auto.url_tarjeta_circulacion || null,
                                        url_poliza_seguro: auto.url_poliza_seguro || null,
                                        url_ine_propietario: auto.url_ine_propietario || null,
                                        url_contrato_compraventa: auto.url_contrato_compraventa || null,
                                    }} 
                                />
                            </div>
                        }
                    />
                </div>

                {/* Right Column: Key Details & Actions */}
                <div className="lg:col-span-4 flex flex-col gap-8 sticky top-24">
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col gap-10 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <Car className="size-48" />
                        </div>

                        <div className="flex flex-col gap-2 relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${isFrio ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {isFrio ? 'Módulo Avalúo' : 'Stock Disponible'}
                                </span>
                                <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <ShieldCheck className="size-5 text-slate-300" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-10 gap-x-6 relative z-10">
                            <EditableInfoBox label="Marca" field="marca" value={auto.marca} Icon={Activity} isEditable={isManagerOrDirector} onSave={handleSaveField} updating={updating} />
                            <EditableInfoBox label="Modelo" field="modelo" value={auto.modelo} Icon={ChevronRight} isEditable={isManagerOrDirector} onSave={handleSaveField} updating={updating} />
                            <EditableInfoBox label="Año" field="anio" value={auto.anio.toString()} Icon={Calendar} isEditable={isManagerOrDirector} type="select_anio" onSave={handleSaveField} updating={updating} />
                            <EditableInfoBox label="Carrocería" field="tipo" value={auto.tipo} Icon={Car} isEditable={isManagerOrDirector} type="select_tipo" onSave={handleSaveField} updating={updating} />
                            <EditableInfoBox label="Versión" field="version" value={auto.version || "Estándar"} Icon={ShieldCheck} isEditable={isManagerOrDirector} onSave={handleSaveField} updating={updating} />
                            <EditableInfoBox label="Kilometraje" field="kilometraje" value={auto.kilometraje?.toString() || "0"} Icon={Gauge} isEditable={isManagerOrDirector} type="number" onSave={handleSaveField} updating={updating} />
                            <EditableInfoBox label="Nº Dueños" field="numero_duenos" value={auto.numero_duenos?.toString() || "1"} Icon={Users} isEditable={isManagerOrDirector} type="number" onSave={handleSaveField} updating={updating} />
                        </div>

                        {auto.apartados_count && auto.apartados_count > 0 ? (
                            <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4 animate-in slide-in-from-right-4 duration-500">
                                <div className="size-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                                    <HandCoins className="size-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Comprometido</span>
                                    <span className="text-xs font-bold text-amber-800">{auto.apartados_count} Seguimientos Activos</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[1px] bg-slate-100 my-2" />
                        )}

                        {vendingToClient ? (
                            <div className="pt-4">
                                <SelectionAction autoId={auto.id} clientId={parseInt(vendingToClient, 10)} />
                            </div>
                        ) : (
                            <div className="pt-4 flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                    <Activity className="size-5 text-indigo-500" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Referencia para venta directa</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] flex flex-col gap-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Gauge className="size-6 text-indigo-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus de Control</span>
                                <h4 className="text-slate-900 font-extrabold text-lg tracking-tight">Registro de Stock</h4>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-xs text-slate-500 font-bold uppercase">Estado Actual:</span>
                            <span className={`text-xs font-black uppercase tracking-widest ${isFrio ? 'text-blue-600' : 'text-emerald-600'}`}>
                                {auto.estado_logico}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditableInfoBox({ label, field, value, Icon, isEditable, onSave, type = "text", updating }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSave = () => {
        setIsEditing(false);
        if (currentValue !== value) {
            onSave(field, currentValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setCurrentValue(value);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 group/info relative">
            <div className="flex items-center gap-2">
                <Icon className="size-3.5 text-slate-300 group-hover/info:text-indigo-500 transition-colors" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</span>
                {isEditable && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover/info:opacity-100 transition-opacity ml-auto text-slate-400 hover:text-indigo-500" disabled={updating}>
                        <Edit2 className="size-3" />
                    </button>
                )}
            </div>
            
            {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                    {type === 'select_anio' ? (
                        <select 
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onBlur={handleSave}
                            autoFocus
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-indigo-500"
                        >
                            {Array.from({ length: 30 }, (_, i) => 2026 - i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    ) : type === 'select_tipo' ? (
                        <select 
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onBlur={handleSave}
                            autoFocus
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="sedan">Sedán</option>
                            <option value="suv">SUV</option>
                            <option value="hatchback">Hatchback</option>
                            <option value="camion">Camión/Pickup</option>
                            <option value="otro">Otro</option>
                        </select>
                    ) : (
                        <input 
                            type={type === 'number' ? 'number' : 'text'}
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight pl-5 truncate">
                        {type === 'number' && field === 'kilometraje' ? `${Number(value).toLocaleString()} km` : value}
                    </span>
                    {updating && currentValue !== value && <Loader2 className="size-3 animate-spin text-slate-400" />}
                </div>
            )}
        </div>
    );
}
