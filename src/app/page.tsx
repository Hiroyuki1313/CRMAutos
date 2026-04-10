import Link from "next/link";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { BottomNav } from "../presentation/components/organisms/BottomNav";
import { CarCard } from "../presentation/components/molecules/CarCard";
import { MySQLAutoRepository } from "../infrastructure/repositories/MySQLAutoRepository";
import { getSession } from "@/core/usecases/authService";

export const dynamic = 'force-dynamic';

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ q?: string, tab?: 'todos' | 'frio' | 'apartado', vendingToClient?: string }> }) {
  const session = await getSession();
  const role = session?.role as string;

  const autoRepo = new MySQLAutoRepository();
  const sp = await searchParams;
  const q = sp.q || "";
  const tab = sp.tab || "todos";
  const vendingToClient = sp.vendingToClient;

  const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(role);
  
  // Dashboard Stats: Personal if seller, Global if management
  // (Moved to Inicio Page as per user request)

  const autosRaw = await autoRepo.getAll({ search: q, tab });
  
  const autos = role === 'vendedor' 
    ? autosRaw.filter(a => a.estado_logico !== 'avaluo')
    : autosRaw;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface-bg)] text-[var(--color-text-main)] w-full overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Header */}
        <div className="flex px-6 pt-2 pb-4 justify-between items-center">
          <h1 className="font-bold text-2xl leading-8">
            Inventario
          </h1>
          <div className="flex gap-2">
            {isManagement && (
              <Link 
                  href="/auto/nuevo" 
                  className="font-semibold rounded-lg bg-[var(--color-primary)] hover:bg-[#ffe040] transition-colors text-[var(--color-primary-dark)] text-sm leading-5 flex px-4 py-2 items-center gap-2"
              >
                  <Plus className="size-4" />
                  <span>Nuevo</span>
              </Link>
            )}
            <div className="rounded-xl bg-[var(--color-card-bg)] flex justify-center items-center size-10 cursor-pointer border border-white/5">
              <SlidersHorizontal className="size-5 text-[var(--color-text-muted)]" />
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="px-6 pb-4">
          <form action="/" method="GET" className="rounded-xl bg-[var(--color-card-bg)] border border-white/5 focus-within:border-[var(--color-primary)] transition-colors flex px-4 py-3 items-center gap-2">
            <Search className="size-4 text-[var(--color-text-muted)] flex-shrink-0" />
            <input 
              name="q"
              defaultValue={q}
              type="text" 
              placeholder="Buscar por marca, modelo o año" 
              className="bg-transparent text-[var(--color-text-main)] text-sm leading-5 outline-none flex-1 w-full"
            />
            {tab !== "todos" && <input type="hidden" name="tab" value={tab} />}
            {vendingToClient && <input type="hidden" name="vendingToClient" value={vendingToClient} />}
          </form>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pb-4 gap-2">
          <Link href={`/?tab=todos${q ? `&q=${q}` : ''}`} className={`font-medium rounded-full text-sm leading-5 px-4 py-2 transition-colors ${tab === 'todos' ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)]' : 'bg-[var(--color-card-bg)] text-[var(--color-text-muted)] hover:bg-zinc-800'}`}>
            Todos
          </Link>
          <Link href={`/?tab=frio${q ? `&q=${q}` : ''}`} className={`font-medium rounded-full text-sm leading-5 px-4 py-2 transition-colors ${tab === 'frio' ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)]' : 'bg-[var(--color-card-bg)] text-[var(--color-text-muted)] hover:bg-zinc-800'}`}>
            Frío
          </Link>
          <Link href={`/?tab=apartado${q ? `&q=${q}` : ''}${vendingToClient ? `&vendingToClient=${vendingToClient}` : ''}`} className={`font-medium rounded-full text-sm leading-5 px-4 py-2 transition-colors ${tab === 'apartado' ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)]' : 'bg-[var(--color-card-bg)] text-[var(--color-text-muted)] hover:bg-zinc-800'}`}>
            Con Apartado
          </Link>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex px-6 pb-4 flex-col flex-1 gap-4">
          {autos.length === 0 ? (
            <div className="flex py-4 justify-center items-center">
              <span className="text-[var(--color-text-muted)] text-sm">No hay autos en la base de datos (Hostinger)</span>
            </div>
          ) : (
            autos.map((auto) => (
              <CarCard key={auto.id} auto={auto} vendingToClient={vendingToClient} />
            ))
          )}

          <div className="flex py-4 justify-center items-center">
            <span className="text-[var(--color-text-muted)] text-xs leading-4">
              {autos.length} unidades en inventario
            </span>
          </div>
        </div>
      </div>
      
      {/* Footer Navigation */}
      <BottomNav role={role} />
    </div>
  );
}
