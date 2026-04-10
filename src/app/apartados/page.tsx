import { BottomNav } from "@/presentation/components/organisms/BottomNav";
import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { AlertTriangle, ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/core/usecases/authService";

export const dynamic = 'force-dynamic';

export default async function ApartadosPage({ searchParams }: { searchParams: Promise<{ q?: string, tab?: 'todos' | 'hoy' | 'semana' | 'vencidos' | 'criticos' }> }) {
  const repo = new MySQLApartadoRepository();
  const autoRepo = new MySQLAutoRepository();
  const clientRepo = new MySQLClientRepository();

  const sp = await searchParams;
  const q = sp.q || "";
  const tab = sp.tab || "todos";

  const apartadosRaw = await repo.getAll({ search: q, tab });
  
  // Resolve joins dynamically
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

  const session = await getSession();
  const role = session?.role as string;
  const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(role);

  return (
    <div className="bg-[var(--color-surface-bg)] text-neutral-50 w-full min-h-[100dvh] overflow-hidden font-sans flex flex-col">
      <div className="overflow-y-auto flex px-6 pt-2 pb-24 flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex pt-2 justify-between items-center">
            <h1 className="font-bold text-neutral-50 text-2xl leading-8">
                Ventas
            </h1>
        </div>
        
        {/* Búsqueda */}
        <div className="relative">
            <form action="/apartados" method="GET" className="relative w-full">
              <Search className="size-4 top-1/2 -translate-y-1/2 text-[#9f9fa9] absolute left-4" />
              <input
                  name="q"
                  defaultValue={q}
                  type="text"
                  placeholder="Buscar por cliente o auto..."
                  className="outline-none rounded-xl bg-[var(--color-card-bg)] text-neutral-50 text-sm leading-5 border-white/10 hover:border-white/20 focus:border-[var(--color-primary)] transition-colors border pl-10 pr-4 py-3 w-full"
              />
              {tab !== 'todos' && <input type="hidden" name="tab" value={tab} />}
            </form>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-2 mt-2">
            <span className="font-medium uppercase text-[#9f9fa9] text-xs leading-4 tracking-wide">
                Filtros de Seguimiento
            </span>
            <div className="overflow-x-auto flex gap-2 pb-2 scrollbar-none">
                <Link href={`/apartados?tab=todos${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap font-semibold rounded-full text-xs leading-4 px-4 py-1.5 transition-colors ${tab === 'todos' ? 'bg-[#f0b100] text-[#733e0a]' : 'bg-zinc-800 text-[#9f9fa9]'}`}>
                    Todos
                </Link>
                <Link href={`/apartados?tab=hoy${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap font-semibold rounded-full text-xs leading-4 px-4 py-1.5 transition-colors ${tab === 'hoy' ? 'bg-[#f0b100] text-[#733e0a]' : 'bg-zinc-800 text-[#9f9fa9]'}`}>
                    Hoy
                </Link>
                <Link href={`/apartados?tab=semana${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap font-semibold rounded-full text-xs leading-4 px-4 py-1.5 transition-colors ${tab === 'semana' ? 'bg-[#f0b100] text-[#733e0a]' : 'bg-zinc-800 text-[#9f9fa9]'}`}>
                    Esta Semana
                </Link>
                <Link href={`/apartados?tab=vencidos${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap font-semibold rounded-full text-xs leading-4 px-4 py-1.5 transition-colors ${tab === 'vencidos' ? 'bg-[#f0b100] text-[#733e0a]' : 'bg-zinc-800 text-[#9f9fa9]'}`}>
                    Vencidos
                </Link>
                {isManagement && (
                    <Link href={`/apartados?tab=criticos${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap font-semibold rounded-full text-xs leading-4 px-4 py-1.5 transition-colors flex items-center gap-1.5 ${tab === 'criticos' ? 'bg-red-600 text-white' : 'bg-red-900/20 text-red-500 border border-red-500/20'}`}>
                        <AlertTriangle className="size-3" />
                        Críticos (+48h)
                    </Link>
                )}
            </div>
        </div>

        {/* Lista de Apartados */}
        <div className="flex flex-col gap-4">
            {apartados.length === 0 && (
                <div className="py-8 text-center text-[#9f9fa9] text-sm italic">
                    {tab === 'criticos' ? 'No hay ventas con rezago de seguimiento.' : 'No hay ventas en esta categoría.'}
                </div>
            )}
            
            {apartados.map(a => {
                const isVencido = a.fecha_proximo_seguimiento && new Date(a.fecha_proximo_seguimiento) < new Date();
                const diffMs = a.fecha_actualizacion ? new Date().getTime() - new Date(a.fecha_actualizacion).getTime() : 0;
                const isCritico = diffMs > (48 * 60 * 60 * 1000); // 48h
                
                return (
                <Link href={`/apartado/${a.id_venta}`} key={a.id_venta} className={`rounded-2xl bg-[var(--color-card-bg)] hover:bg-zinc-800 transition-all cursor-pointer border flex p-4 items-center gap-2 group ${isCritico && a.estatus_proceso === 'proceso' ? 'border-red-500/30 shadow-lg shadow-red-500/5' : 'border-white/10'}`}>
                    <div className="flex flex-col flex-1 gap-2">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-neutral-50 text-sm leading-5">
                                {a.cliente ? `${a.cliente.nombre}` : `Cliente Desconocido #${a.id_cliente}`}
                            </span>
                            {isManagement && (a as any).nombre_vendedor && (
                                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-medium">
                                    Vendedor: {(a as any).nombre_vendedor}
                                </span>
                            )}
                            <span className="font-bold rounded-full bg-[#f0b100]/20 text-[#f0b100] text-xs leading-4 px-2.5 py-0.5">
                                {a.monto_apartado ? formatPrice(Number(a.monto_apartado)) : '$0'}
                            </span>
                        </div>
                        {/* Contenedor de Interés */}
                        <div className="bg-zinc-950/50 rounded-xl p-3 border border-white/5 flex flex-col gap-1 my-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Unidad de Interés</span>
                            <span className="text-neutral-50 font-bold text-sm leading-tight">
                                {a.auto ? `${a.auto.marca} ${a.auto.modelo} ${a.auto.anio}` : `Auto #${a.id_carro}`}
                            </span>
                            {a.auto?.tipo && (
                                <span className="text-zinc-500 text-[10px] uppercase font-medium">
                                    Categoría: {a.auto.tipo}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <span className={`font-medium rounded-full ${a.acudio_cita ? 'bg-green-600/80 text-white' : 'bg-zinc-800 text-[#9f9fa9]'} text-xs leading-4 px-2 py-0.5`}>
                                Cita {a.acudio_cita ? '✓' : '✗'}
                            </span>
                            <span className={`font-medium rounded-full ${a.hizo_demo ? 'bg-green-600/80 text-white' : 'bg-zinc-800 text-[#9f9fa9]'} text-xs leading-4 px-2 py-0.5`}>
                                Demo {a.hizo_demo ? '✓' : '✗'}
                            </span>
                        </div>
                        
                        {a.fecha_proximo_seguimiento ? (
                            isVencido ? (
                                <span className="font-medium text-[#ff6467] text-xs leading-4 mt-1">
                                    Vencido · {formatDate(new Date(a.fecha_proximo_seguimiento))}
                                </span>
                            ) : (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="size-2 rounded-full bg-[#f0b100]" />
                                    <span className="text-[#9f9fa9] text-xs leading-4">
                                        Seguimiento: <span className="font-medium text-[#f0b100]">{formatDate(new Date(a.fecha_proximo_seguimiento))}</span>
                                    </span>
                                </div>
                            )
                        ) : (
                             <span className="text-[#9f9fa9] text-xs leading-4 mt-1 opacity-50">
                                Sin seguimiento agendado
                            </span>
                        )}
                    </div>
                    <ChevronRight className="size-5 flex-shrink-0 text-[#9f9fa9] group-hover:text-[var(--color-primary)] transition-colors" />
                </Link>
            )})}
        </div>
      </div>
      
      <BottomNav role={role} />
    </div>
  );
}
