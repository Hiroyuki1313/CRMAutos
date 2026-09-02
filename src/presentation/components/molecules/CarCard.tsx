import { ChevronRight } from "lucide-react";
import { Auto } from "../../../core/domain/entities/Auto";
import { autoFinancialCalculator } from "../../../core/domain/services/AutoFinancialCalculator";
import Image from "next/image";
import Link from "next/link";

interface CarCardProps {
  auto: Auto;
  clientName?: string; // Si está apartado
  vendingToClient?: string;
}

export function CarCard({ auto, clientName, vendingToClient }: CarCardProps) {
  // Parsing the fotos JSON if needed
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
  } catch (e) {
    console.error("Error parsing fotos_url", e);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  const isFrio = auto.estado_logico === 'frio';
  const isVenta = auto.estado_logico === 'venta';
  const statusText = isFrio ? "Frío" : isVenta ? "Vendido" : clientName ? "Apartado" : "Inventario";

  const totalInvertido = autoFinancialCalculator.calculateTotalInvertido(auto);
  const parsedMileage = auto.kilometraje !== undefined && auto.kilometraje !== null ? parseFloat(auto.kilometraje as any) : NaN;
  const formattedMileage = isNaN(parsedMileage) ? "0 KM" : new Intl.NumberFormat('es-MX').format(parsedMileage) + " KM";

  const diasEnInventario = auto.fecha_registro_inventario 
    ? Math.floor((Date.now() - new Date(auto.fecha_registro_inventario).getTime()) / (1000 * 60 * 60 * 24)) 
    : (auto.fecha_creacion ? Math.floor((Date.now() - new Date(auto.fecha_creacion).getTime()) / (1000 * 60 * 60 * 24)) : 0);

  return (
    <Link href={`/auto/${auto.id}${vendingToClient ? `?vendingToClient=${vendingToClient}` : ''}`} className="block h-full">
      <div className="rounded-[1.75rem] bg-white border border-slate-200 flex p-4 sm:p-5 items-center gap-4 sm:gap-5 cursor-pointer hover:bg-slate-50/70 hover:border-slate-300 transition-all shadow-sm group h-full min-h-[140px]">
        {/* Foto de la Unidad */}
        <div className="flex-shrink-0 rounded-2xl w-24 h-24 sm:w-28 sm:h-24 overflow-hidden relative border border-slate-100 shadow-inner bg-slate-50">
          <Image
            src={coverPhoto}
            alt={`${auto.marca} ${auto.modelo}`}
            fill
            unoptimized={true}
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {auto.apartados_count && auto.apartados_count > 0 ? (
            <div className="absolute top-2 right-2 bg-slate-900/85 text-white px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider shadow-md backdrop-blur-xs">
              <span>{auto.apartados_count} AP.</span>
            </div>
          ) : null}
        </div>

        {/* Información Tipificada Sobria */}
        <div className="min-w-0 flex flex-col flex-1 gap-1.5 py-0.5">
          {/* Título Principal */}
          <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug tracking-tight group-hover:text-sky-600 transition-colors line-clamp-1">
            {auto.marca} {auto.modelo} {auto.anio}
          </span>

          {/* Fila 1: Tipo, Kilometraje y VIN */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">TIPO</span>
              <span className="text-slate-600 font-bold">{auto.tipo || "Sedán"}</span>
            </div>
            <span className="text-slate-200">·</span>
            <div className="flex items-center gap-1">
              <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">KM</span>
              <span className="text-slate-600 font-bold">{formattedMileage}</span>
            </div>
            {auto.vin && (
              <>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1">
                  <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">VIN</span>
                  <span className="text-slate-600 font-mono font-bold">···{auto.vin.slice(-4)}</span>
                </div>
              </>
            )}
          </div>

          {/* Fila 2: Días, Precio Sugerido y Apartados / Estado */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] leading-tight mt-0.5">
            <div className="flex items-center gap-1">
              <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">DÍAS</span>
              <span className="text-slate-700 font-bold">{diasEnInventario} d</span>
            </div>
            <span className="text-slate-200">·</span>
            <div className="flex items-center gap-1">
              <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">PRECIO</span>
              <span className="text-slate-900 font-black">{formatPrice(totalInvertido)}</span>
            </div>
            {auto.apartados_count && auto.apartados_count > 0 ? (
              <>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1">
                  <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">APARTADOS</span>
                  <span className="text-slate-700 font-bold">{auto.apartados_count}</span>
                </div>
              </>
            ) : null}
            {statusText !== "Inventario" && (
              <>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1">
                  <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">ESTADO</span>
                  <span className="text-slate-700 font-bold">{statusText}</span>
                </div>
              </>
            )}
          </div>

          {/* Cliente si existe */}
          {clientName && (
            <div className="flex items-center gap-1 text-[10px] mt-0.5 truncate">
              <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">CLIENTE</span>
              <span className="text-slate-800 font-bold truncate">{clientName}</span>
            </div>
          )}
        </div>

        {/* Flecha lateral sobria */}
        <div className="flex-shrink-0 size-8 sm:size-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-700 transition-all border border-slate-100">
          <ChevronRight className="size-4" />
        </div>
      </div>
    </Link>
  );
}
