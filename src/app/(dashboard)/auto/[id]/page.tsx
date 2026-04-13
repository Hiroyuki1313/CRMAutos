import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { ArrowLeft, Car, FileText, HandCoins } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SelectionAction } from "./_components/SelectionAction";
import { AutoDetailCarousel } from "./_components/AutoDetailCarousel";

export const dynamic = 'force-dynamic';

export default async function AutoDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ vendingToClient?: string }> }) {
  const repo = new MySQLAutoRepository();
  const unwrappedParams = await params;
  const sp = await searchParams;
  const vendingToClient = sp.vendingToClient;
  const autoId = parseInt(unwrappedParams.id, 10);
  
  if (isNaN(autoId)) {
    notFound();
  }

  const auto = await repo.findById(autoId);

  if (!auto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-neutral-50 px-4">
        <Car className="size-16 text-zinc-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Vehículo no encontrado</h1>
        <p className="text-zinc-400 mb-8">El vehículo que buscas no existe o fue eliminado del inventario.</p>
        <Link href="/" className="bg-[var(--color-primary)] text-[var(--color-primary-dark)] px-6 py-3 rounded-xl font-bold">
          Regresar al Inventario
        </Link>
      </div>
    );
  }

  // Parse Photos safely
  let photos: string[] = [];
  try {
    if (auto.fotos_url) {
      if (typeof auto.fotos_url === "string") {
        try {
          const parsed = JSON.parse(auto.fotos_url);
          photos = Array.isArray(parsed) ? parsed : (typeof parsed === 'string' ? [parsed] : []);
        } catch {
          photos = [auto.fotos_url];
        }
      } else if (Array.isArray(auto.fotos_url)) {
        photos = auto.fotos_url;
      }
    }
  } catch (e) {
    console.error("Error parsing photos:", e);
  }

  const isFrio = auto.estado_logico === 'frio';

  return (
    <div className="px-6 py-12 lg:px-12 lg:py-16 bg-zinc-950 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Superior Nav */}
        <div className="flex justify-between items-center">
            <Link href="/" className="group flex items-center gap-4 cursor-pointer">
                <div className="size-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:bg-zinc-800 transition-all">
                    <ArrowLeft className="size-5 text-neutral-50" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-[9px] uppercase tracking-[0.3em] text-zinc-600">Volver</span>
                    <span className="font-extrabold text-white text-lg leading-tight">Inventario Stock</span>
                </div>
            </Link>

            <div className={`font-black uppercase tracking-widest rounded-full text-[10px] px-6 py-2.5 border transition-all shadow-lg ${
                isFrio 
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/10 shadow-blue-500/5' 
                : 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] border-[var(--color-primary)]'
            }`}>
                {isFrio ? 'Módulo: Avalúo' : 'Estatus: Disponible'}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Visual Section (Left) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
                <AutoDetailCarousel photos={photos} alt={`${auto.marca} ${auto.modelo}`} />
                
                {/* Advertencia de Apartados */}
                {auto.apartados_count && auto.apartados_count > 0 ? (
                    <div className="p-8 rounded-[2.5rem] bg-orange-500/5 border border-orange-500/10 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-orange-500 p-4 rounded-2xl text-[var(--color-primary-dark)] shrink-0 shadow-xl shadow-orange-500/20">
                            <HandCoins className="size-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="font-black uppercase tracking-[0.2em] text-orange-500 text-[10px]">Unidad Comprometida</h4>
                            <p className="text-zinc-500 text-xs font-bold leading-relaxed">
                                Este vehículo tiene <span className="text-white font-black">{auto.apartados_count}</span> procesos de apartado activos. 
                                Valida estatus con gerencia antes de confirmar disponibilidad al cliente.
                            </p>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Info Section (Right) */}
            <div className="lg:col-span-5 flex flex-col gap-8 sticky top-12">
                <div className="flex flex-col gap-3">
                    <h1 className="font-black text-white text-5xl lg:text-6xl tracking-tighter leading-none italic uppercase">
                        {auto.marca} <span className="text-[var(--color-primary)]">{auto.modelo}</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="bg-zinc-800/80 backdrop-blur-md px-4 py-2 rounded-xl text-zinc-400 font-black text-[10px] uppercase tracking-widest border border-white/5 shadow-2xl">
                             Modelo {auto.anio}
                        </span>
                        <span className="text-zinc-700 font-black text-[10px] uppercase tracking-widest">Stock ID: #{auto.id}</span>
                    </div>
                </div>

                {/* Technical Specs Card */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Car className="size-32" />
                    </div>

                    <h3 className="font-black uppercase text-[10px] tracking-[0.4em] text-zinc-600 pb-4 border-b border-white/5 flex items-center gap-3">
                        <div className="size-2 rounded-full bg-[var(--color-primary)]" />
                        Ficha Técnica
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                        <InfoBox label="Marca" value={auto.marca} />
                        <InfoBox label="Modelo" value={auto.modelo} />
                        <InfoBox label="Año" value={auto.anio.toString()} />
                        <InfoBox label="Categoría" value={auto.tipo || "Sedán"} />
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Estado Lógico</span>
                            <span className={`font-black text-xs uppercase tracking-widest ${isFrio ? 'text-blue-400' : 'text-[var(--color-primary)]'}`}>
                                {auto.estado_logico}
                            </span>
                        </div>
                        <button className="rounded-2xl bg-zinc-800/50 size-14 flex items-center justify-center border border-white/5 hover:bg-zinc-700 hover:text-white transition-all text-zinc-500 shadow-xl">
                             <FileText className="size-6" />
                        </button>
                    </div>
                </div>

                {vendingToClient && (
                    <SelectionAction autoId={auto.id} clientId={parseInt(vendingToClient, 10)} />
                )}
            </div>

        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{label}</span>
            <span className="font-black text-white text-xl leading-tight tracking-tight">{value}</span>
        </div>
    );
}
