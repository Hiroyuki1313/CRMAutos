import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { ArrowLeft, Car, ChevronRight, FileText, HandCoins } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SelectionAction } from "./_components/SelectionAction";

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

  // Parse Photo
  let coverPhoto = "https://images.unsplash.com/photo-1642130204821-74126d1cb88e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBDb3JvbGxhJTIwd2hpdGUlMjBzZWRhbiUyMGNhcnxlbnwxfDJ8fHwxNzc1NzUwMzUyfDA&ixlib=rb-4.1.0&q=80&w=400";
  try {
    let parsedUrl = "";
    if (auto.fotos_url) {
      if (typeof auto.fotos_url === "string") {
        try {
          const parsed = JSON.parse(auto.fotos_url);
          if (Array.isArray(parsed) && parsed.length > 0) parsedUrl = parsed[0];
          else if (typeof parsed === "string") parsedUrl = parsed;
        } catch {
          parsedUrl = auto.fotos_url;
        }
      } else if (Array.isArray(auto.fotos_url) && auto.fotos_url.length > 0) {
        parsedUrl = auto.fotos_url[0];
      }
      
      if (parsedUrl && (parsedUrl.startsWith("http://") || parsedUrl.startsWith("https://") || parsedUrl.startsWith("/"))) {
        coverPhoto = parsedUrl;
      }
    }
  } catch (e) {}

  const isFrio = auto.estado_logico === 'frio';

  return (
    <div className="bg-[var(--color-surface-bg)] text-neutral-50 min-h-[100dvh] w-full overflow-y-auto font-sans">
      <div className="flex pb-20 flex-col">
        {/* Superior Nav */}
        <Link href="/" className="flex px-4 pt-12 pb-4 items-center gap-4 cursor-pointer">
          <ArrowLeft className="size-6 text-neutral-50" />
          <span className="font-bold text-neutral-50 text-lg leading-7">
            Detalle Vehículo
          </span>
        </Link>

        <div className="px-4">
          <div className="relative rounded-xl overflow-hidden h-48 w-full border border-white/5">
            <Image
              src={coverPhoto}
              alt={`${auto.marca} ${auto.modelo}`}
              className="object-cover"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="flex mt-3 justify-center items-center gap-2">
            <div className="rounded-full bg-[var(--color-primary)] w-2 h-2" />
            <div className="rounded-full bg-zinc-800 w-2 h-2" />
            <div className="rounded-full bg-zinc-800 w-2 h-2" />
          </div>
        </div>

        {/* Advertencia de Apartados */}
      {auto.apartados_count ? auto.apartados_count > 0 && (
        <div className="mx-4 mt-6 p-4 rounded-2xl bg-[#f0b100]/10 border border-[#f0b100]/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#f0b100] p-2 rounded-xl text-[#733e0a] shrink-0">
            <HandCoins className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="font-bold text-[#f0b100] text-sm">Unidad con Apartados Activos</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Este vehículo tiene actualmente <span className="font-bold text-[#f0b100]">{auto.apartados_count}</span> {auto.apartados_count === 1 ? 'proceso de apartado activo' : 'procesos de apartado activos'}. 
              Toma esto en cuenta antes de realizar promesas de venta.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex mt-6 px-4 justify-between items-start">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-neutral-50 text-xl leading-7">
              {auto.marca} {auto.modelo} {auto.anio}
            </h1>
            <span className="text-[#9f9fa9] text-sm leading-5">
              {auto.tipo || "Sedán"} · Color Pendiente · 0 km
            </span>
          </div>
          <div className={`font-semibold rounded-full text-xs leading-4 px-3 py-1 ${isFrio ? 'bg-[var(--color-cold)]/20 text-[var(--color-cold)] border border-[var(--color-cold)]/50' : 'bg-[var(--color-primary)] text-[var(--color-primary-dark)]'}`}>
            {isFrio ? 'Frío' : 'Inventario'}
          </div>
        </div>

        {/* Información del Vehículo */}
        <div className="mt-6 px-4">
          <div className="bg-[var(--color-card-bg)] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
            <span className="font-semibold text-neutral-50 text-sm leading-5">
              Información del Vehículo
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9f9fa9] text-xs leading-4">Marca</span>
                <span className="font-medium text-neutral-50 text-sm leading-5">{auto.marca}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9f9fa9] text-xs leading-4">Modelo</span>
                <span className="font-medium text-neutral-50 text-sm leading-5">{auto.modelo}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9f9fa9] text-xs leading-4">Año</span>
                <span className="font-medium text-neutral-50 text-sm leading-5">{auto.anio}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9f9fa9] text-xs leading-4">Tipo</span>
                <span className="font-medium text-neutral-50 text-sm leading-5">{auto.tipo || "N/D"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9f9fa9] text-xs leading-4">ID de Sistema</span>
                <span className="font-medium text-neutral-50 text-sm leading-5">#{auto.id}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#9f9fa9] text-xs leading-4">Alta Inventario</span>
                <span className="font-medium text-neutral-50 text-sm leading-5">
                  {auto.fecha_registro_inventario ? new Date(auto.fecha_registro_inventario).toLocaleDateString() : 'N/D'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Precios Financieros Simulados */}
        <div className="mt-4 px-4">
          <div className="bg-[var(--color-card-bg)] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
            <span className="font-semibold text-neutral-50 text-sm leading-5">
              Precios y Fichas
            </span>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[#9f9fa9] text-sm leading-5">Precio Base (Estimado)</span>
                <span className="font-medium text-neutral-50 text-sm leading-5">$0 M.N.</span>
              </div>
              <div className="bg-white/10 w-full h-px" />
              <div className="flex justify-between items-center">
                <span className="text-[#9f9fa9] text-sm leading-5">Estatus Físico</span>
                <span className="font-bold text-[var(--color-primary)] text-sm leading-5 uppercase">
                  {auto.estado_logico}
                </span>
              </div>
            </div>
          </div>
        </div>


        {vendingToClient && (
          <SelectionAction autoId={auto.id} clientId={parseInt(vendingToClient, 10)} />
        )}
      </div>
    </div>
  );
}
