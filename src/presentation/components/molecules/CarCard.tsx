import { ChevronRight, HandCoins } from "lucide-react";
import { Auto } from "../../../core/domain/entities/Auto";
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

  // Simulate price until it's added to Entity?
  // User's DB didn't have auto.precio wait! Let's check user's SQL:
  // CREATE TABLE autos: id, marca, modelo, anio, tipo, fotos_url, estado_logico.
  // Oh, `autos` table doesn't have a `precio` column in the SQL provided!
  // It says "monto_apartado" in `apartados`, and `venta` in `avaluos`.
  // Wait, `precio` belongs to inventory but was omitted? 
  // We'll use a mocked UI price format or fallback.
  const displayPrice = "$0";

  return (
    <Link href={`/auto/${auto.id}${vendingToClient ? `?vendingToClient=${vendingToClient}` : ''}`}>
      <div className="rounded-[1.5rem] bg-white border border-slate-200 flex p-5 items-center gap-5 cursor-pointer hover:bg-slate-50 hover:border-[var(--color-primary)]/50 transition-all shadow-sm group">
        <div className="flex-shrink-0 rounded-2xl w-28 h-24 overflow-hidden relative border border-slate-100 shadow-inner bg-slate-50">
        <Image
          src={coverPhoto}
          alt={`${auto.marca} ${auto.modelo}`}
          fill
          unoptimized={true}
          sizes="112px"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {auto.apartados_count ? auto.apartados_count > 0 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white size-7 rounded-xl flex items-center justify-center border border-amber-600/20 shadow-lg animate-in zoom-in-50 duration-300">
            <span className="text-[11px] font-black">{auto.apartados_count}</span>
          </div>
        ) : null}
      </div>
      <div className="min-w-0 flex flex-col flex-1 gap-1.5">
        <span className="font-extrabold text-slate-900 text-base leading-tight tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
          {auto.marca} {auto.modelo} {auto.anio}
        </span>
        <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest leading-4">
          {auto.tipo || "Sedán"} · {"No color"} · {"0 km"}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <div
            className="rounded-full w-2 h-2"
            style={{ backgroundColor: dotColor }}
          />
          <span
            className="text-[10px] font-black uppercase tracking-widest leading-4"
            style={{ color: dotColor }}
          >
            {statusText}
          </span>
          {auto.apartados_count ? auto.apartados_count > 0 && (
            <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ml-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
              <HandCoins className="size-3" />
              {auto.apartados_count} {auto.apartados_count === 1 ? 'Apartado' : 'Apartados'}
            </span>
          ) : null}
        </div>
        {clientName && (
          <span className="text-slate-400 text-[10px] font-bold mt-1">
            Nombre: <span className="text-slate-900">{clientName}</span>
          </span>
        )}
      </div>
      <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all shadow-sm">
        <ChevronRight className="size-5" />
      </div>
      </div>
    </Link>
  );
}
