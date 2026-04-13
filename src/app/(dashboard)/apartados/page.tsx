import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { AlertTriangle, ChevronRight, Plus, Search, HandCoins, Car } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/core/usecases/authService";

export const dynamic = 'force-dynamic';

export default async function ApartadosPage({ searchParams }: { searchParams: Promise<{ q?: string, tab?: 'todos' | 'hoy' | 'semana' | 'vencidos' | 'criticos' }> }) {
  const repo = new MySQLApartadoRepository();
  const autoRepo = new MySQLAutoRepository();
  const clientRepo = new MySQLClientRepository();

  const sp = await searchParams;
  const q = sp.q || "";
  const tab = sp.tab || "todos";

  const session = await getSession();
  const role = session?.role as string;
  const isDirector = role === 'director';
  const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(role);

  const apartadosRaw = await repo.getAll({ 
    search: q, 
    tab, 
    vendedorId: !isDirector ? session?.userId as number : undefined 
  });

  const apartados = await Promise.all(
    apartadosRaw.map(async (a) => {
      const auto = a.id_carro ? await autoRepo.findById(a.id_carro) : null;
      const cliente = a.id_cliente ? await clientRepo.findById(a.id_cliente) : null;
      return { ...a, auto, cliente };
    })
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const getCoverPhotoURL = (auto: any) => {
    let coverPhoto = "https://images.unsplash.com/photo-1642130204821-74126d1cb88e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBDb3JvbGxhJTIwd2hpdGUlMjBzZWRhbiUyMGNhcnxlbnwxfDJ8fHwxNzc1NzUwMzUyfDA&ixlib=rb-4.1.0&q=80&w=400";
    if (!auto || !auto.fotos_url) return coverPhoto;
    try {
        let parsedUrl = "";
        if (typeof auto.fotos_url === "string") {
            try {
                const parsed = JSON.parse(auto.fotos_url);
                if (Array.isArray(parsed) && parsed.length > 0) parsedUrl = parsed[0];
                else if (typeof parsed === "string") parsedUrl = parsed;
            } catch {
                parsedUrl = auto.fotos_url;
            }
        } else if (Array.isArray(auto.fotos_url) && auto.fotos_url.length > 0) {
            parsedUrl = auto.fotos_url[0];
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
                  <HandCoins className="size-7 text-[var(--color-primary)]" />
               </div>
               <div className="flex flex-col">
                  <h1 className="font-extrabold text-white text-3xl lg:text-4xl tracking-tight">Ventas</h1>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Control de apartados y cierre</p>
               </div>
            </div>
            <Link 
                href="/clientes" 
                className="font-black rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-all text-white text-sm px-8 py-4 flex items-center gap-2 border border-white/5 shadow-xl uppercase tracking-wider"
            >
                <Plus className="size-5" />
                <span>Nueva Venta</span>
            </Link>
        </div>
        
        {/* Búsqueda y Filtros */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            {/* Búsqueda */}
            <div className="relative group w-full lg:max-w-md">
                <form action="/apartados" method="GET" className="relative w-full">
                <Search className="size-4 top-1/2 -translate-y-1/2 text-zinc-500 absolute left-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                    name="q"
                    defaultValue={q}
                    type="text"
                    placeholder="Buscar ventas..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all font-medium"
                />
                {tab !== 'todos' && <input type="hidden" name="tab" value={tab} />}
                </form>
            </div>

            {/* Filtros de Seguimiento */}
            <div className="flex items-center gap-3 p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                <Link href={`/apartados?tab=todos${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'todos' ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20' : 'text-zinc-500 hover:text-white'}`}>
                    Todos
                </Link>
                <Link href={`/apartados?tab=hoy${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'hoy' ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20' : 'text-zinc-500 hover:text-white'}`}>
                    Hoy
                </Link>
                <Link href={`/apartados?tab=semana${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'semana' ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20' : 'text-zinc-500 hover:text-white'}`}>
                    Semana
                </Link>
                <Link href={`/apartados?tab=vencidos${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'vencidos' ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-zinc-500 hover:text-white'}`}>
                    Vencidos
                </Link>
                {isManagement && (
                    <Link href={`/apartados?tab=criticos${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${tab === 'criticos' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-red-900/10 text-red-500 border border-red-500/10'}`}>
                        <AlertTriangle className="size-3.5" />
                        Críticos
                    </Link>
                )}
            </div>
        </div>

        {/* Lista de Apartados - Grid en Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartados.length === 0 && (
                <div className="col-span-full py-32 text-center text-zinc-500 text-sm bg-zinc-900/20 rounded-[2rem] border border-dashed border-white/5">
                    {tab === 'criticos' ? 'No hay ventas con rezago de seguimiento.' : 'No hay ventas registradas en esta categoría.'}
                </div>
            )}
            
            {apartados.map(a => {
                const isVencido = a.fecha_proximo_seguimiento && new Date(a.fecha_proximo_seguimiento) < new Date();
                const diffMs = a.fecha_actualizacion ? new Date().getTime() - new Date(a.fecha_actualizacion).getTime() : 0;
                const isCritico = diffMs > (48 * 60 * 60 * 1000); // 48h
                
                return (
                <Link href={`/apartado/${a.id_venta}`} key={a.id_venta} className={`rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-[var(--color-primary)]/50 transition-all duration-300 p-6 flex flex-col gap-5 group hover:bg-zinc-900 hover:shadow-2xl hover:shadow-[var(--color-primary)]/5 ${isCritico && a.estatus_proceso === 'proceso' ? 'border-red-500/30 ring-1 ring-red-500/20' : ''}`}>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1 overflow-hidden">
                                <span className="font-extrabold text-white text-lg line-clamp-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                                    {a.cliente ? `${a.cliente.nombre}` : `Cliente Desconocido`}
                                </span>
                                {isManagement && (a as any).nombre_vendedor && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        Asesor: {(a as any).nombre_vendedor}
                                    </span>
                                )}
                            </div>
                            <span className="font-black rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-dark)] text-xs px-3 py-1.5 shadow-lg shadow-[var(--color-primary)]/10">
                                {a.monto_apartado ? formatPrice(Number(a.monto_apartado)) : '$0'}
                            </span>
                        </div>

                        {/* Contenedor de Interés */}
                        <div className="bg-zinc-950/60 rounded-2xl p-3 border border-white/5 flex flex-col gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-70 ml-1">Unidad Seleccionada</span>
                            <div className="flex items-center gap-4">
                                <div className="size-16 rounded-xl overflow-hidden relative border border-white/10 shrink-0">
                                    {a.auto ? (
                                        <Image 
                                            src={getCoverPhotoURL(a.auto)} 
                                            alt={a.auto.modelo} 
                                            fill 
                                            className="object-cover" 
                                            sizes="64px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                                            <Car className="size-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-white font-bold text-sm leading-tight truncate">
                                        {a.auto ? `${a.auto.marca} ${a.auto.modelo}` : `Auto #${a.id_carro}`}
                                    </span>
                                    <span className="text-zinc-500 font-bold text-[10px] uppercase">
                                        {a.auto?.anio || 'S/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className={`font-black uppercase tracking-widest text-[9px] rounded-full px-3 py-1 border transition-colors ${a.acudio_cita ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-white/5 opacity-50'}`}>
                                Cita {a.acudio_cita ? '✓' : '✗'}
                            </span>
                            <span className={`font-black uppercase tracking-widest text-[9px] rounded-full px-3 py-1 border transition-colors ${a.hizo_demo ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-white/5 opacity-50'}`}>
                                Demo {a.hizo_demo ? '✓' : '✗'}
                            </span>
                        </div>
                        
                        <div className="pt-4 border-t border-white/5 mt-auto">
                            {a.fecha_proximo_seguimiento ? (
                                isVencido ? (
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertTriangle className="size-4 animate-pulse" />
                                        <span className="font-black uppercase tracking-widest text-[10px]">
                                            Vencido el {formatDate(new Date(a.fecha_proximo_seguimiento))}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <ChevronRight className="size-4 text-[var(--color-primary)]" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            Seguimiento: <span className="text-white">{formatDate(new Date(a.fecha_proximo_seguimiento))}</span>
                                        </span>
                                    </div>
                                )
                            ) : (
                                 <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">
                                    Sin agenda definida
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            )})}
        </div>
      </div>
    </div>
  );
}
