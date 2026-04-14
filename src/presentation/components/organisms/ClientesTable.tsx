'use client';

import { useState, useTransition } from "react";
import { 
    Search, 
    Plus, 
    Phone, 
    MessageSquare, 
    Users, 
    Eye, 
    EyeOff, 
    Loader2, 
    Check, 
    ChevronDown, 
    ChevronUp,
    Car,
    UserCircle,
    Thermometer
} from "lucide-react";
import Link from "next/link";
import { updateClientFieldAction } from "@/app/(dashboard)/avaluos/actions";

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

export default function ClientesTable({ data, vendedores, isDirector }: Props) {
    const [columns, setColumns] = useState<Column[]>([
        { id: 'id', label: 'ID', visible: true },
        { id: 'nombre', label: 'Nombre', visible: true },
        { id: 'telefono', label: 'Teléfono', visible: true },
        { id: 'origen', label: 'Origen', visible: true },
        { id: 'probabilidad', label: 'Prob.', visible: true },
        { id: 'apartado', label: 'Apartado', visible: true },
        { id: 'comentarios', label: 'Comentarios', visible: true },
        { id: 'vendedor', label: 'Asesor', visible: true },
    ]);

    const [showColumnPicker, setShowColumnPicker] = useState(false);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleColumn = (id: string) => {
        setColumns(cols => cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
    };

    const toggleRow = (id: number) => {
        setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const probColors: any = {
        'frio': 'text-blue-500 bg-blue-50',
        'tibio': 'text-amber-500 bg-amber-50',
        'caliente': 'text-red-500 bg-red-50',
    };

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-6">
                    <div className="size-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20">
                        <Users className="size-6 text-[var(--color-primary)]" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Directorio de Clientes</h2>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{data.length} Clientes registrados</span>
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
                    <Link 
                        href="/clientes/nuevo"
                        className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
                    >
                        <Plus className="size-4" />
                        <span>Nuevo Cliente</span>
                    </Link>
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
                                    <th key={col.id} className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-left">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((client) => (
                                <>
                                    <tr key={client.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50">
                                        <td className="p-5">
                                            <button 
                                                onClick={() => toggleRow(client.id)}
                                                className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all"
                                            >
                                                {expandedRows.includes(client.id) ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                            </button>
                                        </td>
                                        {columns.find(c => c.id === 'id')?.visible && (
                                            <td className="p-5 text-[10px] font-bold text-slate-400">#{client.id}</td>
                                        )}
                                        {columns.find(c => c.id === 'nombre')?.visible && (
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                                                        <UserCircle className="size-5 text-slate-300" />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-900 leading-tight">{client.nombre}</span>
                                                </div>
                                            </td>
                                        )}
                                        {columns.find(c => c.id === 'telefono')?.visible && (
                                            <td className="p-5">
                                                <a href={`tel:${client.telefono}`} className="flex items-center gap-2 group/tel">
                                                    <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100/50 group-hover/tel:bg-emerald-500 group-hover/tel:text-white transition-all">
                                                        <Phone className="size-3.5 text-emerald-500 group-hover/tel:text-white" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 group-hover/tel:text-slate-900">{client.telefono}</span>
                                                </a>
                                            </td>
                                        )}
                                        {columns.find(c => c.id === 'origen')?.visible && (
                                            <td className="p-5">
                                                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-200/50 shadow-sm">
                                                    {client.origen}
                                                </span>
                                            </td>
                                        )}
                                        {columns.find(c => c.id === 'probabilidad')?.visible && (
                                            <td className="p-5">
                                                <EditableSelect 
                                                    id={client.id}
                                                    field="probabilidad"
                                                    initialValue={client.probabilidad}
                                                    options={[
                                                        { value: 'frio', label: 'Frío', color: 'text-blue-500 bg-blue-50' },
                                                        { value: 'tibio', label: 'Tibio', color: 'text-amber-500 bg-amber-50' },
                                                        { value: 'caliente', label: 'Caliente', color: 'text-red-500 bg-red-50' },
                                                    ]}
                                                />
                                            </td>
                                        )}
                                        {columns.find(c => c.id === 'apartado')?.visible && (
                                            <td className="p-5">
                                                {client.tiene_apartado ? (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-500 rounded-lg border border-amber-100 text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                        <Car className="size-3.5" />
                                                        <span>Apartado</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sin unidad</span>
                                                )}
                                            </td>
                                        )}
                                        {columns.find(c => c.id === 'comentarios')?.visible && (
                                            <td className="p-5 min-w-[200px]">
                                                <EditableText 
                                                    id={client.id}
                                                    field="comentarios_vendedor"
                                                    initialValue={client.comentarios_vendedor || ''}
                                                    type="textarea"
                                                />
                                            </td>
                                        )}
                                        {columns.find(c => c.id === 'vendedor')?.visible && (
                                            <td className="p-5 min-w-[140px]">
                                                <select 
                                                    disabled={!isDirector}
                                                    defaultValue={client.vendedor_id}
                                                    onChange={(e) => updateClientFieldAction(client.id, 'vendedor_id', parseInt(e.target.value))}
                                                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] font-bold text-slate-900 w-full outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all disabled:opacity-50"
                                                >
                                                    {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                                                </select>
                                            </td>
                                        )}
                                    </tr>
                                    {expandedRows.includes(client.id) && (
                                        <tr className="bg-slate-50/20">
                                            <td colSpan={columns.filter(c => c.visible).length + 1} className="p-8">
                                                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                                            <MessageSquare className="size-4 text-[var(--color-primary)]" />
                                                        </div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Bitácora de Comentarios Completos</h4>
                                                    </div>
                                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 min-h-[100px]">
                                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                            {client.comentarios_vendedor ? client.comentarios_vendedor : "No hay comentarios adicionales registrados para este cliente."}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2 px-2">
                                                        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                                            <span>Origen: {client.origen}</span>
                                                            <span className="size-1 rounded-full bg-slate-200"></span>
                                                            <span>Agregado: {new Date(client.fecha_registro).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black text-slate-400">ID DE CLIENTE: {client.id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function EditableText({ id, field, initialValue, type }: { id: number, field: string, initialValue: string, type: string }) {
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handleBlur = () => {
        if (value === initialValue) return;
        startTransition(async () => {
            const res = await updateClientFieldAction(id, field, value);
            if (res.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        });
    };

    return (
        <div className="relative group/edit">
            <textarea 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                rows={1}
                className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-500 focus:text-slate-900 focus:bg-slate-50 p-2 rounded-xl transition-all resize-none overflow-hidden placeholder:text-slate-200 group-hover/edit:bg-slate-50"
                placeholder="Escribir comentarios..."
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
            const res = await updateClientFieldAction(id, field, val);
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
