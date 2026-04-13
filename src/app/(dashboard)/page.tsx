import Link from "next/link";
import { Search, SlidersHorizontal, Plus, Car } from "lucide-react";
import { CarCard } from "@/presentation/components/molecules/CarCard";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
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
  const autosRaw = await autoRepo.getAll({ search: q, tab });
  
  // Excluir siempre los Avalúos (estado 'frio') del Inventario principal
  const autos = autosRaw.filter(a => a.estado_logico !== 'frio');

  return (
    <div className="px-6 py-12 lg:px-12 lg:py-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-zinc-900/40 p-6 lg:p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex items-center gap-5">
               <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 shadow-xl shadow-[var(--color-primary)]/5">
                  <Car className="size-7 text-[var(--color-primary)]" />
               </div>
               <div className="flex flex-col">
                  <h1 className="font-extrabold text-white text-3xl lg:text-4xl tracking-tight">Inventario</h1>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Control de stock de unidades</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
                {isManagement && (
                    <Link 
                        href="/auto/nuevo" 
                        className="font-black rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 active:scale-95 transition-all text-[var(--color-primary-dark)] text-sm px-8 py-4 flex items-center gap-2 shadow-xl shadow-[var(--color-primary)]/20 uppercase tracking-wider"
                    >
                        <Plus className="size-5" />
                        <span>Nueva Unidad</span>
                    </Link>
                )}
                <div className="rounded-2xl bg-zinc-900 flex justify-center items-center size-12 cursor-pointer border border-white/5 hover:border-white/20 transition-colors">
                  <SlidersHorizontal className="size-6 text-zinc-500" />
                </div>
            </div>
        </div>
        
        {/* Filtros Bar */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            {/* Search */}
            <div className="relative group w-full lg:max-w-md">
                <form action="/" method="GET" className="relative w-full">
                <Search className="size-4 top-1/2 -translate-y-1/2 text-zinc-500 absolute left-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input 
                    name="q"
                    defaultValue={q}
                    type="text" 
                    placeholder="Buscar por marca, modelo o año..." 
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all font-medium"
                />
                {tab !== "todos" && <input type="hidden" name="tab" value={tab} />}
                {vendingToClient && <input type="hidden" name="vendingToClient" value={vendingToClient} />}
                </form>
            </div>

            {/* Tabs de Filtro */}
            <div className="flex items-center gap-3 p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                <Link href={`/?tab=todos${q ? `&q=${q}` : ''}`} className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${tab === 'todos' ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                    Todos
                </Link>
                <Link href={`/?tab=apartado${q ? `&q=${q}` : ''}${vendingToClient ? `&vendingToClient=${vendingToClient}` : ''}`} className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${tab === 'apartado' ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                    Con Apartado
                </Link>
            </div>
        </div>

        {/* Inventory List - Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {autos.length === 0 ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-zinc-900/20 rounded-[2rem] border border-dashed border-white/5">
              <Car className="size-16 mb-6 text-zinc-800" />
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm text-center">No hay unidades registradas en esta categoría</p>
            </div>
          ) : (
            autos.map((auto) => (
              <CarCard key={auto.id} auto={auto} vendingToClient={vendingToClient} />
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="py-12 border-t border-white/5 flex justify-center items-center">
            <span className="bg-zinc-900/50 text-zinc-500 text-xs font-black uppercase tracking-[0.3em] px-6 py-3 rounded-full border border-white/5">
                {autos.length} unidades disponibles
            </span>
        </div>

      </div>
    </div>
  );
}
