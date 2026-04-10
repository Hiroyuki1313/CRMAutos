'use client';

import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Camera, ChevronDown, Info } from "lucide-react";
import Link from "next/link";
import { createAutoAction } from "@/core/usecases/autoService";

export default function NuevoAutoFrioPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrorMsg(null);

    startTransition(async () => {
      const result = await createAutoAction(null, formData);
      if (result?.error) {
        setErrorMsg(result.error);
      } else if (result?.redirect) {
        window.location.href = "/?tab=frio";
      }
    });
  };

  return (
    <div className="bg-[var(--color-surface-bg)] text-neutral-50 w-full min-h-[100dvh] overflow-y-auto font-sans">
      <div className="flex flex-col w-full pb-24">
        {/* Header */}
        <div className="flex px-6 pt-10 pb-4 justify-between items-center bg-[var(--color-surface-bg)] sticky top-0 z-10 border-b border-white/5">
          <div className="flex items-center gap-4">
            <Link href="/">
              <ArrowLeft className="size-6 text-neutral-50 cursor-pointer hover:text-[var(--color-primary)] transition-colors" />
            </Link>
            <h1 className="font-bold text-neutral-50 text-xl leading-7">
              Nuevo Auto Frío
            </h1>
          </div>
          <div className="rounded-full bg-zinc-800 flex px-4 py-2 items-center gap-1">
            <span className="font-semibold text-[var(--color-primary)] text-xs leading-4">
              Paso único
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-6">
          <form id="new-auto-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-5">
              {/* Marca */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[#9f9fa9] text-sm leading-5">Marca</label>
                <div className="rounded-xl bg-[var(--color-card-bg)] border border-white/10 flex p-3 px-4 items-center gap-2 focus-within:border-[var(--color-primary)] transition-colors">
                  <input
                    type="text"
                    name="marca"
                    required
                    placeholder="Ej. Mazda, Toyota, Kia..."
                    className="bg-transparent outline-none flex-1 text-neutral-50 placeholder:text-zinc-600 w-full text-sm leading-5"
                  />
                </div>
              </div>

              {/* Modelo */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[#9f9fa9] text-sm leading-5">Modelo</label>
                <div className="rounded-xl bg-[var(--color-card-bg)] border border-white/10 flex p-3 px-4 items-center gap-2 focus-within:border-[var(--color-primary)] transition-colors">
                  <input
                    type="text"
                    name="modelo"
                    required
                    placeholder="Ej. Corolla, Civic, CX-5..."
                    className="bg-transparent outline-none flex-1 text-neutral-50 placeholder:text-zinc-600 w-full text-sm leading-5"
                  />
                </div>
              </div>

              {/* Año y Tipo */}
              <div className="flex gap-4">
                <div className="flex flex-col flex-1 gap-2">
                  <label className="font-medium text-[#9f9fa9] text-sm leading-5">Año</label>
                  <div className="rounded-xl bg-[var(--color-card-bg)] border border-white/10 flex p-3 px-4 items-center focus-within:border-[var(--color-primary)] transition-colors">
                    <input
                      type="number"
                      name="anio"
                      required
                      min="1990"
                      max="2030"
                      defaultValue="2024"
                      className="bg-transparent outline-none text-neutral-50 w-full text-sm leading-5"
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <label className="font-medium text-[#9f9fa9] text-sm leading-5">Tipo</label>
                  <div className="rounded-xl bg-[var(--color-card-bg)] border border-white/10 flex px-3 py-3 items-center justify-between relative cursor-pointer focus-within:border-[var(--color-primary)] transition-colors">
                    <select
                      name="tipo"
                      required
                      defaultValue="sedan"
                      className="bg-transparent absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const evt = e.target;
                        const span = evt.parentElement?.querySelector('span');
                        if (span) span.innerText = evt.options[evt.selectedIndex].text;
                      }}
                    >
                      <option value="sedan">Sedán</option>
                      <option value="suv">SUV</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="camion">Camión/PickUp</option>
                      <option value="otro">Otro</option>
                    </select>
                    <span className="text-neutral-50 text-sm leading-5 ml-1 pointer-events-none">
                      Sedán
                    </span>
                    <ChevronDown className="size-4 text-[#9f9fa9] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dummy Mock - Fotos */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="font-medium text-[#9f9fa9] text-sm leading-5">
                Fotos del Vehículo (Mock)
              </label>
              <div className="overflow-x-auto flex pb-2 gap-4">
                {['Frontal', 'Lateral', 'Trasera', 'Interior'].map((angle, idx) => (
                  <div key={idx} className={`flex-shrink-0 rounded-xl bg-[var(--color-card-bg)] border-2 border-dashed ${idx === 0 ? 'border-[var(--color-primary)]' : 'border-white/10'} flex flex-col justify-center items-center gap-1 w-24 h-24 opacity-60 cursor-not-allowed`}>
                    <Camera className={`size-6 ${idx === 0 ? 'text-[var(--color-primary)]' : 'text-[#9f9fa9]'}`} />
                    <span className="text-[#9f9fa9] text-xs leading-4">{angle}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-primary)]/10 flex p-4 items-center gap-3">
              <Info className="size-5 flex-shrink-0 text-[var(--color-primary)]" />
              <span className="text-[#9f9fa9] text-xs leading-4">
                Este auto se anexará directamente a la tabla <strong className="text-neutral-50 font-semibold">`autos`</strong> de tu BD con el estatus dictado:{' '}
                <span className="font-semibold text-blue-400">Frío</span>. Sin avalúo asociado inicial.
              </span>
            </div>

            {/* Submit */}
            <div className="pt-2 pb-4">
              <button
                type="submit"
                form="new-auto-form"
                disabled={isPending}
                className="font-bold flex justify-center items-center rounded-xl bg-[var(--color-primary)] hover:bg-[#ffe040] disabled:opacity-50 transition-colors text-[var(--color-primary-dark)] text-base p-4 w-full"
              >
                {isPending ? "Procesando..." : "Guardar Auto Frío"}
                {!isPending && <ArrowRight className="size-4 ml-2" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
