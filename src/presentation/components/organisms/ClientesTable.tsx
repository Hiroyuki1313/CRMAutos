'use client';

import { useState, useTransition, Fragment, useRef, useEffect } from "react";
import { 
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
    FileText,
    Home,
    CreditCard,
    Shield,
    ScrollText,
    Calendar,
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { updateClientFieldAction } from "@/app/(dashboard)/avaluos/actions";

import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";

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

const DOC_DEFS = [
    { key: 'ine_url',                   label: 'INE',        Icon: CreditCard, color: 'text-violet-500 bg-violet-50 border-violet-100' },
    { key: 'comprobante_domicilio_url',  label: 'Domicilio',  Icon: Home,       color: 'text-sky-500   bg-sky-50   border-sky-100'   },
    { key: 'estados_cuenta_url',         label: 'E. Cuenta',  Icon: ScrollText, color: 'text-teal-500  bg-teal-50  border-teal-100'  },
    { key: 'licencia_contrato_url',      label: 'Licencia',   Icon: FileText,   color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { key: 'seguro_url',                 label: 'Seguro',     Icon: Shield,     color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
];

function formatDate(value: string | Date | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function seguimientoStatus(value: string | Date | null | undefined): 'vencido' | 'hoy' | 'futuro' | 'none' {
    if (!value) return 'none';
    const d = new Date(value);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd   = new Date(todayStart.getTime() + 86400000);
    if (d < todayStart) return 'vencido';
    if (d < todayEnd)   return 'hoy';
    return 'futuro';
}

export default function ClientesTable({ data, vendedores, isDirector }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Read current params
    const q = searchParams.get('q') || "";
    const origen = searchParams.get('origen') || "todos";
    const apartado = searchParams.get('apartado') || "todos";
    const prob = searchParams.get('prob') || "todos";
    const vendedoresParam = searchParams.get('vendedores') || "";

    const [columns, setColumns] = useState<Column[]>([
        { id: 'id',              label: 'ID',                visible: true  },
        { id: 'nombre',          label: 'Nombre',            visible: true  },
        { id: 'telefono',        label: 'Teléfono',          visible: true  },
        { id: 'origen',          label: 'Origen',            visible: true  },
        { id: 'probabilidad',    label: 'Prob.',             visible: true  },
        { id: 'apartado',        label: 'Apartado',          visible: true  },
        { id: 'documentacion',   label: 'Documentos',        visible: true  },
        { id: 'seguimiento',     label: 'Próx. Seguimiento', visible: true  },
        { id: 'fecha_registro',  label: 'Registro',          visible: false },
        { id: 'comentarios',     label: 'Comentarios',       visible: true  },
        { id: 'vendedor',        label: 'Asesor',            visible: true  },
    ]);

    const [showColumnPicker, setShowColumnPicker] = useState(false);
    const [showFilters, setShowFilters]           = useState(false);
    const [expandedRows, setExpandedRows]         = useState<number[]>([]);

    const toggleColumn = (id: string) =>
        setColumns(cols => cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c));

    const toggleRow = (id: number) =>
        setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);

    const isVisible = (id: string) => !!columns.find(c => c.id === id)?.visible;

    const buildUrl = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === 'todos' || !value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        return `/clientes?${params.toString()}`;
    };

    const activeFiltersCount = [
        origen !== 'todos',
        apartado !== 'todos',
        prob !== 'todos',
        vendedoresParam !== ''
    ].filter(Boolean).length;

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">

            {/* Unified Controls Row: Search, Filters & Vision */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full">
                
                {/* Search Bar */}
                <div className="relative group w-full lg:max-w-md">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const query = formData.get('q') as string;
                        router.push(buildUrl({ q: query }));
                    }} className="relative w-full">
                        <Search className="size-4 top-1/2 -translate-y-1/2 text-slate-400 absolute left-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                        <input
                            name="q"
                            defaultValue={q}
                            type="text"
                            placeholder="Buscar por nombre o teléfono..."
                            className="outline-none rounded-2xl bg-white text-slate-900 text-sm border-slate-200 hover:border-slate-300 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all border pl-12 pr-6 py-4 w-full font-bold shadow-sm"
                        />
                    </form>
                </div>

                {/* Filters & Vision Toggle */}
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    
                    {/* Advanced Filters Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowFilters(!showFilters);
                                setShowColumnPicker(false);
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${showFilters ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
                        >
                            <Users className="size-4" />
                            <span>Filtros</span>
                            {activeFiltersCount > 0 && (
                                <span className="flex items-center justify-center size-5 bg-[var(--color-primary)] text-white rounded-full text-[8px] animate-in zoom-in-50">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {showFilters && (
                            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-[150] space-y-6 animate-in zoom-in-95 origin-top-right">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Configurar Filtros</span>
                                    <button onClick={() => setShowFilters(false)} className="text-[8px] font-bold text-slate-400 hover:text-red-500 uppercase">Cerrar</button>
                                </div>

                                <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Origen */}
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Origen del Registro</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['todos', 'ads', 'piso', 'redes'].map(o => (
                                                <button
                                                    key={o}
                                                    onClick={() => router.push(buildUrl({ origen: o }))}
                                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all ${origen === o ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                                                >
                                                    {o}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Apartado */}
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Situación de Apartado</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[
                                                { v: 'todos', l: 'Todos' },
                                                { v: 'con',   l: 'Con Apartado' },
                                                { v: 'sin',   l: 'Sin Unidad' }
                                            ].map(opt => (
                                                <button
                                                    key={opt.v}
                                                    onClick={() => router.push(buildUrl({ apartado: opt.v }))}
                                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all ${apartado === opt.v ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                                                >
                                                    {opt.l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Probabilidad */}
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Temperatura (Prob.)</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[
                                                { v: 'todos',    l: 'Todos',    c: 'bg-slate-900' },
                                                { v: 'rechazo',  l: 'Rechazo',  c: 'bg-red-600' },
                                                { v: 'frio',     l: 'Frío',     c: 'bg-sky-400'   },
                                                { v: 'medio',    l: 'Medio',    c: 'bg-yellow-400'  },
                                                { v: 'alto',     l: 'Alto',     c: 'bg-emerald-500'    },
                                                { v: 'venta',    l: 'Venta',    c: 'bg-[var(--color-primary)]' }
                                            ].map(opt => (
                                                <button
                                                    key={opt.v}
                                                    onClick={() => router.push(buildUrl({ prob: opt.v }))}
                                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all ${prob === opt.v ? `${opt.c} text-white shadow-lg` : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                                                >
                                                    {opt.l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Asesores (Directores only) */}
                                    {isDirector && (
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Asesor Responsable</p>
                                            <select 
                                                defaultValue={vendedoresParam}
                                                onChange={(e) => router.push(buildUrl({ vendedores: e.target.value }))}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5"
                                            >
                                                <option value="">Todos los Asesores</option>
                                                {vendedores.map(v => (
                                                    <option key={v.id} value={v.id}>{v.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="pt-4 mt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => router.push('/clientes')}
                                            className="w-full py-3 rounded-2xl border border-red-100 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="size-3.5" />
                                            Limpiar todos los Filtros
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Column Vision Picker */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowColumnPicker(!showColumnPicker);
                                setShowFilters(false);
                            }}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${showColumnPicker ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[var(--color-primary)]/20' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300'}`}
                        >
                            <Eye className="size-4" />
                            <span className="hidden sm:inline">Visión</span>
                        </button>
                        {showColumnPicker && (
                            <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl z-50 grid grid-cols-1 gap-2 animate-in zoom-in-95 origin-top-right">
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Columnas</span>
                                    <button onClick={() => setShowColumnPicker(false)} className="text-[8px] font-bold text-slate-400 hover:text-slate-900 uppercase">Cerrar</button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                    {columns.map(col => (
                                        <button
                                            key={col.id}
                                            onClick={() => toggleColumn(col.id)}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${col.visible ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-slate-400 hover:bg-slate-50'}`}
                                        >
                                            <span>{col.label}</span>
                                            {col.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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
                            {data.map((client) => {
                                const segStatus = seguimientoStatus(client.fecha_proximo_seguimiento);
                                return (
                                    <Fragment key={client.id}>
                                        <tr className="hover:bg-slate-50/50 transition-all group border-b border-slate-50">
                                            {/* Expand button */}
                                            <td className="p-5">
                                                <button
                                                    onClick={() => toggleRow(client.id)}
                                                    className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all"
                                                >
                                                    {expandedRows.includes(client.id) ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                                </button>
                                            </td>

                                            {/* ID */}
                                            {isVisible('id') && (
                                                <td className="p-5 text-[10px] font-bold text-slate-400">#{client.id}</td>
                                            )}

                                            {/* Nombre */}
                                            {isVisible('nombre') && (
                                                <td className="p-5">
                                                    <Link href={`/cliente/${client.id}?from=clientes`} className="flex items-center gap-3 group/lnk">
                                                        <div className="size-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                                                            <UserCircle className="size-5 text-slate-300" />
                                                        </div>
                                                        <span className="text-sm font-black text-slate-900 leading-tight group-hover/lnk:text-[var(--color-primary)] transition-colors">
                                                            {client.nombre}
                                                        </span>
                                                    </Link>
                                                </td>
                                            )}

                                            {/* Teléfono */}
                                            {isVisible('telefono') && (
                                                <td className="p-5">
                                                    <a href={`tel:${client.telefono}`} className="flex items-center gap-2 group/tel">
                                                        <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100/50 group-hover/tel:bg-emerald-500 transition-all">
                                                            <Phone className="size-3.5 text-emerald-500 group-hover/tel:text-white" />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-500 group-hover/tel:text-slate-900">{client.telefono}</span>
                                                    </a>
                                                </td>
                                            )}

                                            {/* Origen */}
                                            {isVisible('origen') && (
                                                <td className="p-5">
                                                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-200/50 shadow-sm">
                                                        {client.origen}
                                                    </span>
                                                </td>
                                            )}

                                            {/* Probabilidad */}
                                            {isVisible('probabilidad') && (
                                                <td className="p-5">
                                                    <EditableSelect
                                                        id={client.id}
                                                        field="probabilidad"
                                                        initialValue={client.probabilidad}
                                                        options={[
                                                            { value: 'rechazo',  label: 'Rechazo',  color: 'bg-red-600 text-white border-red-700' },
                                                            { value: 'frio',     label: 'Frío',     color: 'bg-sky-400 text-white border-sky-500'   },
                                                            { value: 'medio',    label: 'Medio',    color: 'bg-yellow-400 text-slate-900 border-yellow-500' },
                                                            { value: 'alto',     label: 'Alto',     color: 'bg-emerald-500 text-white border-emerald-600'     },
                                                            { value: 'venta',    label: 'Venta',    color: 'bg-[var(--color-primary)] text-white border-transparent' },
                                                        ]}
                                                    />
                                                </td>
                                            )}

                                            {/* Apartado */}
                                            {isVisible('apartado') && (
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

                                            {/* Documentación */}
                                            {isVisible('documentacion') && (
                                                <td className="p-5">
                                                    <div className="flex items-center gap-1.5">
                                                        {DOC_DEFS.map(({ key, label, Icon, color }) => {
                                                            const url = client[key];
                                                            return url ? (
                                                                <a
                                                                    key={key}
                                                                    href={url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title={label}
                                                                    className={`group/doc size-7 rounded-lg border flex items-center justify-center transition-all hover:scale-110 shadow-sm ${color}`}
                                                                >
                                                                    <Icon className="size-3.5" />
                                                                </a>
                                                            ) : (
                                                                <div
                                                                    key={key}
                                                                    title={`${label}: no cargado`}
                                                                    className="size-7 rounded-lg border border-slate-100 flex items-center justify-center bg-slate-50 opacity-30"
                                                                >
                                                                    <Icon className="size-3.5 text-slate-300" />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                            )}

                                            {/* Próximo Seguimiento */}
                                            {isVisible('seguimiento') && (
                                                <td className="p-5">
                                                    {segStatus === 'none' ? (
                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sin fecha</span>
                                                    ) : (
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black shadow-sm ${
                                                            segStatus === 'vencido' ? 'bg-red-50 text-red-500 border-red-100' :
                                                            segStatus === 'hoy'     ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                                                     'bg-slate-50 text-slate-500 border-slate-100'
                                                        }`}>
                                                            {segStatus === 'vencido' && <AlertCircle  className="size-3" />}
                                                            {segStatus === 'hoy'     && <AlertCircle  className="size-3" />}
                                                            {segStatus === 'futuro'  && <Calendar     className="size-3" />}
                                                            {formatDate(client.fecha_proximo_seguimiento)}
                                                        </div>
                                                    )}
                                                </td>
                                            )}

                                            {/* Fecha Registro */}
                                            {isVisible('fecha_registro') && (
                                                <td className="p-5 whitespace-nowrap text-[10px] font-bold text-slate-400">
                                                    {formatDate(client.fecha_registro)}
                                                </td>
                                            )}

                                            {/* Comentarios */}
                                            {isVisible('comentarios') && (
                                                <td className="p-5 min-w-[200px]">
                                                    <EditableText
                                                        id={client.id}
                                                        field="comentarios_vendedor"
                                                        initialValue={client.comentarios_vendedor || ''}
                                                        type="textarea"
                                                    />
                                                </td>
                                            )}

                                            {/* Asesor */}
                                            {isVisible('vendedor') && (
                                                <td className="p-5 min-w-[140px]">
                                                    <select
                                                        disabled={!isDirector}
                                                        defaultValue={client.id_vendedor}
                                                        onChange={(e) => updateClientFieldAction(client.id, 'id_vendedor', parseInt(e.target.value))}
                                                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] font-bold text-slate-900 w-full outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all disabled:opacity-50"
                                                    >
                                                        {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                                                    </select>
                                                </td>
                                            )}
                                        </tr>

                                        {/* Expanded Row */}
                                        {expandedRows.includes(client.id) && (
                                            <tr className="bg-slate-50/20">
                                                <td colSpan={columns.filter(c => c.visible).length + 1} className="p-8">
                                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6 animate-in slide-in-from-top-4 duration-500">
                                                        
                                                        {/* Documentos */}
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="size-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                                                    <FileText className="size-4 text-[var(--color-primary)]" />
                                                                </div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Documentación del Registro</h4>
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                                                {DOC_DEFS.map(({ key, label, Icon, color }) => {
                                                                    const url = client[key];
                                                                    return (
                                                                        <div key={key} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center ${url ? color : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                                                                            <Icon className="size-5" />
                                                                            <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{label}</span>
                                                                            {url ? (
                                                                                <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[8px] font-bold underline underline-offset-2 opacity-80 hover:opacity-100">
                                                                                    <ExternalLink className="size-2.5" /> Ver
                                                                                </a>
                                                                            ) : (
                                                                                <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                                                                                    <XCircle className="size-2.5" /> No cargado
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Comentarios + Metadata */}
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="size-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                                                    <MessageSquare className="size-4 text-[var(--color-primary)]" />
                                                                </div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Bitácora de Comentarios</h4>
                                                            </div>
                                                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 min-h-[80px]">
                                                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                                    {client.comentarios_vendedor || 'No hay comentarios adicionales registrados.'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Info Footer */}
                                                        <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-slate-100">
                                                            <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                                                <span>ID: #{client.id}</span>
                                                                <span className="size-1 rounded-full bg-slate-200"></span>
                                                                <span>Origen: {client.origen}</span>
                                                                <span className="size-1 rounded-full bg-slate-200"></span>
                                                                <span>Registro: {formatDate(client.fecha_registro)}</span>
                                                            </div>
                                                            {segStatus !== 'none' && (
                                                                <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                                                                    segStatus === 'vencido' ? 'bg-red-50 text-red-500 border-red-100' :
                                                                    segStatus === 'hoy'     ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                                                             'bg-slate-50 text-slate-500 border-slate-100'
                                                                }`}>
                                                                    {segStatus === 'futuro' ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                                                                    Seg: {formatDate(client.fecha_proximo_seguimiento)}
                                                                </div>
                                                            )}
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

function EditableText({ id, field, initialValue, type }: { id: number, field: string, initialValue: string, type: string }) {
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    const handleBlur = () => {
        if (value === initialValue) return;
        startTransition(async () => {
            const res = await updateClientFieldAction(id, field, value);
            if (res.success) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
        });
    };

    return (
        <div className="relative group/edit">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                rows={1}
                className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-500 focus:text-slate-900 focus:bg-slate-50 p-2 rounded-xl transition-all resize-none placeholder:text-slate-200 group-hover/edit:bg-slate-50"
                placeholder="Escribir comentarios..."
            />
            <div className="absolute right-2 top-2">
                {isPending && <Loader2 className="size-3 text-[var(--color-primary)] animate-spin" />}
                {saved    && <Check   className="size-3 text-emerald-500" />}
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
            if (res.success) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
        });
    };

    return (
        <div className="relative flex items-center gap-2">
            <select
                value={value}
                onChange={handleChange}
                className={`appearance-none px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 outline-none transition-all cursor-pointer shadow-sm ${currentOption?.color || 'bg-slate-50 text-slate-400'}`}
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {isPending && <Loader2 className="size-3 text-[var(--color-primary)] animate-spin" />}
            {saved    && <Check   className="size-3 text-emerald-500" />}
        </div>
    );
}
