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
    Loader2,
    AlertTriangle
} from "lucide-react";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { SelectionAction } from "./_components/SelectionAction";
import { AutoDetailCarousel } from "./_components/AutoDetailCarousel";
import { AutoDocumentManager } from "./_components/AutoDocumentManager";
import { AutoPhotoManager } from "./_components/AutoPhotoManager";
import { AutoTabs } from "./_components/AutoTabs";
import { AutoCostsTab } from "./_components/AutoCostsTab";
import { ModuleHeader } from "@/presentation/components/molecules/ModuleHeader";
import { updateAutoAction } from "@/core/usecases/autoService";

export function DetalleAutoClient({ auto, vendingToClient, role }: { auto: any, vendingToClient?: string, role: string }) {
    const router = useRouter();
    const isManagerOrDirector = ['gerente', 'director'].includes(role);
    const isFrio = auto.estado_logico === 'frio';
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState<'photos' | 'docs' | 'costs'>('photos');

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

    const diasEnInventario = auto.fecha_registro_inventario 
        ? Math.floor((Date.now() - new Date(auto.fecha_registro_inventario).getTime()) / (1000 * 60 * 60 * 24)) 
        : (auto.fecha_creacion ? Math.floor((Date.now() - new Date(auto.fecha_creacion).getTime()) / (1000 * 60 * 60 * 24)) : 0);

    return (
        <div className="flex flex-col gap-4 bg-slate-50/50 min-h-screen pb-10 max-w-[1650px] mx-auto w-full">
            <div className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm w-fit mt-2 mx-4 lg:mx-8 active:scale-95">
                    <ArrowLeft className="size-4" />
                    Volver al Inventario
                </Link>

                <ModuleHeader
                    Icon={Car}
                    title={`${auto.marca} ${auto.modelo}`}
                    subtitle={`Stock ID: #${auto.id} · ${auto.anio}`}
                />
            </div>

            {diasEnInventario >= 90 && (
                <div className="mx-4 lg:mx-8 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 shadow-sm">
                    <div className="size-8 rounded-lg bg-red-600 text-white flex items-center justify-center animate-pulse shrink-0">
                        <AlertTriangle className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Alerta de Permanencia</span>
                        <span className="text-xs font-bold">{diasEnInventario} días en inventario</span>
                    </div>
                </div>
            )}

            <div className="px-4 lg:px-8">
                <AutoTabs
                    onTabChange={(t) => setActiveTab(t)}
                    photosContent={
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Columna Izquierda (Escritorio): Carrusel principal e Info Técnica */}
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                {/* Carousel de vehículo */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                                    <AutoDetailCarousel photos={photos} alt={`${auto.marca} ${auto.modelo}`} />
                                </div>
                            </div>

                            {/* Columna Derecha (Escritorio): Ficha Técnica y Acciones de Venta / Fotos */}
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                {/* Info compacta del Auto */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    {/* Status row */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                            isFrio ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            {isFrio ? 'Módulo Avalúo' : 'Stock Disponible'}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                                            isFrio ? 'text-blue-500' : 'text-emerald-500'
                                        }`}>
                                            {auto.estado_logico}
                                        </span>
                                    </div>

                                    {/* Info grid compact */}
                                    <div className="grid grid-cols-3 gap-px bg-slate-100">
                                        <EditableInfoBox label="Marca" field="marca" value={auto.marca} Icon={Activity} isEditable={isManagerOrDirector} onSave={handleSaveField} updating={updating} compact />
                                        <EditableInfoBox label="Modelo" field="modelo" value={auto.modelo} Icon={ChevronRight} isEditable={isManagerOrDirector} onSave={handleSaveField} updating={updating} compact />
                                        <EditableInfoBox label="Año" field="anio" value={auto.anio.toString()} Icon={Calendar} isEditable={isManagerOrDirector} type="select_anio" onSave={handleSaveField} updating={updating} compact />
                                        <EditableInfoBox label="Tipo" field="tipo" value={auto.tipo} Icon={Car} isEditable={isManagerOrDirector} type="select_tipo" onSave={handleSaveField} updating={updating} compact />
                                        <EditableInfoBox label="Km" field="kilometraje" value={auto.kilometraje?.toString() || "0"} Icon={Gauge} isEditable={isManagerOrDirector} type="number" onSave={handleSaveField} updating={updating} compact />
                                        <EditableInfoBox label="Dueños" field="numero_duenos" value={auto.numero_duenos?.toString() || "1"} Icon={Users} isEditable={isManagerOrDirector} type="number" onSave={handleSaveField} updating={updating} compact />
                                        <EditableInfoBox label="Color" field="color" value={auto.color || "N/D"} Icon={Activity} isEditable={isManagerOrDirector} onSave={handleSaveField} updating={updating} compact />
                                        <EditableInfoBox label="VIN" field="vin" value={auto.vin || "N/D"} Icon={ShieldCheck} isEditable={isManagerOrDirector} onSave={handleSaveField} updating={updating} compact />
                                        <EditableInfoBox label="Placas" field="placas" value={auto.placas || "N/D"} Icon={MapPin} isEditable={isManagerOrDirector} onSave={handleSaveField} updating={updating} compact />
                                    </div>

                                    {/* Footer: apartados + action */}
                                    {auto.apartados_count && auto.apartados_count > 0 ? (
                                        <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100 flex items-center gap-3">
                                            <HandCoins className="size-4 text-amber-500 shrink-0" />
                                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{auto.apartados_count} seguimientos activos</span>
                                        </div>
                                    ) : null}

                                    {vendingToClient && (
                                        <div className="p-3 border-t border-slate-100">
                                            <SelectionAction autoId={auto.id} clientId={parseInt(vendingToClient, 10)} />
                                        </div>
                                    )}
                                </div>

                                {/* Manager para subir/eliminar fotos */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                    <AutoPhotoManager autoId={auto.id} initialPhotos={photos} />
                                </div>
                            </div>
                        </div>
                    }
                    docsContent={
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
                    }
                    costsContent={
                        <AutoCostsTab auto={auto} role={role} />
                    }
                />
            </div>
        </div>
    );
}

function EditableInfoBox({ label, field, value, Icon, isEditable, onSave, type = "text", updating, compact = false }: any) {
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

    const displayValue = type === 'number' && field === 'kilometraje'
        ? `${Number(value).toLocaleString()} km`
        : value;

    if (compact) {
        return (
            <div
                className="bg-white p-2.5 flex flex-col gap-0.5 cursor-default"
                onClick={() => isEditable && !isEditing && setIsEditing(true)}
            >
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                {isEditing ? (
                    <div onClick={e => e.stopPropagation()}>
                        {type === 'select_anio' ? (
                            <select
                                value={currentValue}
                                onChange={(e) => setCurrentValue(e.target.value)}
                                onBlur={handleSave}
                                autoFocus
                                className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[11px] font-extrabold text-slate-900 focus:outline-none focus:border-indigo-500"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[11px] font-extrabold text-slate-900 focus:outline-none focus:border-indigo-500"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[11px] font-extrabold text-slate-900 focus:outline-none focus:border-indigo-500"
                            />
                        )}
                    </div>
                ) : (
                    <span className="text-[11px] font-extrabold text-slate-800 truncate">
                        {displayValue}
                        {isEditable && <Edit2 className="inline size-2.5 ml-1 text-slate-300" />}
                    </span>
                )}
                {updating && currentValue !== value && <Loader2 className="size-2.5 animate-spin text-slate-400" />}
            </div>
        );
    }

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
                        {displayValue}
                    </span>
                    {updating && currentValue !== value && <Loader2 className="size-3 animate-spin text-slate-400" />}
                </div>
            )}
        </div>
    );
}
