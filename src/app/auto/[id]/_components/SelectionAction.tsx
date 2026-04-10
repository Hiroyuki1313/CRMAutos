"use client";

import { useState } from "react";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { crearApartadoAction } from "@/actions/apartadoActions";

export function SelectionAction({ autoId, clientId }: { autoId: number; clientId: number }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <div className="fixed bottom-24 left-6 right-6 z-40 animate-in slide-in-from-bottom-10 duration-500">
        <button 
          onClick={() => setShowConfirm(true)}
          className="font-bold rounded-xl text-base flex py-4 justify-center items-center gap-2 w-full bg-[var(--color-primary)] text-[#733e0a] shadow-2xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ShoppingCart className="size-5" />
          Seleccionar Vehículo
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-24 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-neutral-50 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-[var(--color-primary)]" />
              Confirmar Venta Fría
            </h3>
            <button onClick={() => setShowConfirm(false)} className="text-zinc-500 text-sm font-medium hover:text-zinc-300">Cancelar</button>
          </div>
          
          <p className="text-zinc-400 text-sm leading-relaxed">
            Estás por iniciar un proceso de venta para este cliente. Puedes ingresar un monto de apartado ahora o dejarlo en $0.
          </p>

          <form action={crearApartadoAction} className="flex flex-col gap-4">
            <input type="hidden" name="id_cliente" value={clientId} />
            <input type="hidden" name="id_carro" value={autoId} />
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Monto de Apartado ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                <input 
                  type="number" 
                  name="monto_apartado" 
                  placeholder="0.00"
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-10 pr-4 text-neutral-50 focus:outline-none focus:border-[var(--color-primary)] transition-all font-bold"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="font-bold rounded-2xl text-base flex py-4 justify-center items-center gap-2 w-full bg-[var(--color-primary)] text-[#733e0a] hover:bg-[#d69f00] transition-colors"
            >
              Guardar y Avanzar 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
