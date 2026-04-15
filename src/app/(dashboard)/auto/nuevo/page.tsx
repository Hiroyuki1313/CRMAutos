'use client';

import Link from "next/link";
import { ArrowLeft, Car } from "lucide-react";
import { AutoForm } from "@/presentation/components/organisms/AutoForm";

export default function NuevoAutoInventarioPage() {
  return (
    <div className="flex flex-col w-full pb-24 bg-slate-50/50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex pt-12 pb-8 flex-col gap-8 px-6 lg:px-12 sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all">
              <div className="size-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-all shadow-sm">
                  <ArrowLeft className="size-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Volver al Inventario</span>
          </Link>
          <div className="px-5 py-2.5 rounded-full bg-indigo-500 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20">
              Alta de Inventario
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="size-20 rounded-[2.5rem] bg-white flex items-center justify-center border border-slate-200 shadow-xl shadow-slate-200/50">
              <Car className="size-10 text-indigo-500" />
          </div>
          <div className="flex flex-col">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Nuevo Ingreso</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Carga de Unidades a Stock Central</p>
          </div>
        </div>
      </div>

      <div className="mt-12 px-6 lg:px-12">
        <AutoForm mode="create" />
      </div>
    </div>
  );
}
