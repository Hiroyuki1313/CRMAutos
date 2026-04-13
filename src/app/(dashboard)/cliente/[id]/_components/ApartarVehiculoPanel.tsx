"use client";

import { useState } from "react";
import { Search, Car, ChevronDown, CheckCircle2 } from "lucide-react";
import { Auto } from "@/core/domain/entities/Auto";
import { crearApartadoAction } from "@/actions/apartadoActions";

export function ApartarVehiculoPanel({
  idCliente,
  vehiculosDisponibles
}: {
  idCliente: number;
  vehiculosDisponibles: Auto[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedAutoId, setSelectedAutoId] = useState<number | null>(null);

  const autosFiltrados = vehiculosDisponibles.filter(v => 
    `${v.marca} ${v.modelo} ${v.anio} ${v.tipo}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!expanded) {
    return (
      <div className="mt-8 border-t border-white/10 pt-8 pb-4 flex flex-col items-center">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="font-bold rounded-xl text-base leading-6 flex py-4 px-6 justify-center items-center gap-2 w-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-colors"
        >
          <Car className="size-5" />
          Apartar Vehículo
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-8 pb-4 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="font-semibold uppercase text-xs leading-4 tracking-wider text-[#9f9fa9] flex items-center justify-between">
        <span className="flex items-center gap-2"><Car className="size-3" /> Selección de Vehículo</span>
        <button className="text-[var(--color-primary)] hover:underline" onClick={() => setExpanded(false)}>Cancelar</button>
      </h3>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
        {/* Buscador interno */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-neutral-50 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            placeholder="Buscar marca, modelo o año..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Lista de selección */}
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {autosFiltrados.length === 0 && (
             <p className="text-zinc-500 text-sm text-center py-4">No se encontraron vehículos.</p>
          )}
          {autosFiltrados.map((auto) => (
            <div
              key={auto.id}
              onClick={() => setSelectedAutoId(auto.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedAutoId === auto.id
                  ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-neutral-50"
                  : "bg-zinc-950 border-white/5 hover:border-white/20 text-zinc-400"
              }`}
            >
              <div>
                <p className={`font-bold text-sm ${selectedAutoId === auto.id ? "text-neutral-50" : "text-zinc-300"}`}>
                  {auto.marca} {auto.modelo} <span className="opacity-70 font-normal">{auto.anio}</span>
                </p>
                <p className="text-xs mt-0.5 uppercase tracking-wide opacity-70">
                  {auto.tipo} · {auto.estado_logico}
                </p>
              </div>
              {selectedAutoId === auto.id && <CheckCircle2 className="size-5 text-[var(--color-primary)]" />}
            </div>
          ))}
        </div>

        {/* Formulario que enviará todo a la Server Action */}
        <form action={crearApartadoAction} className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4">
          <input type="hidden" name="id_cliente" value={idCliente} />
          {selectedAutoId && <input type="hidden" name="id_carro" value={selectedAutoId} />}

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Monto de Apartado (Opcional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
              <input
                type="number"
                name="monto_apartado"
                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-8 pr-4 text-sm text-neutral-50 focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="0.00"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedAutoId}
            className="font-bold rounded-xl text-base flex py-4 justify-center items-center gap-2 w-full mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary)] hover:bg-[#d69f00] text-[#733e0a] shadow-xl shadow-[var(--color-primary)]/10"
          >
            Guardar Avalúo
          </button>
        </form>
      </div>
    </div>
  );
}
