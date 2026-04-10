import { Car, ChevronRight, ClipboardList, HandCoins, Home, Search, SlidersHorizontal, Users } from "lucide-react";

export function BottomNav() {
  return (
    <div className="bg-zinc-900 border-white/10 border-t px-2 pt-2 pb-6">
      <div className="flex flex-row justify-around items-center">
        <div className="flex p-2 flex-col items-center gap-1">
          <Home className="size-5 text-muted" />
          <span className="text-muted text-xs leading-4">Inicio</span>
        </div>
        <div className="flex p-2 flex-col items-center gap-1">
          <ClipboardList className="size-5 text-muted" />
          <span className="text-muted text-xs leading-4">Avalúos</span>
        </div>
        <div className="flex p-2 flex-col items-center gap-1">
          <Users className="size-5 text-muted" />
          <span className="text-muted text-xs leading-4">Clientes</span>
        </div>
        <div className="flex p-2 flex-col items-center gap-1">
          <HandCoins className="size-5 text-muted" />
          <span className="text-muted text-xs leading-4">Apartados</span>
        </div>
        <div className="flex p-2 flex-col items-center gap-1">
          <div className="rounded-full flex px-4 py-1 flex-col items-center gap-1 bg-[var(--color-primary)]">
            <Car className="size-5 text-[var(--color-primary-dark)]" />
            <span className="font-semibold text-xs leading-4 text-[var(--color-primary-dark)]">
              Inventario
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
