'use client';

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
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
    FileUp
} from "lucide-react";
import { updateApartadoFieldAction, updateClientFieldAction, uploadApartadoDocumentAction, deleteApartadoDocumentAction } from "@/app/(dashboard)/apartados/actions";
import { optimizeImage } from "@/presentation/utils/imageUtils";
import { Apartado } from "@/core/domain/entities/Apartado";
import { Auto } from "@/core/domain/entities/Auto";
import { VehicleSelectorModal } from "../molecules/VehicleSelectorModal";
import { getAvailableAutosAction } from "@/app/(dashboard)/clientes/nuevo/actions";
import { VehicleDetailPopup } from "../molecules/VehicleDetailPopup";
import { getAutoByIdAction } from "@/core/usecases/autoService";

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface Props {
    data: Apartado[];
    vendedores: { id: number, nombre: string }[];
    canReassign?: boolean;
}

export function SeguimientosTable({ data, vendedores, canReassign = false }: Props) {
    const [columns, setColumns] = useState<Column[]>([
        { id: 'id_venta', label: 'ID', visible: true },
        { id: 'fecha_agregado', label: 'Fecha', visible: true },
        { id: 'seguimiento', label: 'Seguimiento', visible: true },
        { id: 'vendedor', label: 'Vendedor', visible: true },
        { id: 'cliente', label: 'Registro', visible: true },
        { id: 'telefono', label: 'Tel.', visible: true },
        { id: 'probabilidad', label: 'Prob.', visible: true },
        { id: 'origen', label: 'Origen', visible: true },
        { id: 'cat', label: 'Cat.', visible: true },
        { id: 'acudio', label: 'Acudió', visible: true },
        { id: 'demo', label: 'Demo', visible: true },
        { id: 'cotizacion', label: 'Cotización', visible: true },
        { id: 'credito', label: 'Crédito', visible: true },
        { id: 'estatus_credito', label: 'Estatus Créd.', visible: true },
        { id: 'avaluo', label: 'Avalúo', visible: true },
        { id: 'apartado', label: 'Apartado', visible: true },
        { id: 'ofrecimiento', label: 'Ofrecimiento', visible: true },
        { id: 'fecha_prox', label: 'Fecha Prox.', visible: true },
        { id: 'prox_seg', label: 'Prox. Seg.', visible: true },
        { id: 'comentarios', label: 'Comentarios', visible: true },
        { id: 'fecha_cita', label: 'Fecha Cita', visible: true },
    ]);

    const [showColumnPicker, setShowColumnPicker] = useState(false);
    const [selectedApartadoForVehicle, setSelectedApartadoForVehicle] = useState<number | null>(null);

    // Hover Tech Sheet State
    const [hoveredAuto, setHoveredAuto] = useState<Auto | null>(null);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, autoId: number | undefined) => {
        if (!autoId) return;
        
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        
        hoverTimerRef.current = setTimeout(async () => {
            const res = await getAutoByIdAction(autoId);
            if (res.success && res.auto) {
                setHoveredAuto(res.auto);
                setAnchorRect(rect);
                setIsHovering(true);
            }
        }, 1500); // Reduced to 1.5s for better UX
    };

    const handleMouseLeave = () => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        
        closeTimerRef.current = setTimeout(() => {
            setIsHovering(false);
        }, 300); // 300ms grace period to move to the popup
    };

    const handleMouseEnterPopup = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    const toggleColumn = (id: string) => {
        setColumns(cols => cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-6 lg:p-10">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl no-scrollbar overflow-x-auto shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-primary)]">Gestor de Seguimientos</h2>
                    <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase hidden sm:block">{data.length} Leads Encontrados</span>
                </div>

                <div className="flex items-center gap-2 relative">
                    <button 
                        onClick={() => setShowColumnPicker(!showColumnPicker)}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 shadow-sm active:scale-95 text-slate-600"
                    >
                        <Eye className="size-3.5" />
                        Opciones de Visión
                    </button>

                    {showColumnPicker && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl z-50 grid grid-cols-1 gap-2 animate-in zoom-in-95 duration-200">
                             <div className="flex justify-between items-center mb-2 px-1">
                                <span className="text-[10px] font-black uppercase text-slate-400">Columnas Visibles</span>
                                <button onClick={() => setShowColumnPicker(false)} className="text-[9px] font-bold text-slate-400 hover:text-slate-900">Cerrar</button>
                             </div>
                             <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1">
                                {columns.map(col => (
                                    <button 
                                        key={col.id} 
                                        onClick={() => toggleColumn(col.id)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${col.visible ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {col.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                                        {col.label}
                                    </button>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Table Container */}
            <div className="w-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse text-left min-w-[1800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {columns.filter(c => c.visible).map(col => (
                                    <th key={col.id} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row) => (
                                <tr key={row.id_venta} className="hover:bg-slate-50 transition-colors group">
                                    {columns.find(c => c.id === 'id_venta')?.visible && (
                                        <td className="p-4 text-[10px] font-bold text-slate-400">#{row.id_venta}</td>
                                    )}
                                    {columns.find(c => c.id === 'fecha_agregado')?.visible && (
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-900">
                                                    {row.fecha_actualizacion ? new Date(row.fecha_actualizacion).toLocaleDateString() : 'N/A'}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase">Agregado</span>
                                            </div>
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'seguimiento')?.visible && (
                                        <EditableCell 
                                            id={row.id_venta} 
                                            field="comentarios_vendedor" 
                                            initialValue={row.comentarios_vendedor || ''} 
                                            type="textarea"
                                        />
                                    )}
                                    {columns.find(c => c.id === 'vendedor')?.visible && (
                                        <td className="p-4 min-w-[150px]">
                                            <select 
                                                defaultValue={row.id_vendedor}
                                                disabled={!canReassign}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'id_vendedor', parseInt(e.target.value))}
                                                className="bg-slate-50 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2 text-[11px] font-bold text-slate-900 w-full outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-no-repeat"
                                            >
                                                {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                                            </select>
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'cliente')?.visible && (
                                        <td className="p-4">
                                            <Link 
                                                href={`/cliente/${(row as any).cliente?.id}`}
                                                className="group/client flex items-center gap-3 hover:opacity-80 transition-opacity"
                                            >
                                                <div className="size-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0 group-hover/client:border-[var(--color-primary)]/50 transition-colors">
                                                    <UserCircle className="size-5 text-slate-400 group-hover/client:text-[var(--color-primary)] transition-colors" />
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-900 truncate max-w-[120px] group-hover/client:text-[var(--color-primary)] transition-colors">
                                                    {(row as any).cliente?.nombre || 'Desconocido'}
                                                </span>
                                            </Link>
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'telefono')?.visible && (
                                         <td className="p-4">
                                            <a href={`tel:${(row as any).cliente?.telefono}`} className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-[var(--color-primary)] transition-colors">
                                                <Phone className="size-3" />
                                                {(row as any).cliente?.telefono}
                                            </a>
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'probabilidad')?.visible && (
                                        <td className="p-4">
                                            <EditableProbabilidadCell 
                                                id_cliente={(row as any).cliente?.id} 
                                                initialValue={(row as any).cliente?.probabilidad || 'frio'} 
                                            />
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'origen')?.visible && (
                                         <td className="p-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{(row as any).cliente?.origen || 'Piso'}</span>
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'cat')?.visible && (
                                        <td className="p-4 relative">
                                            <button 
                                                onClick={() => setSelectedApartadoForVehicle(row.id_venta)}
                                                onMouseEnter={(e) => handleMouseEnter(e, row.id_carro)}
                                                onMouseLeave={handleMouseLeave}
                                                className="flex flex-col bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 w-full text-left transition-all shadow-sm relative"
                                            >
                                                <span className="text-[11px] font-bold text-slate-900 truncate max-w-[140px]">{row.modelo || 'Sin unidad'}</span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase">{row.marca || 'Por definir'}</span>
                                                
                                                {/* Tooltip Indicator */}
                                                <div className="absolute -top-1 -right-1 size-3 bg-indigo-500 rounded-full border-2 border-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-sm" />
                                            </button>

                                            {/* Technical Sheet Popup */}
                                            {isHovering && hoveredAuto && hoveredAuto.id === row.id_carro && (
                                                <VehicleDetailPopup 
                                                    auto={hoveredAuto} 
                                                    anchorRect={anchorRect} 
                                                    onMouseEnter={handleMouseEnterPopup}
                                                    onMouseLeave={handleMouseLeave}
                                                />
                                            )}
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'acudio')?.visible && (
                                        <EditableCheckbox id={row.id_venta} field="acudio_cita" initialValue={row.acudio_cita} onceOnly={true} />
                                    )}
                                    {columns.find(c => c.id === 'demo')?.visible && (
                                        <EditableCheckbox id={row.id_venta} field="hizo_demo" initialValue={row.hizo_demo} onceOnly={true} />
                                    )}
                                     {columns.find(c => c.id === 'cotizacion')?.visible && (
                                        <FileUploadCell id={row.id_venta} field="cotizacion_url" initialUrl={row.cotizacion_url} />
                                    )}
                                    {columns.find(c => c.id === 'credito')?.visible && (
                                         <td className="p-4 min-w-[140px]">
                                            <select 
                                                defaultValue={row.banco_financiera || ''}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'banco_financiera', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold text-slate-900 w-full outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all uppercase"
                                            >
                                                <option value="CONTADO">CONTADO</option>
                                                <option value="RAPID">RAPID</option>
                                                <option value="CREDITOGO">CREDITOGO</option>
                                                <option value="SANTANDER">SANTANDER</option>
                                                <option value="AFIRME">AFIRME</option>
                                                <option value="BANCOMER">BANCOMER</option>
                                                <option value="SCOTIABANK">SCOTIABANK</option>
                                            </select>
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'estatus_credito')?.visible && (
                                          <td className="p-4 min-w-[130px]">
                                            <select 
                                                defaultValue={row.estatus_credito || 'frio'}
                                                onChange={(e) => updateApartadoFieldAction(row.id_venta, 'estatus_credito', e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold text-slate-900 w-full outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all uppercase"
                                            >
                                                <option value="frio">FRIO</option>
                                                <option value="medio">MEDIO</option>
                                                <option value="caliente">CALIENTE</option>
                                                <option value="aprobado">APROBADO</option>
                                                <option value="rechazado">RECHAZADO</option>
                                            </select>
                                        </td>
                                    )}
                                    {columns.find(c => c.id === 'avaluo')?.visible && (
                                        <EditableCheckbox id={row.id_venta} field="toma_a_cuenta" initialValue={row.toma_a_cuenta} />
                                    )}
                                    {columns.find(c => c.id === 'apartado')?.visible && (
                                        <EditableCheckbox id={row.id_venta} field="apartado_realizado" initialValue={row.apartado_realizado || false} />
                                    )}
                                    {columns.find(c => c.id === 'ofrecimiento')?.visible && (
                                        <EditableCell 
                                            id={row.id_venta} 
                                            field="ofrecimiento_cliente" 
                                            initialValue={row.ofrecimiento_cliente || 0} 
                                            type="number"
                                        />
                                    )}
                                    {columns.find(c => c.id === 'fecha_prox')?.visible && (
                                        <EditableCell 
                                            id={row.id_venta} 
                                            field="fecha_proximo_seguimiento" 
                                            initialValue={row.fecha_proximo_seguimiento ? new Date(row.fecha_proximo_seguimiento).toISOString().split('T')[0] : ''} 
                                            type="date"
                                        />
                                    )}
                                    {columns.find(c => c.id === 'prox_seg')?.visible && (
                                        <EditableCell 
                                            id={row.id_venta} 
                                            field="proximo_seguimiento_texto" 
                                            initialValue={row.proximo_seguimiento_texto || ''} 
                                            type="text"
                                        />
                                    )}
                                    {columns.find(c => c.id === 'comentarios')?.visible && (
                                         <td className="p-4">
                                            <span className="text-[10px] font-bold text-slate-400 line-clamp-2 max-w-[200px]">{(row as any).cliente?.comentarios_vendedor || '-'}</span>
                                         </td>
                                    )}
                                    {columns.find(c => c.id === 'fecha_cita')?.visible && (
                                        <EditableCell 
                                            id={row.id_venta} 
                                            field="fecha_primera_cita" 
                                            initialValue={row.fecha_primera_cita ? new Date(row.fecha_primera_cita).toISOString().split('T')[0] : ''} 
                                            type="date"
                                        />
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vehiculo Selector Modal Integration */}
            {selectedApartadoForVehicle && (
                <VehicleSelectorModal 
                    isOpen={!!selectedApartadoForVehicle}
                    onClose={() => setSelectedApartadoForVehicle(null)}
                    onSelect={async (auto) => {
                        await updateApartadoFieldAction(selectedApartadoForVehicle, 'id_carro', auto.id);
                        setSelectedApartadoForVehicle(null);
                    }}
                    searchAction={getAvailableAutosAction}
                />
            )}
        </div>
    );
}

function EditableCell({ id, field, initialValue, type }: { id: number, field: string, initialValue: any, type: string }) {
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handleBlur = () => {
        if (value === initialValue) return;
        startTransition(async () => {
            const res = await updateApartadoFieldAction(id, field, value);
            if (res.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        });
    };

    return (
        <td className="p-4 min-w-[150px] relative group">
            <div className="flex items-center gap-2">
                {type === 'textarea' ? (
                    <textarea 
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        rows={2}
                        className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-900 w-full resize-none placeholder:text-slate-300 focus:bg-slate-100/50 p-1 rounded transition-all"
                    />
                ) : (
                    <input 
                        type={type}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-900 w-full focus:bg-slate-100/50 p-1 rounded transition-all"
                    />
                )}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {isPending && <Loader2 className="size-3 text-[var(--color-primary)] animate-spin" />}
                    {saved && <Check className="size-3 text-emerald-500 animate-in zoom-in duration-300" />}
                </div>
            </div>
        </td>
    );
}

function EditableCheckbox({ id, field, initialValue, onceOnly = false }: { id: number, field: string, initialValue: boolean, onceOnly?: boolean }) {
    const [checked, setChecked] = useState(initialValue);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const isLocked = onceOnly && initialValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLocked) return;
        const val = e.target.checked;
        setChecked(val);
        startTransition(async () => {
            const res = await updateApartadoFieldAction(id, field, val);
            if (res.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        });
    };

    return (
        <td className="p-4 text-center">
            <div className="relative flex items-center justify-center">
                <input 
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={isLocked}
                    className={`size-4 rounded border-slate-200 bg-slate-50 text-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-all ${isLocked ? 'cursor-not-allowed opacity-100 grayscale-[0.5]' : 'cursor-pointer'}`}
                />
                {isPending && <Loader2 className="size-3 text-[var(--color-primary)] animate-spin absolute -right-4" />}
                {saved && <Check className="size-3 text-emerald-500 absolute -right-4 animate-in zoom-in duration-300" />}
            </div>
        </td>
    );
}

function EditableProbabilidadCell({ id_cliente, initialValue }: { id_cliente: number, initialValue: string }) {
    const [value, setValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const colors: any = {
        'frio': 'text-blue-500 bg-blue-500/10',
        'tibio': 'text-yellow-500 bg-yellow-500/10',
        'caliente': 'text-red-500 bg-red-500/10',
    };

    const handleChange = (e: any) => {
        const val = e.target.value;
        setValue(val);
        startTransition(async () => {
            const res = await updateClientFieldAction(id_cliente, 'probabilidad', val);
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
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 outline-none transition-all cursor-pointer ${colors[value] || 'bg-slate-50 text-slate-400'}`}
            >
                <option value="frio">Frio</option>
                <option value="tibio">Tibio</option>
                <option value="caliente">Caliente</option>
            </select>
            {isPending && <Loader2 className="size-3 text-[var(--color-primary)] animate-spin" />}
            {saved && <Check className="size-3 text-emerald-500" />}
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
            if (file!.type.startsWith('image/')) {
                file = await optimizeImage(file!);
            }
            const formData = new FormData();
            formData.append('file', file!);

            const res = await uploadApartadoDocumentAction(id, field, formData);
            if (res.success) {
                setUrl(res.url);
            }
        });
    };

    const handleDelete = async () => {
        startTransition(async () => {
            const res = await deleteApartadoDocumentAction(id, field);
            if (res.success) {
                setUrl(undefined);
            }
        });
    };

    return (
        <td className="p-4">
            <div className="flex items-center gap-2 min-w-[140px]">
                {url ? (
                    <div className="flex items-center gap-2 group/file w-full">
                        <a 
                            href={url} 
                            target="_blank" 
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all truncate max-w-[100px]"
                        >
                            <FileText className="size-3" />
                            Ver Doc
                        </a>
                        <button 
                            onClick={handleDelete}
                            disabled={isPending}
                            className="p-1.5 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all opacity-0 group-hover/file:opacity-100 disabled:opacity-50"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                ) : (
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg border border-slate-200 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer w-full justify-center shadow-sm">
                        <input type="file" className="hidden" onChange={handleUpload} disabled={isPending} />
                        {isPending ? <Loader2 className="size-3 animate-spin" /> : <FileUp className="size-3" />}
                        {isPending ? 'Subiendo...' : 'Subir'}
                    </label>
                )}
            </div>
        </td>
    );
}
