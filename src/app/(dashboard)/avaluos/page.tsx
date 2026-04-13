import { MySQLAvaluoRepository } from "@/infrastructure/repositories/MySQLAvaluoRepository";
import { 
    Calendar, 
    Plus, 
    Search,
    ChevronRight,
    Car as CarIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

    const getCoverPhotoURL = (fotos_url: any) => {
        let coverPhoto = "https://images.unsplash.com/photo-1642130204821-74126d1cb88e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBDb3JvbGxhJTIwd2hpdGUlMjBzZWRhbiUyMGNhcnxlbnwxfDJ8fHwxNzc1NzUwMzUyfDA&ixlib=rb-4.1.0&q=80&w=400";
        if (!fotos_url) return coverPhoto;
        try {
            let parsedUrl = "";
            if (typeof fotos_url === "string") {
                try {
                    const parsed = JSON.parse(fotos_url);
                    if (Array.isArray(parsed) && parsed.length > 0) parsedUrl = parsed[0];
                    else if (typeof parsed === "string") parsedUrl = parsed;
                } catch {
                    parsedUrl = fotos_url;
                }
            } else if (Array.isArray(fotos_url) && fotos_url.length > 0) {
                parsedUrl = fotos_url[0];
            }
            if (parsedUrl && (parsedUrl.startsWith("http://") || parsedUrl.startsWith("https://") || parsedUrl.startsWith("/"))) {
                return parsedUrl;
            }
        } catch (e) {}
        return coverPhoto;
    };

    return (
        <div className="px-6 py-12 lg:px-12 lg:py-16">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">
                
                {/* Header */}
                <div className="flex justify-between items-center bg-zinc-900/40 p-6 lg:p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center gap-5">
                       <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 shadow-xl shadow-[var(--color-primary)]/5">
                          <CarIcon className="size-7 text-[var(--color-primary)]" />
                       </div>
                       <div className="flex flex-col">
                          <h1 className="font-extrabold text-white text-3xl lg:text-4xl tracking-tight">Avalúos</h1>
                          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Gestión de inventario potencial</p>
                       </div>
                    </div>
                    <Link 
                        href="/avaluos/nuevo" 
                        className="font-black rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 active:scale-95 transition-all text-[var(--color-primary-dark)] text-sm px-8 py-4 flex items-center gap-2 shadow-xl shadow-[var(--color-primary)]/20 uppercase tracking-wider"
                    >
                        <Plus className="size-5" />
                        <span>Nuevo Avalúo</span>
                    </Link>
                </div>

                {/* Search & Tabs */}
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                    {/* Search Bar */}
                    <div className="relative group w-full lg:max-w-md">
                        <Search className="size-4 absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
                        <input 
                            placeholder="Buscar por vehículo o cliente..."
                            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all font-medium"
                        />
                    </div>

                    {/* Tabs de Filtro */}
                    <div className="flex items-center gap-3 p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                        {tabs.map((t) => {
                            const isActive = currentTab === t.id;
                            return (
                                <Link 
                                    key={t.id}
                                    href={`/avaluos?tab=${t.id}`}
                                    className={`
                                        whitespace-nowrap rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all
                                        ${isActive 
                                            ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20' 
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {t.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Lista de Tarjetas - Grid Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {avaluos.length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-zinc-900/20 rounded-[2rem] border border-dashed border-white/5">
                            <CarIcon className="size-16 mb-6 text-zinc-800" />
                            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm">No hay avalúos en esta etapa</p>
                        </div>
                    ) : avaluos.map((av) => (
                        <Link 
                            key={av.id}
                            href={`/avaluos/${av.id}`}
                            className="rounded-[2rem] bg-zinc-900/40 border border-white/5 p-6 flex flex-col gap-6 hover:bg-zinc-900 hover:border-[var(--color-primary)]/30 transition-all duration-300 group shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/5"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1 overflow-hidden">
                                    <h3 className="font-extrabold text-white text-xl lg:text-2xl leading-tight truncate group-hover:text-[var(--color-primary)] transition-colors">
                                        {av.marca} {av.year || av.anio}
                                    </h3>
                                    <p className="text-zinc-400 font-bold text-sm tracking-tight truncate">
                                        {av.modelo}
                                    </p>
                                </div>
                                <div className={`
                                    font-black uppercase rounded-full text-[9px] px-3 py-1 border tracking-[0.2em] shadow-sm
                                    ${getStatusStyles(av.sub_estado_avaluo)}
                                `}>
                                    {av.sub_estado_avaluo}
                                </div>
                            </div>

                            {/* Car Thumbnail */}
                            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 bg-zinc-950">
                                <Image 
                                    src={getCoverPhotoURL((av as any).fotos_url)}
                                    alt={av.marca}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Info Chips */}
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-zinc-800/80 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5">
                                    {av.origen_prospeccion || 'General'}
                                </span>
                                <span className="bg-zinc-800/80 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5">
                                    {av.ubicacion || 'Sucursal Principal'}
                                </span>
                            </div>

                            {/* Financials Box */}
                            <div className="grid grid-cols-3 gap-1 bg-zinc-950/60 p-4 rounded-3xl border border-white/5">
                                <div className="flex flex-col gap-1">
                                    <span className="uppercase text-zinc-600 text-[8px] font-black tracking-widest">Oferta</span>
                                    <span className="font-bold text-neutral-50 text-base tabular-nums truncate">{formatCurrency(av.oferta)}</span>
                                </div>
                                <div className="flex flex-col gap-1 px-2 border-x border-white/5">
                                    <span className="uppercase text-zinc-600 text-[8px] font-black tracking-widest">Venta Est.</span>
                                    <span className="font-bold text-[var(--color-primary)] text-base tabular-nums truncate">{formatCurrency(av.venta)}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="uppercase text-zinc-600 text-[8px] font-black tracking-widest">Margen</span>
                                    <span className="font-bold text-emerald-500 text-base tabular-nums truncate">
                                        {formatCurrency((av.venta || 0) - (av.oferta || 0))}
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="flex pt-4 border-t border-white/5 justify-between items-center">
                                <div className="flex items-center gap-2.5 text-zinc-500">
                                    <Calendar className="size-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {new Date(av.fecha_registro).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-primary-dark)] transition-all">
                                    <ChevronRight className="size-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
