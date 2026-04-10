import { Search, SlidersHorizontal } from "lucide-react";
import { BottomNav } from "../presentation/components/organisms/BottomNav";
import { CarCard } from "../presentation/components/molecules/CarCard";
import { MySQLAutoRepository } from "../infrastructure/repositories/MySQLAutoRepository";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const autoRepo = new MySQLAutoRepository();
  // TODO: Add searchParams logic for filtering status
  const autos = await autoRepo.getAll();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface-bg)] text-[var(--color-text-main)] w-full overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Header */}
        <div className="flex px-6 pt-6 pb-4 justify-between items-center">
          <h1 className="font-bold text-2xl leading-8">
            Inventario
          </h1>
          <div className="rounded-xl bg-[var(--color-card-bg)] flex justify-center items-center w-10 h-10">
            <SlidersHorizontal className="size-5 text-[var(--color-text-muted)]" />
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="rounded-xl bg-[var(--color-card-bg)] flex px-4 py-3 items-center gap-2">
            <Search className="size-4 text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-muted)] text-sm leading-5">
              Buscar por marca, modelo o año
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pb-4 gap-2">
          <div className="font-medium rounded-full text-sm leading-5 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-dark)]">
            Todos
          </div>
          <div className="font-medium rounded-full bg-[var(--color-card-bg)] text-[var(--color-text-muted)] text-sm leading-5 px-4 py-2">
            Frío
          </div>
          <div className="font-medium rounded-full bg-[var(--color-card-bg)] text-[var(--color-text-muted)] text-sm leading-5 px-4 py-2">
            Con Apartado
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex px-6 pb-4 flex-col flex-1 gap-4">
          {autos.length === 0 ? (
            <div className="flex py-4 justify-center items-center">
              <span className="text-[var(--color-text-muted)] text-sm">No hay autos en la base de datos (Hostinger)</span>
            </div>
          ) : (
            autos.map((auto) => (
              <CarCard key={auto.id} auto={auto} />
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
      <BottomNav />
    </div>
  );
}
