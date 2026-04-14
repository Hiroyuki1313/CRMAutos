'use client';

import { useState, useTransition, Fragment } from "react";
import { 
    Search, 
    Plus, 
    Car, 
    ChevronDown, 
    ChevronUp, 
    Eye, 
    EyeOff, 
    Loader2, 
    Check, 
    DollarSign,
    Calendar,
    FileText,
    Image as ImageIcon,
    UserCircle,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { updateAvaluoFieldAction } from "@/app/(dashboard)/avaluos/actions";

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface Props {
    data: any[];
    vendedores: { id: number, nombre: string }[];
    isDirector: boolean;
}

export default function AvaluosTable({ data, vendedores, isDirector }: Props) {
    const [columns, setColumns] = useState<Column[]>([
        { id: 'id', label: 'ID', visible: true },
        { id: 'fecha', label: 'Fecha', visible: true },
        { id: 'vehiculo', label: 'Vehículo', visible: true },
        { id: 'estatus', label: 'Estatus', visible: true },
        { id: 'oferta', label: 'Oferta', visible: true },
        { id: 'venta', label: 'Venta Est.', visible: true },
        { id: 'margen', label: 'Margen', visible: true },
        { id: 'vendedor', label: 'Asesor', visible: true },
        { id: 'docs', label: 'Dossier', visible: true },
    ]);

    const [showColumnPicker, setShowColumnPicker] = useState(false);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleColumn = (id: string) => {
        setColumns(cols => cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
    };

    const toggleRow = (id: number) => {
        setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const statusOptions = [
        { value: 'frio', label: 'Frío', color: 'text-blue-500 bg-blue-50' },
        { value: 'medio', label: 'Medio', color: 'text-amber-500 bg-amber-50' },
        { value: 'alto', label: 'Alto', color: 'text-orange-500 bg-orange-50' },
        { value: 'toma', label: 'Toma', color: 'text-emerald-500 bg-emerald-50' },
        { value: 'rechazo', label: 'Rechazo', color: 'text-red-500 bg-red-50' },
    ];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-6">
                    <div className="size-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20">
                        <Car className="size-6 text-[var(--color-primary)]" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Gestor de Avalúos</h2>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{data.length} Unidades en proceso</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button 
                            onClick={() => setShowColumnPicker(!showColumnPicker)}
                            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 shadow-sm text-slate-600"
                        >
                            <Eye className="size-4" />
                            <span>Visión</span>
                        </button>
                        {showColumnPicker && (
                            <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl z-50 grid grid-cols-1 gap-2 animate-in zoom-in-95">
                                 <div className="flex justify-between items-center mb-2 px-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400">Columnas</span>
                                    <button onClick={() => setShowColumnPicker(false)} className="text-[8px] font-bold text-slate-400 hover:text-slate-900">Cerrar</button>
                                 </div>
                                 {columns.map(col => (
                                    <button 
                                        key={col.id} 
                                        onClick={() => toggleColumn(col.id)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${col.visible ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {col.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                                        {col.label}
                                    </button>
                                 ))}
                            </div>
                        )}
                    </div>
                    {isDirector && (
                        <Link 
                            href="/avaluos/nuevo"
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
                        >
                            <Plus className="size-4" />
                            <span>Nuevo Avalúo</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="p-5 w-10"></th>
                                {columns.filter(c => c.visible).map(col => (
                                    <th key={col.id} className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-left whitespace-nowrap">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((avaluo) => {
                                const margen = (avaluo.venta || 0) - (avaluo.oferta || 0);
                                const photos = typeof avaluo.fotos_url === 'string' ? JSON.parse(avaluo.fotos_url || '[]') : (avaluo.fotos_url || []);
                                const cover = photos.length > 0 ? photos[0] : null;

                                return (
                                    <Fragment key={avaluo.id}>
                                        <tr key={avaluo.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="p-5">
                                                <button 
                                                    onClick={() => toggleRow(avaluo.id)}
                                                    className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all"
                                                >
                                                    {expandedRows.includes(avaluo.id) ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                                </button>
                                            </td>
                                            {columns.find(c => c.id === 'id')?.visible && (
                                                <td className="p-5 text-[10px] font-bold text-slate-400">#{avaluo.id}</td>
                                            )}
                                            {columns.find(c => c.id === 'fecha')?.visible && (
                                                <td className="p-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-slate-900">
                                                            {avaluo.fecha_registro ? new Date(avaluo.fecha_registro).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase">Registrado</span>
                                                    </div>
                                                </td>
                                            )}
                                            {columns.find(c => c.id === 'vehiculo')?.visible && (
                                                <td className="p-5 min-w-[200px]">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden relative shadow-sm shrink-0">
                                                            {cover ? (
                                                                <Image src={cover} alt="Auto" fill className="object-cover" unoptimized />
                                                            ) : (
                                                                <Car className="size-6 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-slate-900 leading-none">{avaluo.modelo}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{avaluo.marca} · {avaluo.anio}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            {columns.find(c => c.id === 'estatus')?.visible && (
                                                <td className="p-5">
                                                    <EditableSelect 
                                                        id={avaluo.id}
                                                        field="sub_estado_avaluo"
                                                        initialValue={avaluo.sub_estado_avaluo}
                                                        options={statusOptions}
                                                    />
                                                </td>
                                            )}
                                            {columns.find(c => c.id === 'oferta')?.visible && (
                                                <td className="p-5">
                                                    <EditableNumber 
                                                        id={avaluo.id}
                                                        field="oferta"
                                                        initialValue={avaluo.oferta}
                                                        prefix="$"
                                                    />
                                                </td>
                                            )}
                                            {columns.find(c => c.id === 'venta')?.visible && (
                                                <td className="p-5">
                                                    <EditableNumber 
                                                        id={avaluo.id}
                                                        field="venta"
                                                        initialValue={avaluo.venta}
                                                        prefix="$"
                                                        color="text-emerald-600"
                                                    />
                                                </td>
                                            )}
                                            {columns.find(c => c.id === 'margen')?.visible && (
                                                <td className="p-5">
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-black ${margen >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            {formatCurrency(margen)}
                                                        </span>
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase">Estimado</span>
                                                    </div>
                                                </td>
                                            )}
                                            {columns.find(c => c.id === 'vendedor')?.visible && (
                                                <td className="p-5 min-w-[140px]">
                                                    <select 
                                                        disabled={!isDirector}
                                                        defaultValue={avaluo.id_vendedor}
                                                        onChange={(e) => updateAvaluoFieldAction(avaluo.id, 'id_vendedor', parseInt(e.target.value))}
                                                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] font-bold text-slate-900 w-full outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all disabled:opacity-50"
                                                    >
                                                        {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                                                    </select>
                                                </td>
                                            )}
                                            {columns.find(c => c.id === 'docs')?.visible && (
                                                <td className="p-5">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => toggleRow(avaluo.id)}
                                                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-200 transition-all flex items-center gap-2"
                                                        >
                                                            <FileText className="size-3.5" />
                                                            Dossier
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                        {expandedRows.includes(avaluo.id) && (
                                            <tr className="bg-slate-50/30">
                                                <td colSpan={columns.filter(c => c.visible).length + 1} className="p-8">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-4 duration-500">
                                                        {/* Multimedia */}
                                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <ImageIcon className="size-4 text-[var(--color-primary)]" />
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Multimedia</h4>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {photos.map((p: string, i: number) => (
                                                                    <a key={i} href={p} target="_blank" className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 hover:scale-105 transition-transform">
                                                                        <Image src={p} alt="Foto" fill className="object-cover" unoptimized />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Documentos */}
                                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="size-4 text-[var(--color-primary)]" />
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Dossier Legal</h4>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                {[
                                                                    { label: 'Factura', url: avaluo.url_factura },
                                                                    { label: 'Tarjeta Circulación', url: avaluo.url_tarjeta_circulacion },
                                                                    { label: 'Póliza Seguro', url: avaluo.url_poliza_seguro },
                                                                    { label: 'INE Propietario', url: avaluo.url_ine_propietario },
                                                                    { label: 'Contrato C/V', url: avaluo.url_contrato_compraventa },
                                                                    { label: 'Hoja de Avalúo', url: avaluo.hoja_avaluo_url }
                                                                ].map((doc, i) => doc.url ? (
                                                                    <a key={i} href={doc.url} target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all">
                                                                        <span className="text-[10px] font-bold text-slate-600 uppercase">{doc.label}</span>
                                                                        <Check className="size-3.5 text-emerald-500" />
                                                                    </a>
                                                                ) : (
                                                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 opacity-50">
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.label}</span>
                                                                        <span className="text-[9px] font-black text-slate-300">PDTE</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Historial */}
                                                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <TrendingUp className="size-4 text-[var(--color-primary)]" />
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Historial</h4>
                                                            </div>
                                                            <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto no-scrollbar">
                                                                {(() => {
                                                                    try {
                                                                        const history = typeof avaluo.comentarios_historial === 'string' ? JSON.parse(avaluo.comentarios_historial) : (avaluo.comentarios_historial || []);
                                                                        return history.map((h: any, i: number) => (
                                                                            <div key={i} className="flex flex-col gap-1 border-l-2 border-slate-100 pl-4 py-1">
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-tighter">{h.usuario}</span>
                                                                                    <span className="text-[8px] font-bold text-slate-400">{new Date(h.fecha).toLocaleString()}</span>
                                                                                </div>
                                                                                <p className="text-[11px] text-slate-500 leading-tight italic">"{h.comentario}"</p>
                                                                            </div>
                                                                        ));
                                                                    } catch { return <span className="text-[10px] text-slate-400">Sin historial</span>; }
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function EditableNumber({ id, field, initialValue, prefix, color = "text-slate-900" }: { id: number, field: string, initialValue: number, prefix: string, color?: string }) {
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handleBlur = () => {
        if (parseFloat(value.toString()) === initialValue) return;
        startTransition(async () => {
            const res = await updateAvaluoFieldAction(id, field, parseFloat(value.toString()));
            if (res.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        });
    };

    return (
        <div className="relative group/edit flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400">{prefix}</span>
            <input 
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                className={`w-28 bg-transparent border-none outline-none text-xs font-black ${color} focus:bg-slate-50 p-1.5 rounded-lg transition-all tabular-nums group-hover/edit:bg-slate-50`}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
                {isPending && <Loader2 className="size-3 text-[var(--color-primary)] animate-spin" />}
                {saved && <Check className="size-3 text-emerald-500" />}
            </div>
        </div>
    );
}

function EditableSelect({ id, field, initialValue, options }: { id: number, field: string, initialValue: string, options: any[] }) {
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const currentOption = options.find(o => o.value === value);

    const handleChange = (e: any) => {
        const val = e.target.value;
        setValue(val);
        startTransition(async () => {
            const res = await updateAvaluoFieldAction(id, field, val);
            if (res.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        });
    };

    return (
        <div className="relative flex items-center gap-2">
            <select 
                value={value}
                onChange={handleChange}
                className={`appearance-none px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 outline-none transition-all cursor-pointer shadow-sm ${currentOption?.color || 'bg-slate-50 text-slate-400'}`}
            >
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {isPending && <Loader2 className="size-3 text-[var(--color-primary)] animate-spin" />}
            {saved && <Check className="size-3 text-emerald-500" />}
        </div>
    );
}
