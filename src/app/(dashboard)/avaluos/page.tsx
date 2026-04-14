import { MySQLAvaluoRepository } from "@/infrastructure/repositories/MySQLAvaluoRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { getSession } from "@/core/usecases/authService";
import AvaluosTable from "@/presentation/components/organisms/AvaluosTable";
import { Search, Car } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AvaluosPage({ searchParams }: { searchParams: Promise<{ q?: string, status?: 'todos' | 'frio' | 'medio' | 'alto' | 'toma' | 'rechazo', vendedores?: string }> }) {
  const repo = new MySQLAvaluoRepository();
  const userRepo = new MySQLUserRepository();
  
  const sp = await searchParams;
  const q = sp.q || "";
  const statusFilter = sp.status || "todos";
  const vendedoresParams = sp.vendedores ? sp.vendedores.split(',').filter(x => x).map(Number) : [];

  const session = await getSession();
  const role = session?.role as string;
  const isDirector = role === 'director';

  const filter = {
      search: q,
      status: statusFilter,
      vendedorId: !isDirector ? session?.userId as number : undefined,
      vendedorIds: isDirector && vendedoresParams.length > 0 ? vendedoresParams : undefined
  };

  const avaluos = await repo.getAll(filter);
  const vendedoresLista = isDirector 
    ? await userRepo.findAllByRole('vendedor') 
    : (session?.userId ? [await userRepo.findById(session.userId as number)].filter(Boolean) as any[] : []);

  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams({
        ...(q && { q }),
        ...(statusFilter !== 'todos' && { status: statusFilter }),
        ...(vendedoresParams.length > 0 && { vendedores: vendedoresParams.join(',') }),
        ...updates
    });
    if (updates.status === 'todos') params.delete('status');
    return `/avaluos?${params.toString()}`;
  };

  return (
    <div className="px-6 py-12 lg:px-12 lg:py-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Filtros de Búsqueda y Navegación Rápida */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="relative group w-full lg:max-w-md">
                <form action="/avaluos" method="GET" className="relative w-full">
                <Search className="size-4 top-1/2 -translate-y-1/2 text-slate-400 absolute left-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                    name="q"
                    defaultValue={q}
                    type="text"
                    placeholder="Buscar por marca o modelo..."
                    className="outline-none rounded-2xl bg-white text-slate-900 text-sm border-slate-200 hover:border-slate-300 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all border pl-12 pr-6 py-4 w-full font-bold shadow-sm"
                />
                </form>
            </div>

            <div className="flex flex-wrap gap-4 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner">
                <div className="flex items-center gap-1">
                    <Link href={buildUrl({ status: 'todos' })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${statusFilter === 'todos' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                        Todos
                    </Link>
                    {['frio', 'medio', 'alto', 'toma', 'rechazo'].map(s => (
                        <Link key={s} href={buildUrl({ status: s })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${statusFilter === s ? 'bg-white text-[var(--color-primary)] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                            {s}
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        {/* Tabla de Gestión Centralizada */}
        <AvaluosTable 
            data={avaluos} 
            vendedores={vendedoresLista} 
            isDirector={isDirector} 
        />

      </div>
    </div>
  );
}
