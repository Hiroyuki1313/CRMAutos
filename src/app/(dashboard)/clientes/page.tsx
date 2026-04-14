import { getSession } from "@/core/usecases/authService";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import ClientesTable from "@/presentation/components/organisms/ClientesTable";
import { Search, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string, origen?: 'todos' | 'ads' | 'piso' | 'redes', apartado?: 'con' | 'sin' | 'todos', prob?: 'todos' | 'frio' | 'tibio' | 'caliente', vendedores?: string }> }) {
  const session = await getSession();
  const repo = new MySQLClientRepository();
  const role = session?.role as string;
  const isDirector = role === 'director';
  
  const sp = await searchParams;
  const q = sp.q || "";
  const origen = sp.origen || "todos";
  const apartado = sp.apartado || "todos";
  const prob = sp.prob || "todos";
  const vendedoresParams = sp.vendedores ? sp.vendedores.split(',').filter(x => x).map(Number) : [];

  const userRepo = new MySQLUserRepository();
  const vendedoresLista = isDirector 
    ? await userRepo.findAllByRole('vendedor') 
    : (session?.userId ? [await userRepo.findById(session.userId as number)].filter(Boolean) as any[] : []);

  const clientes = await repo.getAll({ 
    search: q, 
    origen, 
    tiene_apartado: apartado, 
    probabilidad: prob, 
    vendedorId: !isDirector ? session?.userId as number : undefined,
    vendedorIds: isDirector && vendedoresParams.length > 0 ? vendedoresParams : undefined
  });

  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams({
        ...(q && { q }),
        ...(origen !== 'todos' && { origen }),
        ...(apartado !== 'todos' && { apartado }),
        ...(prob !== 'todos' && { prob }),
        ...(vendedoresParams.length > 0 && { vendedores: vendedoresParams.join(',') }),
        ...updates
    });
    if (updates.origen === 'todos') params.delete('origen');
    if (updates.apartado === 'todos') params.delete('apartado');
    if (updates.prob === 'todos') params.delete('prob');
    return `/clientes?${params.toString()}`;
  };

  return (
    <div className="px-6 py-12 lg:px-12 lg:py-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Filtros de Búsqueda y Navegación Rápida */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="relative group w-full lg:max-w-md">
                <form action="/clientes" method="GET" className="relative w-full">
                <Search className="size-4 top-1/2 -translate-y-1/2 text-slate-400 absolute left-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                    name="q"
                    defaultValue={q}
                    type="text"
                    placeholder="Buscar por nombre o teléfono..."
                    className="outline-none rounded-2xl bg-white text-slate-900 text-sm border-slate-200 hover:border-slate-300 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all border pl-12 pr-6 py-4 w-full font-bold shadow-sm"
                />
                </form>
            </div>

            <div className="flex flex-wrap gap-4 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner">
                <div className="flex items-center gap-1">
                    <Link href={buildUrl({ origen: 'todos' })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${origen === 'todos' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                        Orígenes
                    </Link>
                    {['ads', 'piso', 'redes'].map(o => (
                        <Link key={o} href={buildUrl({ origen: o })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${origen === o ? 'bg-white text-[var(--color-primary)] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                            {o}
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        {/* Tabla de Gestión Centralizada */}
        <ClientesTable 
            data={clientes} 
            vendedores={vendedoresLista} 
            isDirector={isDirector} 
        />

      </div>
    </div>
  );
}
