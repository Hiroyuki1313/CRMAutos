import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { AlertTriangle, ChevronRight, Plus, Search, HandCoins, Car, Users } from "lucide-react";
import { SeguimientosTable } from "@/presentation/components/organisms/SeguimientosTable";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/core/usecases/authService";

export const dynamic = 'force-dynamic';

export default async function ApartadosPage({ searchParams }: { searchParams: Promise<{ q?: string, tab?: 'todos' | 'hoy' | 'semana' | 'vencidos' | 'criticos', vendedores?: string }> }) {
  const repo = new MySQLApartadoRepository();
  const autoRepo = new MySQLAutoRepository();
  const clientRepo = new MySQLClientRepository();

  const sp = await searchParams;
  const q = sp.q || "";
  const tab = sp.tab || "todos";
  const vendedoresParams = sp.vendedores ? sp.vendedores.split(',').filter(x => x).map(Number) : [];

  const session = await getSession();
  const role = session?.role as string;
  const isDirector = role === 'director';
  const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(role);

  const userRepo = new MySQLUserRepository();
  const vendedoresLista = isManagement ? await userRepo.findAllByRole('vendedor') : (session?.userId ? [await userRepo.findById(session.userId as number)].filter(Boolean) as any[] : []);

  const apartadosRaw = await repo.getAll({ 
    search: q, 
    tab, 
    vendedorId: !isDirector ? session?.userId as number : undefined,
    vendedorIds: isDirector && vendedoresParams.length > 0 ? vendedoresParams : undefined
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
                  <h1 className="font-extrabold text-white text-3xl lg:text-4xl tracking-tight">Seguimientos</h1>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Control de trámites y cierre</p>
               </div>
            </div>
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
                    placeholder="Buscar seguimientos..."
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

        {/* Filtro por Vendedor (Solo Director) */}
        {isDirector && vendedoresLista.length > 0 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 px-2">
                    <Users className="size-3.5 text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Filtrar por Asesor</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link 
                        href={`/apartados?tab=${tab}${q ? `&q=${q}` : ''}`}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${vendedoresParams.length === 0 ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'}`}
                    >
                        Todos
                    </Link>
                    {vendedoresLista.map(v => {
                        const isSelected = vendedoresParams.includes(v.id);
                        const newVendedores = isSelected 
                            ? vendedoresParams.filter(id => id !== v.id)
                            : [...vendedoresParams, v.id];
                        
                        const vendedoresQuery = newVendedores.length > 0 ? `&vendedores=${newVendedores.join(',')}` : '';
                        
                        return (
                            <Link 
                                key={v.id}
                                href={`/apartados?tab=${tab}${q ? `&q=${q}` : ''}${vendedoresQuery}`}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20'}`}
                            >
                                {v.nombre}
                            </Link>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Lista de Seguimientos - Tabla Dinámica */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <SeguimientosTable 
                data={apartados} 
                vendedores={vendedoresLista}
            />
            {apartados.length === 0 && (
                <div className="py-32 text-center text-zinc-500 text-sm bg-zinc-900/20 rounded-[2rem] border border-dashed border-white/5 mt-6">
                    {tab === 'criticos' ? 'No hay seguimientos con rezago.' : 'No hay seguimientos registrados en esta categoría.'}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
