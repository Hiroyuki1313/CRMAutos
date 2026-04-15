"use client";

import { useState } from "react";
import { CheckCircle2, ShoppingCart, X } from "lucide-react";
import { crearApartadoAction } from "@/actions/apartadoActions";

export function SelectionAction({ autoId, clientId }: { autoId: number; clientId: number }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <div className="mt-6 animate-in slide-in-from-bottom-4 duration-700">
        <button 
          onClick={() => setShowConfirm(true)}
          className="font-black rounded-[2rem] text-[10px] uppercase tracking-[0.2em] flex py-5 justify-center items-center gap-3 w-full bg-[var(--color-primary)] text-white shadow-2xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ShoppingCart className="size-5" />
          Vincular a Venta
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <CheckCircle2 className="size-6 text-[var(--color-primary)]" />
              Confirmar
            </h3>
            <button 
                onClick={() => setShowConfirm(false)} 
                className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
            >
                <X className="size-5" />
            </button>
          </div>
          
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Estás por iniciar un proceso de venta para este cliente. Puedes ingresar un monto de apartado ahora o dejarlo en $0.
          </p>

          <form action={crearApartadoAction} className="flex flex-col gap-6">
            <input type="hidden" name="id_cliente" value={clientId} />
            <input type="hidden" name="id_carro" value={autoId} />
            
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 ml-1">Monto de Apartado</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black group-focus-within:text-[var(--color-primary)] transition-colors">$</span>
                <input 
                  type="number" 
                  name="monto_apartado" 
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all font-black text-lg"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="font-black rounded-[2rem] text-xs uppercase tracking-[0.3em] flex py-6 justify-center items-center gap-2 w-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 shadow-xl shadow-[var(--color-primary)]/20 transition-all active:scale-[0.98]"
            >
              Guardar y Avanzar 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
