import { BottomNav } from "@/presentation/components/organisms/BottomNav";
import { MySQLAvaluoRepository } from "@/infrastructure/repositories/MySQLAvaluoRepository";
import { 
    Bell, 
    Calendar, 
    MapPin, 
    Plus, 
    Search,
    Car as CarIcon
} from "lucide-react";
import Link from "next/link";
import { SubEstadoAvaluo } from "@/core/domain/entities/Avaluo";
import { redirect } from "next/navigation";
import { getSession } from "@/core/usecases/authService";

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ tab?: string }>;
}

export default async function AvaluosPage({ searchParams }: Props) {
    const session = await getSession();
    const role = session?.role as string;

    if (role === 'vendedor') {
        redirect('/');
    }
    
    const { tab } = await searchParams;
    const repo = new MySQLAvaluoRepository();
    
    // Si el tab es 'todos', no filtramos. De lo contrario, filtramos por el estado.
    const currentTab = tab || 'todos';
    const filter = currentTab !== 'todos' ? { sub_estado_avaluo: currentTab } : undefined;
    
    const avaluos = await repo.getAll(filter);

    const tabs: { id: string; label: string }[] = [
        { id: 'todos', label: 'Todos' },
        { id: 'frio', label: 'Frío' },
        { id: 'medio', label: 'Medio' },
        { id: 'alto', label: 'Alto' },
        { id: 'toma', label: 'Toma' },
    ];

    const getStatusStyles = (status: SubEstadoAvaluo) => {
        switch (status) {
            case 'frio': return 'border-blue-500/30 text-blue-400 bg-blue-500/10';
            case 'medio': return 'border-orange-500/30 text-orange-400 bg-orange-500/10';
            case 'alto': return 'border-red-500/30 text-red-400 bg-red-500/10';
            case 'toma': return 'border-[var(--color-primary)]/30 text-[var(--color-primary)] bg-[var(--color-primary)]/10';
            default: return 'border-zinc-700 text-zinc-400 bg-zinc-800';
        }
    };

    const formatCurrency = (val?: number) => val ? `$${val.toLocaleString('es-MX')}` : '$0';

    return (
        <div className="bg-zinc-950 text-neutral-50 h-screen w-full flex flex-col overflow-hidden">
            {/* Contenedor Scrollable */}
            <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
                <div className="flex px-6 pt-2 pb-6 flex-col gap-6 max-w-md mx-auto">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center py-2">
                        <h1 className="font-bold text-neutral-50 text-2xl leading-8">Avalúos</h1>
                        <div className="flex items-center gap-2">
                            <Link 
                                href="/avaluos/nuevo" 
                                className="font-semibold rounded-lg bg-[var(--color-primary)] hover:bg-[#ffe040] transition-colors text-[var(--color-primary-dark)] text-sm leading-5 flex px-4 py-2 items-center gap-2"
                            >
                                <Plus className="size-4" />
                                <span>Nuevo</span>
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                        <input 
                            placeholder="Buscar por vehículo o cliente..."
                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all font-medium"
                        />
                    </div>

                    {/* Tabs de Filtro */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                        {tabs.map((t) => {
                            const isActive = currentTab === t.id;
                            return (
                                <Link 
                                    key={t.id}
                                    href={`/avaluos?tab=${t.id}`}
                                    className={`
                                        whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all border
                                        ${isActive 
                                            ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] border-transparent scale-105 shadow-lg shadow-[var(--color-primary)]/20' 
                                            : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10'
                                        }
                                    `}
                                >
                                    {t.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Lista de Tarjetas */}
                    <div className="flex flex-col gap-4">
                        {avaluos.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center opacity-40">
                                <CarIcon className="size-12 mb-4" />
                                <p className="text-sm font-medium">No hay avalúos en esta etapa</p>
                            </div>
                        ) : avaluos.map((av) => (
                            <div 
                                key={av.id}
                                className="rounded-3xl bg-zinc-900/50 border border-white/5 p-5 flex flex-col gap-5 hover:bg-zinc-900 transition-colors group shadow-sm"
                            >
                                {/* Card Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-0.5">
                                        <h3 className="font-bold text-neutral-50 text-base leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                                            {av.marca} {av.modelo} {av.anio}
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                                            Origen: <span className="text-zinc-400 capitalize">{av.origen_prospeccion || 'Desconocido'}</span>
                                        </p>
                                    </div>
                                    <div className={`
                                        font-black uppercase rounded-full text-[9px] px-3 py-1 border tracking-widest
                                        ${getStatusStyles(av.sub_estado_avaluo)}
                                    `}>
                                        {av.sub_estado_avaluo}
                                    </div>
                                </div>

                                {/* Financials Content */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="uppercase text-zinc-500 text-[9px] font-black tracking-tighter">Oferta</span>
                                        <span className="font-bold text-neutral-50 text-sm">{formatCurrency(av.oferta)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="uppercase text-zinc-500 text-[9px] font-black tracking-tighter">Venta Est.</span>
                                        <span className="font-bold text-[var(--color-primary)] text-sm">{formatCurrency(av.venta)}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 border-l border-white/5 pl-2">
                                        <span className="uppercase text-zinc-500 text-[9px] font-black tracking-tighter">Margen</span>
                                        <span className="font-bold text-neutral-50 text-sm">
                                            {formatCurrency((av.venta || 0) - (av.oferta || 0))}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="flex pt-4 border-t border-white/5 justify-between items-center text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-3" />
                                        <span className="text-[10px] font-bold">
                                            {new Date(av.fecha_registro).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{av.ubicacion || 'Sin Sucursal'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
