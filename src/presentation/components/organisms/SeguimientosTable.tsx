'use client';

import { useState, useTransition, useRef, useEffect } from "react";
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
    MessageCircle,
    HandCoins,
    Pencil,
    Globe
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
import { DollarSign, Plus } from "lucide-react";
import { NuevoSeguimientoModal } from "../molecules/NuevoSeguimientoModal";
import { ProspectoDetailModal } from "../molecules/ProspectoDetailModal";



interface Props {
    data: Apartado[];
    vendedores: { id: number, nombre: string }[];
    canReassign?: boolean;
    isDirector?: boolean;
    title?: string;
    subtitle?: string;
}

export function SeguimientosTable({ data, vendedores, canReassign = false, isDirector = false, title, subtitle }: Props) {
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

    const COLUMNS = [
        { id: 'id_venta', label: 'ID' },
        { id: 'fecha_agregado', label: 'Fecha de Registro' },
        { id: 'cliente', label: 'Nombre Cliente' },
        { id: 'vendedor', label: 'Asesor' },
        { id: 'fecha_prox', label: 'Fecha Próximo Seguimiento' },
        { id: 'prox_seg', label: 'Acción' },
        { id: 'fecha_prox_cita', label: 'Próxima Cita' },
        { id: 'telefono', label: 'Tel.' },
        { id: 'probabilidad', label: 'Prob.' },
        { id: 'origen', label: 'Origen' },
        { id: 'cat', label: 'Unidad' },
        { id: 'avaluo', label: 'Avalúo' },
        { id: 'ofrecimiento', label: 'Oferta Avalúo' },
        { id: 'acudio', label: 'Acudió' },
        { id: 'fecha_primera_cita', label: '1ra Cita' },
        { id: 'demo', label: 'Demo' },
        { id: 'cotizacion', label: 'Cot. Archivo' },
        { id: 'cotizacion_realizada', label: 'Cot. Realizada' },
        { id: 'credito', label: 'Financiera' },
        { id: 'estatus_credito', label: 'Estado de Crédito' },
        { id: 'metodo_pago', label: 'Pago' },
        { id: 'monto_apartado', label: 'Monto Apt.' },
        { id: 'apartado', label: 'Apt. Realizada' },
    ];

    const [showFilters, setShowFilters] = useState(false);
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);
    const [selectedApartadoForVehicle, setSelectedApartadoForVehicle] = useState<number | null>(null);
    const [selectedApartadoForComments, setSelectedApartadoForComments] = useState<Apartado | null>(null);
    const [selectedApartadoForAvaluo, setSelectedApartadoForAvaluo] = useState<Apartado | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedProspecto, setSelectedProspecto] = useState<Apartado | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Reset page when filters change
    const [lastQuery, setLastQuery] = useState(searchParams.toString());
    if (lastQuery !== searchParams.toString()) {
        setLastQuery(searchParams.toString());
        setCurrentPage(1);
    }

    // Hover Tech Sheet State
    const [hoveredAuto, setHoveredAuto] = useState<Auto | null>(null);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-search logic (Debounce)
    const [searchQuery, setSearchQuery] = useState(q);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== q) {
                router.push(buildUrl({ q: searchQuery }));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, q]);

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
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-700">
            
            {/* Unified Minimizable Header */}
            <div className="flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md overflow-hidden">
                
                {/* Row 1: Header (Always visible) */}
                <div className="flex items-center justify-between p-6 lg:p-8">
                    <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 shadow-inner shrink-0">
                            <HandCoins className="size-7 text-[var(--color-primary)]" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title || 'Seguimientos'}</h2>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {subtitle || `${data.length} trámites activos`}
                            </span>
                        </div>
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/20 hover:scale-105 active:scale-95"
                        >
                            <Plus className="size-4" />
                            <span>Nuevo Seguimiento</span>
                        </button>

                        <button
                            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                            className={`group flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${showFiltersPanel ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                        >
                            <div className={`transition-transform duration-500 ${showFiltersPanel ? 'rotate-180' : ''}`}>
                                {showFiltersPanel ? <ChevronDown className="size-4" /> : <Filter className="size-4" />}
                            </div>
                            <span>{showFiltersPanel ? 'Ocultar Herramientas' : 'Búsqueda y Filtros'}</span>
                            {activeFiltersCount > 0 && (
                                <span className="flex items-center justify-center size-5 bg-[var(--color-primary)] text-white rounded-full text-[8px] group-hover:scale-110 transition-transform">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Collapsible Toolset (Includes Advanced Filters) */}
                {showFiltersPanel && (
                    <div className="px-8 pb-8 flex flex-col gap-8 animate-in slide-in-from-top-4 duration-500">
                        {/* Ultra Simple Stacked Dropdown Filters */}
                        <div className="flex flex-col divide-y divide-slate-100 pt-8 border-t border-slate-100">
                            
                            {/* Row: Dates */}
                            <div className="flex items-center py-4 first:pt-0">
                                <div className="w-48 flex items-center gap-3 shrink-0">
                                    <Calendar className="size-4 text-[var(--color-primary)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rango Temporal</span>
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                    <input 
                                        type="date" 
                                        value={from}
                                        onChange={(e) => router.push(buildUrl({ from: e.target.value }))}
                                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all w-40 shadow-sm"
                                    />
                                    <ArrowRight className="size-3 text-slate-300" />
                                    <input 
                                        type="date" 
                                        value={to}
                                        onChange={(e) => router.push(buildUrl({ to: e.target.value }))}
                                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all w-40 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Row: Plazos (Dropdown) */}
                            <div className="flex items-center py-4">
                                <div className="w-48 flex items-center gap-3 shrink-0">
                                    <Clock className="size-4 text-red-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Plazo</span>
                                </div>
                                <div className="flex-1">
                                    <select 
                                        value={tab}
                                        onChange={(e) => router.push(buildUrl({ tab: e.target.value }))}
                                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-red-500/5 transition-all cursor-pointer shadow-sm appearance-none min-w-[240px]"
                                    >
                                        <option value="todos">Cualquier Plazo</option>
                                        <option value="vencidos">Vencidos</option>
                                        <option value="criticos">Críticos (Rezago Alto)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row: Probabilidad (Dropdown) */}
                            <div className="flex items-center py-4">
                                <div className="w-48 flex items-center gap-3 shrink-0">
                                    <Activity className="size-4 text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Probabilidad</span>
                                </div>
                                <div className="flex-1">
                                    <select 
                                        value={prob || 'todos'}
                                        onChange={(e) => router.push(buildUrl({ prob: e.target.value }))}
                                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer shadow-sm appearance-none min-w-[240px]"
                                    >
                                        <option value="todos">Cualquier Probabilidad</option>
                                        <option value="rechazo">Rechazo</option>
                                        <option value="frio">Frío</option>
                                        <option value="medio">Medio</option>
                                        <option value="alto">Alto</option>
                                        <option value="venta">Venta (Cerrado)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row: Financiera (Dropdown) */}
                            <div className="flex items-center py-4">
                                <div className="w-48 flex items-center gap-3 shrink-0">
                                    <HandCoins className="size-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Crédito</span>
                                </div>
                                <div className="flex-1">
                                    <select 
                                        value={credito || 'todos'}
                                        onChange={(e) => router.push(buildUrl({ credito: e.target.value }))}
                                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all cursor-pointer shadow-sm appearance-none min-w-[240px]"
                                    >
                                        <option value="todos">Cualquier Estatus</option>
                                        <option value="pendiente respuesta">Pendiente Respuesta</option>
                                        <option value="autorizado">Autorizado</option>
                                        <option value="rechazado">Rechazado</option>
                                        <option value="condicionado">Condicionado</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row: Origen (Dropdown) */}
                            <div className="flex items-center py-4">
                                <div className="w-48 flex items-center gap-3 shrink-0">
                                    <Globe className="size-4 text-sky-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Origen</span>
                                </div>
                                <div className="flex-1">
                                    <select 
                                        value={origen || 'todos'}
                                        onChange={(e) => router.push(buildUrl({ origen: e.target.value }))}
                                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-sky-500/5 transition-all cursor-pointer shadow-sm appearance-none min-w-[240px]"
                                    >
                                        <option value="todos">Cualquier Origen</option>
                                        <option value="digital">Digital</option>
                                        <option value="prospecto del asesor">Prospecto del Asesor</option>
                                        <option value="base de datos">Base de Datos</option>
                                        <option value="prospecciones de cartera">Pros. Cartera</option>
                                        <option value="prospectos de piso">Pros. Piso</option>
                                        <option value="puntos de venta">Puntos de Venta</option>
                                        <option value="recomendados">Recomendados</option>
                                        <option value="redes sociales propias">Redes Propias</option>
                                        <option value="ofrecimiento a cliente">Ofrecimiento</option>
                                        <option value="volanteo y cabezeo (seguimineto)">Volanteo/Cabezeo</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row: Asesor */}
                            {(isDirector || canReassign) && (
                                <div className="flex items-center py-4">
                                    <div className="w-48 flex items-center gap-3 shrink-0">
                                        <Users className="size-4 text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asesor</span>
                                    </div>
                                    <div className="flex-1">
                                        <select 
                                            value={vendedoresParam}
                                            onChange={(e) => router.push(buildUrl({ vendedores: e.target.value }))}
                                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer shadow-sm appearance-none min-w-[240px]"
                                        >
                                            <option value="">Cualquier Asesor</option>
                                            {vendedores.map(v => (
                                                <option key={v.id} value={v.id}>{v.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Row: Actions */}
                            <div className="flex items-center py-6 last:pb-0 gap-4">
                                <div className="w-48 shrink-0" />
                                <button 
                                    onClick={() => router.push('/apartados')}
                                    className="px-8 py-3.5 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 text-[10px] font-black uppercase tracking-widest transition-all border border-red-100"
                                >
                                    Limpiar Filtros
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Persistent Search Bar (Above Table) */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-4 mb-2">
                <div className="relative group w-full">
                    <Search className="size-4 top-1/2 -translate-y-1/2 text-slate-400 absolute left-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder="Buscar por nombre del cliente..."
                        className="outline-none rounded-xl bg-slate-50 text-slate-900 text-[11px] border-transparent hover:border-slate-200 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all border pl-12 pr-6 py-3 w-full font-bold"
                    />
                </div>
            </div>

            {/* Table Area (Expanded) */}
            <div className="bg-white rounded-t-[2.5rem] rounded-b-none border border-slate-200 border-b-0 shadow-xl shadow-slate-200/50 flex flex-col">
                <div className="flex-1">
                    <table className="w-full text-left border-collapse table-fixed border-2 border-slate-400">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {COLUMNS.map(col => {
                                    // Define specific widths for columns to ensure they all fit
                                    let width = "auto";
                                    if (col.id === 'id_venta') width = "40px";
                                    else if (col.id === 'fecha_agregado') width = "80px";
                                    else if (col.id === 'fecha_prox' || col.id === 'fecha_prox_cita' || col.id === 'fecha_primera_cita') width = "100px";
                                    else if (col.id === 'telefono') width = "90px";
                                    else if (col.id === 'probabilidad') width = "80px";
                                    else if (col.id === 'origen') width = "60px";
                                    else if (col.id === 'acudio' || col.id === 'demo' || col.id === 'cotizacion_realizada' || col.id === 'apartado') width = "45px";
                                    
                                    return (
                                        <th 
                                            key={col.id} 
                                            style={{ width }}
                                            className="px-1 py-4 text-[8px] font-black uppercase tracking-tight text-slate-600 border-x-2 border-b-2 border-slate-400 bg-slate-100 shadow-[inset_0_-1px_0_rgba(0,0,0,0.1)] whitespace-normal break-words leading-tight"
                                        >
                                            {col.label}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-400">
                            {paginatedData.map((row) => {
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
                                    <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                        <span className="text-[10px] font-bold text-slate-300">#{row.id_venta}</span>
                                    </td>
                                    <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-black text-slate-900">{new Date(row.fecha_actualizacion!).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</span>
                                            <span className="text-[8px] text-slate-400 font-bold uppercase">{new Date(row.fecha_actualizacion!).toLocaleDateString('es-MX', { year: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                         <div className="flex items-center justify-between gap-1 group/edit-container">
                                            <button 
                                                onClick={() => setSelectedProspecto(row)}
                                                className="flex flex-col gap-0 group/link flex-1 overflow-hidden text-left"
                                            >
                                                <span className="text-[9px] font-black text-slate-900 group-hover/link:text-indigo-600 transition-colors uppercase leading-tight">{(row as any).cliente?.nombre || row.nombre_prospecto || 'Desconocido'}</span>
                                            </button>
                                            {row.id_cliente && (
                                                <InlineEditableClientField 
                                                    id_cliente={row.id_cliente} 
                                                    field="nombre" 
                                                    initialValue={(row as any).cliente?.nombre || ''} 
                                                    isAuthorized={canReassign}
                                                />
                                            )}
                                         </div>
                                    </td>
                                    <EditableVendedorCell 
                                        key={`${row.id_venta}-vendedor-${row.id_vendedor}`}
                                        id={row.id_venta} 
                                        initialId={row.id_vendedor} 
                                        initialName={row.nombre_vendedor}
                                        vendedores={vendedores}
                                        canReassign={canReassign}
                                    />
                                    <EditableCell 
                                        key={`${row.id_venta}-fecha-${row.fecha_proximo_seguimiento?.toString()}`}
                                        id={row.id_venta} 
                                        field="fecha_proximo_seguimiento" 
                                        initialValue={row.fecha_proximo_seguimiento ? new Date(row.fecha_proximo_seguimiento).toISOString().split('T')[0] : ''} 
                                        type="date"
                                    />
                                    <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                        <div className="flex flex-col gap-0.5 cursor-pointer group/note"
                                             onClick={() => setSelectedApartadoForComments(row)}>
                                            <span className="text-[9px] font-bold text-slate-700 leading-tight whitespace-normal break-words group-hover/note:text-indigo-600 transition-colors">
                                                {lastNote || 'Sin acción'}
                                            </span>
                                        </div>
                                    </td>
                                    <EditableCell 
                                        key={`${row.id_venta}-prox-cita-${row.fecha_proxima_cita?.toString()}`}
                                        id={row.id_venta} 
                                        field="fecha_proxima_cita" 
                                        initialValue={row.fecha_proxima_cita 
                                            ? new Date(new Date(row.fecha_proxima_cita).getTime() - (new Date(row.fecha_proxima_cita).getTimezoneOffset() * 60000)).toISOString().slice(0, 16) 
                                            : ''} 
                                        type="datetime-local"
                                    />
                                    <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                        <div className="flex items-center justify-between gap-1 group/edit-container">
                                            <a href={`tel:${(row as any).cliente?.telefono || row.telefono_prospecto}`} className="text-[8px] font-black text-slate-500 hover:text-indigo-600 transition-colors whitespace-nowrap flex-1 overflow-hidden">
                                                {(row as any).cliente?.telefono || row.telefono_prospecto || '-'}
                                            </a>
                                            {row.id_cliente && (
                                                <InlineEditableClientField 
                                                    id_cliente={row.id_cliente} 
                                                    field="telefono" 
                                                    initialValue={(row as any).cliente?.telefono || ''} 
                                                    isAuthorized={canReassign}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                        <EditableProbabilidadCell 
                                            key={`${row.id_venta}-prob-${row.probabilidad}`}
                                            id_venta={row.id_venta} 
                                            initialValue={row.probabilidad || 'Frio'} 
                                        />
                                    </td>
                                    <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                        <span className="px-1 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-[7px] font-black text-slate-400 uppercase tracking-tight">{(row as any).cliente?.origen || row.origen_prospecto || 'Piso'}</span>
                                    </td>
                                    <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                        <div className="flex items-center gap-2 group/unit-cell">
                                            <button 
                                                onClick={() => setSelectedApartadoForVehicle(row.id_venta)}
                                                onMouseEnter={(e) => handleMouseEnter(e, row.id_carro)}
                                                onMouseLeave={handleMouseLeave}
                                                className="flex flex-col gap-0.5 text-left transition-all flex-1 min-w-0"
                                            >
                                                <span className="text-[9px] font-black text-slate-900 leading-tight break-words">{row.modelo || 'Sin unidad'}</span>
                                                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tight">{row.marca || 'S/M'}</span>
                                            </button>
                                            {row.id_carro && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateApartadoFieldAction(row.id_venta, 'id_carro', null);
                                                    }}
                                                    className="p-1 rounded-lg text-slate-300 hover:text-red-500 opacity-0 group-hover/unit-cell:opacity-100 transition-all"
                                                    title="Eliminar selección"
                                                >
                                                    <XCircle className="size-3" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                        <div className="flex items-center gap-1 group/av-cell">
                                            {row.id_avaluo ? (
                                                <>
                                                    <Link 
                                                        href={`/avaluos/${row.id_avaluo}`}
                                                        className="text-emerald-600 font-black text-[8px] uppercase tracking-widest hover:underline flex-1"
                                                    >
                                                        <span>Ver Avalúo</span>
                                                    </Link>
                                                    <button 
                                                        onClick={() => {
                                                            if (confirm('¿Desvincular avalúo de este seguimiento?')) {
                                                                updateApartadoFieldAction(row.id_venta, 'id_avaluo', null);
                                                            }
                                                        }}
                                                        className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/av-cell:opacity-100 transition-all"
                                                    >
                                                        <XCircle className="size-3" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => setSelectedApartadoForAvaluo(row)}
                                                    className="text-indigo-400 hover:text-indigo-600 font-black text-[7px] uppercase tracking-widest transition-all"
                                                >
                                                    + Registrar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
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
                                    {row.acudio_cita ? (
                                        <EditableCell 
                                            id={row.id_venta} 
                                            field="fecha_primera_cita" 
                                            initialValue={row.fecha_primera_cita ? new Date(row.fecha_primera_cita).toISOString().split('T')[0] : ''} 
                                            type="date"
                                        />
                                    ) : (
                                        <td className="px-2 py-3 border-2 border-slate-400 whitespace-normal break-words">
                                            <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest italic">Pendiente</span>
                                        </td>
                                    )}
                                    <EditableCheckbox id={row.id_venta} field="hizo_demo" initialValue={row.hizo_demo} onceOnly={true} />
                                    <FileUploadCell id={row.id_venta} field="cotizacion_url" initialUrl={row.cotizacion_url} />
                                    <EditableCheckbox id={row.id_venta} field="cotizacion_realizada" initialValue={row.cotizacion_realizada || false} />
                                    <td className="px-0.5 py-2 border-2 border-slate-400 whitespace-normal break-words group/cred-cell">
                                        <div className="relative">
                                            <div className="text-[8px] font-black text-slate-700 uppercase group-hover/cred-cell:hidden px-1">
                                                {row.banco_financiera || 'Sin inst.'}
                                            </div>
                                            <select 
                                                defaultValue={row.banco_financiera || ""}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'banco_financiera', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[8px] font-black text-slate-900 w-full outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all hidden group-hover/cred-cell:block appearance-none cursor-pointer"
                                            >
                                                <option value="">Ninguna</option>
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
                                        </div>
                                    </td>
                                      <td className="px-0.5 py-2 border-2 border-slate-400 whitespace-normal break-words group/est-cell">
                                        <div className="relative">
                                            <div className="text-[8px] font-black text-slate-700 uppercase group-hover/est-cell:hidden px-1">
                                                {row.estatus_credito || 'frio'}
                                            </div>
                                            <select 
                                                defaultValue={row.estatus_credito || 'pendiente respuesta'}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'estatus_credito', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[8px] font-black text-slate-900 w-full outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase hidden group-hover/est-cell:block appearance-none cursor-pointer"
                                            >
                                                <option value="pendiente respuesta">Pendiente Respuesta</option>
                                                <option value="autorizado">Autorizado</option>
                                                <option value="rechazado">Rechazado</option>
                                                <option value="condicionado">Condicionado</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-0.5 py-2 border-2 border-slate-400 whitespace-normal break-words group/pago-cell">
                                        <div className="relative">
                                            <div className="text-[8px] font-black text-slate-700 uppercase group-hover/pago-cell:hidden px-1">
                                                {row.metodo_pago || 'S/E'}
                                            </div>
                                            <select 
                                                defaultValue={row.metodo_pago || ''}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'metodo_pago', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[8px] font-black text-slate-900 w-full outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase hidden group-hover/pago-cell:block appearance-none cursor-pointer"
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="contado">Contado</option>
                                                <option value="credito_bancario">Crédito</option>
                                            </select>
                                        </div>
                                    </td>
                                    <EditableCell 
                                        id={row.id_venta} 
                                        field="monto_apartado" 
                                        initialValue={row.monto_apartado || 0} 
                                        type="number"
                                    />
                                    <EditableCheckbox id={row.id_venta} field="apartado_realizado" initialValue={row.apartado_realizado || false} />
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mostrar</span>
                            <select 
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                            >
                                {[5, 10, 20, 50, 100].map(v => (
                                    <option key={v} value={v}>{v} registros</option>
                                ))}
                            </select>
                        </div>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Mostrando <span className="text-slate-900">{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, data.length)}</span> de <span className="text-slate-900">{data.length}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Anterior
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum = currentPage;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`size-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900 shadow-sm'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Siguiente
                        </button>
                    </div>
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
                    clientName={(selectedApartadoForAvaluo as any).cliente?.nombre || selectedApartadoForAvaluo.nombre_prospecto || 'Desconocido'}
                />
            )}

            <NuevoSeguimientoModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {selectedProspecto && (
                <ProspectoDetailModal 
                    isOpen={true}
                    onClose={() => setSelectedProspecto(null)}
                    apartado={selectedProspecto}
                />
            )}
        </div>
    );
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
        <td className="px-0.5 py-1 min-w-[50px] relative border-2 border-slate-400 group/cell whitespace-normal break-words">
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
        <td className="px-0.5 py-2 border-2 border-slate-400 text-center whitespace-normal break-words">
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

function EditableVendedorCell({ id, initialId, initialName, vendedores, canReassign }: { id: number, initialId?: number, initialName?: string, vendedores: { id: number, nombre: string }[], canReassign: boolean }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value ? Number(e.target.value) : null;
        if (val === initialId) return;

        startTransition(async () => {
            const res = await updateApartadoFieldAction(id, 'id_vendedor', val);
            if (res.success) {
                setSaved(true);
                router.refresh();
                setTimeout(() => setSaved(false), 2000);
            }
        });
    };

    if (!canReassign) {
        return (
            <td className="px-1 py-3 border-2 border-slate-400 whitespace-normal break-words">
                <span className="text-[8px] font-black text-slate-700 leading-tight block">{initialName || 'S/A'}</span>
            </td>
        );
    }

    return (
        <td className="px-1 py-3 border-2 border-slate-400 group/vendedor relative whitespace-normal break-words">
            <div className="relative min-w-[80px]">
                <div className={`text-[8px] font-black text-slate-700 leading-tight group-hover/vendedor:hidden ${saved ? 'text-emerald-600' : ''}`}>
                    {initialName || 'Sin Asignar'}
                </div>
                <select 
                    defaultValue={initialId}
                    onChange={handleChange}
                    disabled={isPending}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-[8px] font-black text-slate-900 w-full outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all hidden group-hover/vendedor:block cursor-pointer appearance-none"
                >
                    <option value="">Sin Asignar</option>
                    {vendedores.map(v => (
                        <option key={v.id} value={v.id}>{v.nombre}</option>
                    ))}
                </select>
            </div>
        </td>
    );
}

function InlineEditableClientField({ id_cliente, field, initialValue, isAuthorized }: { id_cliente: number, field: string, initialValue: string, isAuthorized: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();

    if (!isAuthorized) return null;

    const handleSave = () => {
        if (value === initialValue) {
            setIsEditing(false);
            return;
        }
        startTransition(async () => {
            const res = await updateClientFieldAction(id_cliente, field, value);
            if (res.success) {
                setIsEditing(false);
            }
        });
    };

    if (isEditing) {
        return (
            <div className="flex items-center bg-white border border-indigo-200 rounded shadow-sm overflow-hidden min-w-[80px]">
                <input 
                    autoFocus
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    className="text-[9px] font-black px-1.5 py-0.5 outline-none w-full bg-indigo-50/10"
                />
                {isPending && <Loader2 className="size-2 text-indigo-500 animate-spin mr-1" />}
            </div>
        );
    }

    return (
        <button 
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover/edit-container:opacity-100 p-1 rounded hover:bg-slate-100 transition-all text-slate-300 hover:text-indigo-600 shrink-0"
            title="Editar campo"
        >
            <Pencil className="size-2.5" />
        </button>
    );
}

function EditableProbabilidadCell({ id_venta, initialValue }: { id_venta: number, initialValue: string }) {
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();

    const textColors: any = {
        'Rechazo': 'text-red-600',
        'Frio': 'text-sky-500',
        'Bajo': 'text-sky-300',
        'Medio': 'text-yellow-600',
        'Alto': 'text-emerald-600',
        'Venta': 'text-[var(--color-primary)]',
        'Largo Plazo': 'text-slate-500',
    };

    const handleChange = (e: any) => {
        const val = e.target.value;
        setValue(val);
        startTransition(async () => {
            await updateApartadoFieldAction(id_venta, 'probabilidad', val);
        });
    };

    return (
        <div className="relative group/prob">
            <div className={`text-[8px] font-black uppercase group-hover/prob:hidden ${textColors[value] || 'text-slate-400'}`}>
                {value}
            </div>
            <select 
                value={value}
                onChange={handleChange}
                disabled={isPending}
                className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-[8px] font-black text-slate-900 w-full outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all hidden group-hover/prob:block cursor-pointer appearance-none"
            >
                <option value="Frio">Frio</option>
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
                <option value="Venta">Venta</option>
                <option value="Rechazo">Rechazo</option>
                <option value="Largo Plazo">Largo Plazo</option>
            </select>
        </div>
    );
}

function FileUploadCell({ id, field, initialUrl }: { id: number, field: string, initialUrl?: string }) {
    const [url, setUrl] = useState(initialUrl);
    const [isPending, startTransition] = useTransition();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id_venta', id.toString());
        formData.append('field', field);

        startTransition(async () => {
            try {
                const res = await uploadApartadoDocumentAction(formData);
                if (res.success) {
                    setUrl(res.url);
                } else {
                    alert(res.error || 'Error al subir archivo');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión al subir archivo');
            }
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
        <td className="px-0.5 py-2 border-2 border-slate-400 whitespace-normal break-words group/file-cell">
            <div className="relative min-w-[60px]">
                {url ? (
                    <div className="flex items-center gap-2 group/file">
                        <a href={url} target="_blank" className="text-[8px] font-black text-indigo-600 hover:underline uppercase tracking-widest">
                            Ver Archivo
                        </a>
                        <button onClick={handleDelete} className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/file:opacity-100 transition-all">
                            <X className="size-3" />
                        </button>
                    </div>
                ) : (
                    <label className="text-[7px] font-black text-slate-300 hover:text-indigo-600 uppercase tracking-widest cursor-pointer transition-all">
                        <input type="file" className="hidden" onChange={handleUpload} disabled={isPending} />
                        {isPending ? 'Subiendo...' : '+ Subir'}
                    </label>
                )}
            </div>
        </td>
    );
}
