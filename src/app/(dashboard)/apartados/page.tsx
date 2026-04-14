import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { AlertTriangle, ChevronRight, Plus, Search, HandCoins, Car, Users } from "lucide-react";
import { SeguimientosTable } from "@/presentation/components/organisms/SeguimientosTable";
import Link from "next/link";
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
  const canReassign = ['director', 'gerente'].includes(role);

  const userRepo = new MySQLUserRepository();
  const vendedoresLista = isManagement ? await userRepo.findAllEligibleForSales() : (session?.userId ? [await userRepo.findById(session.userId as number)].filter(Boolean) as any[] : []);

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

  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams({
        ...(q && { q }),
        ...(tab !== 'todos' && { tab }),
        ...(vendedoresParams.length > 0 && { vendedores: vendedoresParams.join(',') }),
        ...updates
    });
    return `/apartados?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 lg:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-5">
               <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 shadow-xl shadow-[var(--color-primary)]/5">
                  <HandCoins className="size-8 text-[var(--color-primary)]" />
               </div>
               <div className="flex flex-col">
                  <h1 className="font-extrabold text-slate-900 text-3xl lg:text-4xl tracking-tight">Seguimientos</h1>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Control de trámites y cierre</p>
               </div>
            </div>
        </div>
        
        {/* Búsqueda y Filtros */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center">
            {/* Búsqueda */}
            <div className="relative group w-full lg:max-w-md">
                <form action="/apartados" method="GET" className="relative w-full">
                <Search className="size-4 top-1/2 -translate-y-1/2 text-slate-400 absolute left-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                    name="q"
                    defaultValue={q}
                    type="text"
                    placeholder="Buscar seguimientos..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all font-bold text-slate-900 shadow-sm"
                />
                {tab !== 'todos' && <input type="hidden" name="tab" value={tab} />}
                </form>
            </div>

            {/* Filtros de Seguimiento */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar max-w-full shadow-inner">
                <Link href={buildUrl({ tab: 'todos' })} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'todos' ? 'bg-white text-[var(--color-primary)] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                    Todos
                </Link>
                <Link href={buildUrl({ tab: 'hoy' })} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'hoy' ? 'bg-white text-[var(--color-primary)] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                    Hoy
                </Link>
                <Link href={buildUrl({ tab: 'semana' })} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'semana' ? 'bg-white text-[var(--color-primary)] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                    Semana
                </Link>
                <Link href={buildUrl({ tab: 'vencidos' })} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'vencidos' ? 'bg-red-500 text-white shadow-lg' : 'text-red-400 hover:text-red-600'}`}>
                    Vencidos
                </Link>
                {isManagement && (
                    <Link href={buildUrl({ tab: 'criticos' })} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${tab === 'criticos' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                        <AlertTriangle className="size-3.5" />
                        Críticos
                    </Link>
                )}
            </div>
        </div>

        {/* Filtro por Vendedor (Solo Director) */}
        {isDirector && vendedoresLista.length > 0 && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <Users className="size-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Filtrar por Asesor</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link 
                        href={buildUrl({ vendedores: '' })}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${vendedoresParams.length === 0 ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
                    >
                        Todos
                    </Link>
                    {vendedoresLista.map(v => {
                        const isSelected = vendedoresParams.includes(v.id);
                        const newVendedores = isSelected 
                            ? vendedoresParams.filter(id => id !== v.id)
                            : [...vendedoresParams, v.id];
                        
                        return (
                            <Link 
                                key={v.id}
                                href={buildUrl({ vendedores: newVendedores.join(',') })}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
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
                canReassign={canReassign}
            />
            {apartados.length === 0 && (
                <div className="py-32 text-center text-slate-400 text-sm bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm mt-6">
                    {tab === 'criticos' ? 'No hay seguimientos con rezago.' : 'No hay seguimientos registrados en esta categoría.'}
                </div>
            )}
        </div>
    </div>
  );
}
