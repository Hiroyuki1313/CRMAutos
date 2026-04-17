'use client';

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    Check, 
    ChevronDown, 
    Search, 
    Car, 
    User, 
    Phone, 
    Calendar, 
    Clock, 
    MoreHorizontal,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle,
    UserCircle,
    Thermometer,
    FileText,
    UploadCloud,
    X,
    FileUp,
    Filter,
    Users,
    XCircle,
    AlertTriangle,
    Activity,
    ArrowRight,
    MessageCircle
} from "lucide-react";
import { updateApartadoFieldAction, updateClientFieldAction, uploadApartadoDocumentAction, deleteApartadoDocumentAction } from "@/app/(dashboard)/apartados/actions";
import { optimizeImage } from "@/presentation/utils/imageUtils";
import { Apartado } from "@/core/domain/entities/Apartado";
import { Auto } from "@/core/domain/entities/Auto";
import { VehicleSelectorModal } from "../molecules/VehicleSelectorModal";
import { getAvailableAutosAction } from "@/app/(dashboard)/clientes/nuevo/actions";
import { VehicleDetailPopup } from "../molecules/VehicleDetailPopup";
import { getAutoByIdAction } from "@/core/usecases/autoService";
import { CommentsModal } from "../molecules/CommentsModal";
import AvaluoRegistrationModal from "../molecules/AvaluoRegistrationModal";
import { DollarSign } from "lucide-react";

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface Props {
    data: Apartado[];
    vendedores: { id: number, nombre: string }[];
    canReassign?: boolean;
    isDirector?: boolean;
}

export function SeguimientosTable({ data, vendedores, canReassign = false, isDirector = false }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Read current params
    const q = searchParams.get('q') || "";
    const tab = searchParams.get('tab') || "todos";
    const vendedoresParam = searchParams.get('vendedores') || "";
    const from = searchParams.get('from') || "";
    const to = searchParams.get('to') || "";
    const prob = searchParams.get('prob') || "";
    const origen = searchParams.get('origen') || "";
    const credito = searchParams.get('credito') || "";

    const [columns, setColumns] = useState<Column[]>([
        { id: 'id_venta', label: 'ID', visible: true },
        { id: 'fecha_agregado', label: 'Fecha de Registro', visible: true },
        { id: 'cliente', label: 'Nombre Cliente', visible: true },
        { id: 'vendedor', label: 'Asesor', visible: true },
        { id: 'fecha_prox', label: 'Fecha Próximo Seguimiento', visible: true },
        { id: 'prox_seg', label: 'Acción', visible: true },
        { id: 'fecha_prox_cita', label: 'Próxima Cita', visible: true },
        { id: 'telefono', label: 'Tel.', visible: true },
        { id: 'probabilidad', label: 'Prob.', visible: true },
        { id: 'origen', label: 'Origen', visible: true },
        { id: 'cat', label: 'Unidad', visible: true },
        { id: 'avaluo', label: 'Avalúo', visible: true },
        { id: 'ofrecimiento', label: 'Oferta Avalúo', visible: true },
        { id: 'acudio', label: 'Acudió', visible: true },
        { id: 'fecha_primera_cita', label: '1ra Cita', visible: true },
        { id: 'demo', label: 'Demo', visible: true },
        { id: 'cotizacion', label: 'Cot. Archivo', visible: true },
        { id: 'cotizacion_realizada', label: 'Cot. Realizada', visible: true },
        { id: 'credito', label: 'Financiera', visible: true },
        { id: 'estatus_credito', label: 'Estatus Créd.', visible: true },
        { id: 'metodo_pago', label: 'Pago', visible: true },
        { id: 'monto_apartado', label: 'Monto Apt.', visible: true },
        { id: 'apartado', label: 'Apt. Realizada', visible: true },
    ]);

    const [showColumnPicker, setShowColumnPicker] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedApartadoForVehicle, setSelectedApartadoForVehicle] = useState<number | null>(null);
    const [selectedApartadoForComments, setSelectedApartadoForComments] = useState<Apartado | null>(null);
    const [selectedApartadoForAvaluo, setSelectedApartadoForAvaluo] = useState<Apartado | null>(null);

    // Hover Tech Sheet State
    const [hoveredAuto, setHoveredAuto] = useState<Auto | null>(null);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, autoId: number | undefined) => {
        if (!autoId) return;
        if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
        const rect = e.currentTarget.getBoundingClientRect();
        hoverTimerRef.current = setTimeout(async () => {
            const res = await getAutoByIdAction(autoId);
            if (res.success && res.auto) {
                setHoveredAuto(res.auto);
                setAnchorRect(rect);
                setIsHovering(true);
            }
        }, 1200);
    };

    const handleMouseLeave = () => {
        if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
        closeTimerRef.current = setTimeout(() => { setIsHovering(false); }, 300);
    };

    const toggleColumn = (id: string) => {
        setColumns(cols => cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
    };

    const buildUrl = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === 'todos' || !value) params.delete(key);
            else params.set(key, value);
        });
        return `/apartados?${params.toString()}`;
    };

    const activeFiltersCount = [
        tab !== 'todos',
        vendedoresParam !== '',
        from !== '',
        to !== '',
        prob !== '',
        origen !== '',
        credito !== ''
    ].filter(Boolean).length;

    return (
        <div className="flex flex-col gap-10 w-full animate-in fade-in duration-700">
            
            {/* Unified Controls Row: Search, Filters & Vision */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full">
                {/* Unified Filter Row */}
                <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
                    {/* Search Bar */}
                    <div className="relative group flex-1 w-full lg:max-w-md">
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
                                placeholder="Buscar seguimientos..."
                                className="outline-none rounded-2xl bg-white text-slate-900 text-sm border-slate-200 hover:border-slate-300 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all border pl-12 pr-6 py-4 w-full font-bold shadow-sm"
                            />
                        </form>
                    </div>

                    {/* Promoted Date Range (Replacing old tabs) */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm w-full lg:w-auto">
                        <div className="px-3 flex items-center gap-2 border-r border-slate-100 mr-1">
                            <Calendar className="size-3.5 text-indigo-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rango</span>
                        </div>
                        <div className="relative group/date">
                            <input 
                                type="date" 
                                value={from}
                                onChange={(e) => router.push(buildUrl({ from: e.target.value }))}
                                className="bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl py-2 px-3 text-[10px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all w-[130px]"
                            />
                        </div>
                        <ArrowRight className="size-3 text-slate-300 shrink-0" />
                        <div className="relative group/date">
                            <input 
                                type="date" 
                                value={to}
                                onChange={(e) => router.push(buildUrl({ to: e.target.value }))}
                                className="bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl py-2 px-3 text-[10px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all w-[130px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Filters & Vision Toggle */}
                <div className="flex items-center gap-3 w-full lg:w-auto">

                    {/* Advanced Filters Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowFilters(!showFilters);
                                setShowColumnPicker(false);
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${showFilters ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
                        >
                            <Filter className="size-4" />
                            <span>Más Filtros</span>
                            {activeFiltersCount > 0 && (
                                <span className="flex items-center justify-center size-5 bg-[var(--color-primary)] text-white rounded-full text-[8px] animate-in zoom-in-50">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        {showFilters && (
                            <div className="absolute top-full right-0 mt-3 w-[45rem] bg-white border border-slate-200 rounded-[2rem] p-8 shadow-2xl z-[150] space-y-8 animate-in zoom-in-95 origin-top-right">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Filtros de Clasificación</span>
                                    <button onClick={() => setShowFilters(false)} className="text-[8px] font-bold text-slate-400 hover:text-red-500 uppercase">Cerrar</button>
                                </div>

                                <div className="grid grid-cols-2 gap-x-12 gap-y-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    
                                    {/* Column 1: Categories */}
                                    <div className="space-y-8">

                                        {/* Plazo / Estado Predefinido */}
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Accesos Rápidos (Plazo)</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {[
                                                    { id: 'todos',    label: 'Cualquier Plazo', c: 'bg-slate-900' },
                                                    { id: 'vencidos', label: 'Vencidos', c: 'bg-red-500' },
                                                    { id: 'criticos', label: 'Críticos', c: 'bg-red-700' }
                                                ].map(t => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => router.push(buildUrl({ tab: t.id }))}
                                                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all ${tab === t.id ? `${t.c} text-white shadow-lg` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                    >
                                                        {t.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Estatus Financiera */}
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Situación Financiera</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {['todos', 'aprobado', 'rechazado', 'caliente', 'medio', 'frio'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => router.push(buildUrl({ credito: t }))}
                                                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all ${credito === t || (t === 'todos' && !credito) ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Client Profile & Assignment */}
                                    <div className="space-y-8">
                                        {/* Probabilidad */}
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Probabilidad de Cierre</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {[
                                                    { id: 'todos',    label: 'Todos', c: 'bg-slate-900' },
                                                    { id: 'rechazo',  label: 'Rechazo', c: 'bg-red-600' },
                                                    { id: 'frio',     label: 'Frío', c: 'bg-sky-400' },
                                                    { id: 'medio',    label: 'Medio', c: 'bg-yellow-400' },
                                                    { id: 'alto',     label: 'Alto', c: 'bg-emerald-500' },
                                                    { id: 'venta',    label: 'Venta', c: 'bg-[var(--color-primary)]' }
                                                ].map(t => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => router.push(buildUrl({ prob: t.id }))}
                                                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all ${prob === t.id || (t.id === 'todos' && !prob) ? `${t.c} text-white shadow-lg` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                    >
                                                        {t.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Origen */}
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Origen de Prospectación</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {['todos', 'ads', 'piso', 'redes'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => router.push(buildUrl({ origen: t }))}
                                                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all ${origen === t || (t === 'todos' && !origen) ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Asesores */}
                                        {(isDirector || canReassign) && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Users className="size-3.5 text-slate-400" />
                                                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Asesor a Cargo</p>
                                                </div>
                                                <select 
                                                    defaultValue={vendedoresParam}
                                                    onChange={(e) => router.push(buildUrl({ vendedores: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer"
                                                >
                                                    <option value="">Cualquier Asesor</option>
                                                    {vendedores.map(v => (
                                                        <option key={v.id} value={v.id}>{v.nombre}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <button 
                                        onClick={() => {
                                            router.push('/apartados');
                                            setShowFilters(false);
                                        }}
                                        className="w-full py-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Limpiar Todos los Filtros
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Column Picker */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowColumnPicker(!showColumnPicker);
                                setShowFilters(false);
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${showColumnPicker ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
                        >
                            <Activity className="size-4" />
                            <span>Visión</span>
                        </button>
                        {showColumnPicker && (
                            <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-2xl z-[150] animate-in zoom-in-95 origin-top-right">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Columnas</span>
                                    <button onClick={() => setShowColumnPicker(false)} className="text-[8px] font-bold text-slate-400 hover:text-red-500 uppercase">Cerrar</button>
                                </div>
                                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {columns.map(col => (
                                        <button
                                            key={col.id}
                                            onClick={() => toggleColumn(col.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${col.visible ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-wider">{col.label}</span>
                                            {col.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {columns.filter(c => c.visible).map(col => (
                                    <th key={col.id} className="px-1 py-3 text-[8px] font-black uppercase tracking-tight text-slate-500 border border-slate-200 bg-slate-100/50">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row) => {
                                // Parse last comment for the summary field
                                let lastNote = row.proximo_seguimiento_texto;
                                try {
                                    if (row.comentarios_vendedor) {
                                        const parsed = JSON.parse(row.comentarios_vendedor);
                                        if (Array.isArray(parsed) && parsed.length > 0) {
                                            lastNote = parsed[0].text;
                                        }
                                    }
                                } catch {}

                                return (
                                <tr key={row.id_venta} className="group hover:bg-slate-50 transition-colors">
                                    {isVisible(columns, 'id_venta') && (
                                        <td className="px-1 py-3 border border-slate-200">
                                            <span className="text-[10px] font-bold text-slate-300">#{row.id_venta}</span>
                                        </td>
                                    )}
                                    {isVisible(columns, 'fecha_agregado') && (
                                        <td className="px-1 py-3 border border-slate-200">
                                            <div className="flex flex-col gap-0.5 min-w-[70px]">
                                                <span className="text-[9px] font-black text-slate-900">{new Date(row.fecha_actualizacion!).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</span>
                                                <span className="text-[8px] text-slate-400 font-bold uppercase">{new Date(row.fecha_actualizacion!).toLocaleDateString('es-MX', { year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                    )}
                                    {isVisible(columns, 'cliente') && (
                                        <td className="px-1 py-3 border border-slate-200">
                                             <Link href={`/cliente/${(row as any).cliente?.id}?from=apartados`} className="flex flex-col gap-0 group/link">
                                                <span className="text-[9px] font-black text-slate-900 group-hover/link:text-indigo-600 transition-colors uppercase leading-none truncate max-w-[100px]">{(row as any).cliente?.nombre || 'Desconocido'}</span>
                                             </Link>
                                        </td>
                                    )}
                                    {isVisible(columns, 'vendedor') && (
                                        <td className="px-1 py-3 border border-slate-200">
                                            <div className="flex items-center gap-1.5">
                                                <div className="size-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <UserCircle className="size-3.5" />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-700 truncate max-w-[60px]">{row.nombre_vendedor || 'S/A'}</span>
                                            </div>
                                        </td>
                                    )}
                                    {isVisible(columns, 'fecha_prox') && (
                                        <EditableCell 
                                            key={`${row.id_venta}-fecha-${row.fecha_proximo_seguimiento?.toString()}`}
                                            id={row.id_venta} 
                                            field="fecha_proximo_seguimiento" 
                                            initialValue={row.fecha_proximo_seguimiento ? new Date(row.fecha_proximo_seguimiento).toISOString().split('T')[0] : ''} 
                                            type="date"
                                        />
                                    )}
                                    {isVisible(columns, 'prox_seg') && (
                                        <td className="px-1 py-3 border border-slate-200 max-w-[150px]">
                                            <div 
                                                onClick={() => setSelectedApartadoForComments(row)}
                                                className="flex flex-col gap-0.5 cursor-pointer group/note"
                                            >
                                                <span className="text-[9px] font-bold text-slate-700 leading-tight whitespace-normal break-words group-hover/note:text-indigo-600 transition-colors">
                                                    {lastNote || 'Sin acción'}
                                                </span>
                                            </div>
                                        </td>
                                    )}
                                    {isVisible(columns, 'fecha_prox_cita') && (
                                        <EditableCell 
                                            key={`${row.id_venta}-prox-cita-${row.fecha_proxima_cita?.toString()}`}
                                            id={row.id_venta} 
                                            field="fecha_proxima_cita" 
                                            initialValue={row.fecha_proxima_cita 
                                                ? new Date(new Date(row.fecha_proxima_cita).getTime() - (new Date(row.fecha_proxima_cita).getTimezoneOffset() * 60000)).toISOString().slice(0, 16) 
                                                : ''} 
                                            type="datetime-local"
                                        />
                                    )}
                                    {isVisible(columns, 'telefono') && (
                                        <td className="px-1 py-3 border border-slate-200">
                                            <a href={`tel:${(row as any).cliente?.telefono}`} className="text-[8px] font-black text-slate-500 hover:text-indigo-600 transition-colors whitespace-nowrap">
                                                {(row as any).cliente?.telefono || '-'}
                                            </a>
                                        </td>
                                    )}
                                    {isVisible(columns, 'probabilidad') && (
                                        <td className="px-2 py-3 border border-slate-200">
                                            <EditableProbabilidadCell 
                                                key={`${(row as any).cliente?.id}-prob-${(row as any).cliente?.probabilidad}`}
                                                id_cliente={(row as any).cliente?.id} 
                                                initialValue={(row as any).cliente?.probabilidad || 'frio'} 
                                            />
                                        </td>
                                    )}
                                    {isVisible(columns, 'origen') && (
                                        <td className="px-1 py-3 border border-slate-200">
                                            <span className="px-1.5 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-[7px] font-black text-slate-400 uppercase tracking-tight">{(row as any).cliente?.origen || 'Piso'}</span>
                                        </td>
                                    )}
                                    {isVisible(columns, 'cat') && (
                                        <td className="px-1 py-3 border border-slate-200">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => setSelectedApartadoForVehicle(row.id_venta)}
                                                    onMouseEnter={(e) => handleMouseEnter(e, row.id_carro)}
                                                    onMouseLeave={handleMouseLeave}
                                                    className="flex flex-col gap-0.5 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 p-2 rounded-xl transition-all flex-1 text-left group/unit shadow-sm"
                                                >
                                                    <span className="text-[10px] font-black text-slate-900 truncate max-w-[120px] leading-tight">{row.modelo || 'Sin unidad'}</span>
                                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">{row.marca || 'Seleccionar'}</span>
                                                </button>
                                                {row.id_carro && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateApartadoFieldAction(row.id_venta, 'id_carro', null);
                                                        }}
                                                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                                        title="Eliminar selección"
                                                    >
                                                        <XCircle className="size-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    {isVisible(columns, 'avaluo') && (
                                        <td className="px-2 py-3 border border-slate-200">
                                            {row.id_avaluo ? (
                                                <div className="flex items-center gap-1">
                                                    <Link 
                                                        href={`/avaluos/${row.id_avaluo}`}
                                                        className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[8px] uppercase tracking-widest hover:bg-emerald-100 transition-all flex-1"
                                                    >
                                                        <DollarSign className="size-3" />
                                                        <span>Ver</span>
                                                    </Link>
                                                    <button 
                                                        onClick={() => {
                                                            if (confirm('¿Desvincular avalúo de este seguimiento?')) {
                                                                updateApartadoFieldAction(row.id_venta, 'id_avaluo', null);
                                                            }
                                                        }}
                                                        className="p-1 px-2 rounded-lg bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                        title="Eliminar vinculación"
                                                    >
                                                        <XCircle className="size-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setSelectedApartadoForAvaluo(row)}
                                                    className="flex items-center gap-2 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-black text-[8px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all group/av"
                                                >
                                                    <DollarSign className="size-3" />
                                                    <span>Registrar</span>
                                                </button>
                                            )}
                                        </td>
                                    )}
                                    {isVisible(columns, 'ofrecimiento') && (
                                        <td className="px-1 py-3 border border-slate-200">
                                            {(row as any).avaluo_monto_oferta ? (
                                                <div className="flex flex-col">
                                                  <span className="text-[9px] font-black text-slate-900 leading-tight">
                                                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format((row as any).avaluo_monto_oferta)}
                                                  </span>
                                                  <span className="text-[6px] text-emerald-500 font-bold uppercase tracking-tight leading-none">Oferta</span>
                                                </div>
                                            ) : (
                                                <span className="text-[8px] font-bold text-slate-200 uppercase italic">S/O</span>
                                            )}
                                        </td>
                                    )}
                                    {isVisible(columns, 'acudio') && (
                                        <EditableCheckbox 
                                            id={row.id_venta} 
                                            field="acudio_cita" 
                                            initialValue={row.acudio_cita} 
                                            onceOnly={true} 
                                            onToggle={async (val) => {
                                                if (val && !row.fecha_primera_cita) {
                                                    await updateApartadoFieldAction(row.id_venta, 'fecha_primera_cita', new Date().toISOString().split('T')[0]);
                                                }
                                            }}
                                        />
                                    )}
                                    {isVisible(columns, 'fecha_primera_cita') && (
                                        row.acudio_cita ? (
                                            <EditableCell 
                                                id={row.id_venta} 
                                                field="fecha_primera_cita" 
                                                initialValue={row.fecha_primera_cita ? new Date(row.fecha_primera_cita).toISOString().split('T')[0] : ''} 
                                                type="date"
                                            />
                                        ) : (
                                            <td className="px-2 py-3 border border-slate-200">
                                                <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest italic">Pendiente</span>
                                            </td>
                                        )
                                    )}
                                    {isVisible(columns, 'demo') && (
                                        <EditableCheckbox id={row.id_venta} field="hizo_demo" initialValue={row.hizo_demo} onceOnly={true} />
                                    )}
                                    {isVisible(columns, 'cotizacion') && (
                                        <FileUploadCell id={row.id_venta} field="cotizacion_url" initialUrl={row.cotizacion_url} />
                                    )}
                                    {isVisible(columns, 'cotizacion_realizada') && (
                                        <EditableCheckbox id={row.id_venta} field="cotizacion_realizada" initialValue={row.cotizacion_realizada || false} />
                                    )}
                                    {isVisible(columns, 'credito') && (
                                        <td className="px-0.5 py-2 border border-slate-200">
                                            <select 
                                                defaultValue={row.banco_financiera || ""}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'banco_financiera', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[9px] font-black text-slate-900 w-full outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            >
                                                <option value="">Cualquier Institución</option>
                                                <option value="RAPIDAUTO">RapidAuto</option>
                                                <option value="CREDITOGO">Creditogo</option>
                                                <option value="SANTANDER">Santander</option>
                                                <option value="AFIRME">Afirme</option>
                                                <option value="BANCOMER">Bancomer</option>
                                                <option value="SCOTIABANK">Scotiabank</option>
                                                <option value="BANREGIO">Banregio</option>
                                                <option value="BANORTE">Banorte</option>
                                                <option value="CAJA POPULAR">Caja Popular</option>
                                                <option value="OTRO">Otro</option>
                                            </select>
                                        </td>
                                    )}
                                    {isVisible(columns, 'estatus_credito') && (
                                          <td className="px-0.5 py-2 border border-slate-200">
                                            <select 
                                                defaultValue={row.estatus_credito || 'frio'}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'estatus_credito', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[9px] font-black text-slate-900 w-full outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase"
                                            >
                                                <option value="frio">Frio</option>
                                                <option value="medio">Medio</option>
                                                <option value="caliente">Caliente</option>
                                                <option value="aprobado">Aprobado</option>
                                                <option value="rechazado">Rechazado</option>
                                            </select>
                                        </td>
                                    )}
                                    {isVisible(columns, 'metodo_pago') && (
                                        <td className="px-0.5 py-2 border border-slate-200">
                                            <select 
                                                defaultValue={row.metodo_pago || ''}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'metodo_pago', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[9px] font-black text-slate-900 w-full outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase"
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="contado">Contado</option>
                                                <option value="credito_bancario">Crédito</option>
                                            </select>
                                        </td>
                                    )}
                                    {isVisible(columns, 'monto_apartado') && (
                                        <EditableCell 
                                            id={row.id_venta} 
                                            field="monto_apartado" 
                                            initialValue={row.monto_apartado || 0} 
                                            type="number"
                                        />
                                    )}
                                    {isVisible(columns, 'apartado') && (
                                        <EditableCheckbox id={row.id_venta} field="apartado_realizado" initialValue={row.apartado_realizado || false} />
                                    )}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Floating Popups */}
            <VehicleDetailPopup 
                auto={hoveredAuto}
                anchorRect={anchorRect}
                isVisible={isHovering}
                onMouseEnter={() => {
                    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
                    setIsHovering(true);
                }}
                onMouseLeave={handleMouseLeave}
            />

            {selectedApartadoForVehicle && (
                <VehicleSelectorModal 
                    isOpen={true}
                    onClose={() => setSelectedApartadoForVehicle(null)}
                    onSelect={async (auto) => {
                        await updateApartadoFieldAction(selectedApartadoForVehicle, 'id_carro', auto.id);
                        setSelectedApartadoForVehicle(null);
                    }}
                    searchAction={getAvailableAutosAction}
                />
            )}

            {selectedApartadoForComments && (
                <CommentsModal 
                    isOpen={true}
                    onClose={() => setSelectedApartadoForComments(null)}
                    id_venta={selectedApartadoForComments.id_venta}
                    initialComments={selectedApartadoForComments.comentarios_vendedor || ''}
                />
            )}

            {selectedApartadoForAvaluo && (
                <AvaluoRegistrationModal 
                    isOpen={true}
                    onClose={() => setSelectedApartadoForAvaluo(null)}
                    id_venta={selectedApartadoForAvaluo.id_venta}
                    id_cliente={selectedApartadoForAvaluo.id_cliente}
                    id_vendedor={selectedApartadoForAvaluo.id_vendedor}
                    clientName={(selectedApartadoForAvaluo as any).cliente?.nombre || 'Desconocido'}
                />
            )}
        </div>
    );
}

function isVisible(columns: Column[], id: string) {
    return !!columns.find(c => c.id === id)?.visible;
}

function EditableCell({ id, field, initialValue, type }: { id: number, field: string, initialValue: any, type: string }) {
    const router = useRouter();
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handleBlur = () => {
        if (value === initialValue) return;
        startTransition(async () => {
            const res = await updateApartadoFieldAction(id, field, value);
            if (res.success) { 
                setSaved(true); 
                router.refresh(); // Sync UI
                setTimeout(() => setSaved(false), 2000); 
            }
        });
    };

    return (
        <td className="px-0.5 py-1 min-w-[50px] relative border border-slate-200 group/cell">
            <div className="flex items-center gap-1">
                {type === 'textarea' ? (
                    <textarea 
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        rows={2}
                        placeholder="Escribir bitácora..."
                        className="bg-transparent border-none outline-none text-xs font-medium text-slate-500 focus:text-slate-900 w-full resize-none placeholder:text-slate-200 focus:bg-slate-50 p-2 rounded-xl transition-all group-hover/cell:bg-slate-50/50"
                    />
                ) : (
                    <input 
                        type={type}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        className="bg-transparent border-none outline-none text-[9px] font-black text-slate-900 w-full focus:bg-slate-50 p-1 rounded-lg transition-all group-hover/cell:bg-slate-50/50"
                    />
                )}
                {isPending && <Loader2 className="size-3 text-indigo-500 animate-spin absolute right-3" />}
                {saved && <Check className="size-3 text-emerald-500 absolute right-3 animate-in zoom-in" />}
            </div>
        </td>
    );
}

function EditableCheckbox({ id, field, initialValue, onceOnly = false, onToggle }: { id: number, field: string, initialValue: boolean, onceOnly?: boolean, onToggle?: (val: boolean) => void }) {
    const [checked, setChecked] = useState(initialValue);
    const [isPending, startTransition] = useTransition();

    const isLocked = onceOnly && initialValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLocked) return;
        const val = e.target.checked;
        setChecked(val);
        startTransition(async () => {
            await updateApartadoFieldAction(id, field, val);
            if (onToggle) onToggle(val);
        });
    };

    return (
        <td className="px-0.5 py-2 border border-slate-200 text-center">
            <div className="flex items-center justify-center">
                <input 
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={isLocked || isPending}
                    className="size-5 rounded-lg border-slate-200 bg-slate-50 text-indigo-500 focus:ring-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                />
            </div>
        </td>
    );
}

function EditableProbabilidadCell({ id_cliente, initialValue }: { id_cliente: number, initialValue: string }) {
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();

    const colors: any = {
        'rechazo': 'bg-red-600 text-white border-red-700',
        'frio': 'bg-sky-400 text-white border-sky-500',
        'medio': 'bg-yellow-400 text-slate-900 border-yellow-500',
        'alto': 'bg-emerald-500 text-white border-emerald-600',
        'venta': 'bg-[var(--color-primary)] text-white border-transparent',
    };

    const handleChange = (e: any) => {
        const val = e.target.value;
        setValue(val);
        startTransition(async () => {
            await updateClientFieldAction(id_cliente, 'probabilidad', val);
        });
    };

    return (
        <div className="relative flex items-center gap-2">
            <select 
                value={value}
                onChange={handleChange}
                disabled={isPending}
                className={`px-1.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-tight border outline-none transition-all cursor-pointer shadow-sm ${colors[value] || 'bg-slate-50 text-slate-400 border-slate-200'}`}
            >
                <option value="rechazo">Rechazo</option>
                <option value="frio">Frio</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
                <option value="venta">Venta</option>
            </select>
            {isPending && <Loader2 className="size-3 text-indigo-500 animate-spin" />}
        </div>
    );
}

function FileUploadCell({ id, field, initialUrl }: { id: number, field: string, initialUrl?: string }) {
    const [url, setUrl] = useState(initialUrl);
    const [isPending, startTransition] = useTransition();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.[0];
        if (!file) return;
        startTransition(async () => {
            if (file!.type.startsWith('image/')) file = await optimizeImage(file!);
            const formData = new FormData();
            formData.append('file', file!);
            const res = await uploadApartadoDocumentAction(id, field, formData);
            if (res.success) setUrl(res.url);
        });
    };

    const handleDelete = async () => {
        if (!confirm('¿Eliminar documento?')) return;
        startTransition(async () => {
            const res = await deleteApartadoDocumentAction(id, field);
            if (res.success) setUrl(undefined);
        });
    };

    return (
        <td className="px-0.5 py-2 border border-slate-200">
            <div className="flex items-center gap-1 min-w-[60px]">
                {url ? (
                    <div className="flex items-center gap-2 group/file">
                        <a href={url} target="_blank" className="size-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
                            <FileText className="size-4" />
                        </a>
                        <button onClick={handleDelete} className="size-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                            <X className="size-3" />
                        </button>
                    </div>
                ) : (
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl border border-slate-200 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm">
                        <input type="file" className="hidden" onChange={handleUpload} disabled={isPending} />
                        {isPending ? <Loader2 className="size-3 animate-spin" /> : <FileUp className="size-3" />}
                        {isPending ? '...' : 'Subir'}
                    </label>
                )}
            </div>
        </td>
    );
}
