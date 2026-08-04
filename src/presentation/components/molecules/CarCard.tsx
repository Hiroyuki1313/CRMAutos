import { ChevronRight, HandCoins } from "lucide-react";
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
          parsedUrl = auto.fotos_url; // if not JSON, maybe it's just a raw link string
        }
      } else if (Array.isArray(auto.fotos_url) && auto.fotos_url.length > 0) {
        parsedUrl = auto.fotos_url[0];
      }
      
      // Ensure it's a valid remote URL or local absolute path
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
  const dotColor = isFrio ? "var(--color-cold)" : "var(--color-primary)";
  const statusText = isFrio ? "Frío" : clientName ? "Apartado" : "Inventario";

  const totalInvertido = autoFinancialCalculator.calculateTotalInvertido(auto);
  const parsedMileage = auto.kilometraje !== undefined && auto.kilometraje !== null ? parseFloat(auto.kilometraje as any) : NaN;
  const formattedMileage = isNaN(parsedMileage) ? "0 KM" : new Intl.NumberFormat('es-MX').format(parsedMileage) + " KM";

  const diasEnInventario = auto.fecha_registro_inventario 
    ? Math.floor((Date.now() - new Date(auto.fecha_registro_inventario).getTime()) / (1000 * 60 * 60 * 24)) 
    : (auto.fecha_creacion ? Math.floor((Date.now() - new Date(auto.fecha_creacion).getTime()) / (1000 * 60 * 60 * 24)) : 0);




  return (
    <Link href={`/auto/${auto.id}${vendingToClient ? `?vendingToClient=${vendingToClient}` : ''}`} className="block h-full">
      <div className="rounded-[1.5rem] bg-white border border-slate-200 flex p-4 sm:p-5 items-center gap-4 sm:gap-5 cursor-pointer hover:bg-slate-50 hover:border-[var(--color-primary)]/50 transition-all shadow-sm group h-full min-h-[140px]">
        <div className="flex-shrink-0 rounded-2xl w-24 h-24 sm:w-28 sm:h-24 overflow-hidden relative border border-slate-100 shadow-inner bg-slate-50">
        <Image
          src={coverPhoto}
          alt={`${auto.marca} ${auto.modelo}`}
          fill
          unoptimized={true}
          sizes="(max-width: 640px) 96px, 112px"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {auto.apartados_count ? auto.apartados_count > 0 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white size-7 rounded-xl flex items-center justify-center border border-amber-600/20 shadow-lg animate-in zoom-in-50 duration-300">
            <span className="text-[11px] font-black">{auto.apartados_count}</span>
          </div>
        ) : null}
      </div>
      <div className="min-w-0 flex flex-col flex-1 gap-1 py-1">
        <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug tracking-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
          {auto.marca} {auto.modelo} {auto.anio}
        </span>
        <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest leading-4">
          {auto.tipo || "Sedán"} · {formattedMileage}
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {statusText !== "Inventario" && (
            <>
              <span style={{ color: dotColor }}>{statusText}</span>
              <span className="text-slate-200">·</span>
            </>
          )}
          <span className={diasEnInventario >= 90 ? 'text-rose-600 animate-pulse' : 'text-slate-500'}>
            {diasEnInventario} {diasEnInventario === 1 ? 'día' : 'días'}
          </span>
          <span className="text-slate-200">·</span>
          <span className="text-emerald-600">
            PRECIO SUGERIDO: {formatPrice(totalInvertido)}
          </span>
          {auto.apartados_count ? auto.apartados_count > 0 && (
            <>
              <span className="text-slate-200">·</span>
              <span className="text-amber-500 flex items-center gap-1">
                <HandCoins className="size-3" />
                {auto.apartados_count} {auto.apartados_count === 1 ? 'Apartado' : 'Apartados'}
              </span>
            </>
          ) : null}
        </div>
        {clientName && (
          <span className="text-slate-400 text-[10px] font-bold mt-0.5 truncate">
            Nombre: <span className="text-slate-900">{clientName}</span>
          </span>
        )}
      </div>

      <div className="flex-shrink-0 size-9 sm:size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all shadow-sm">
        <ChevronRight className="size-5" />
      </div>
      </div>
    </Link>
  );
}
