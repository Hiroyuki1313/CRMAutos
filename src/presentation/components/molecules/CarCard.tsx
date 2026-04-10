import { ChevronRight } from "lucide-react";
import { Auto } from "../../../core/domain/entities/Auto";
import Image from "next/image";

interface CarCardProps {
  auto: Auto;
  clientName?: string; // Si está apartado
}

export function CarCard({ auto, clientName }: CarCardProps) {
  // Parsing the fotos JSON if needed
  let coverPhoto = "https://images.unsplash.com/photo-1642130204821-74126d1cb88e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBDb3JvbGxhJTIwd2hpdGUlMjBzZWRhbiUyMGNhcnxlbnwxfDJ8fHwxNzc1NzUwMzUyfDA&ixlib=rb-4.1.0&q=80&w=400";
  try {
    if (auto.fotos_url) {
      if (typeof auto.fotos_url === "string") {
        const parsed = JSON.parse(auto.fotos_url);
        if (parsed.length > 0) coverPhoto = parsed[0];
      } else if (Array.isArray(auto.fotos_url) && auto.fotos_url.length > 0) {
        coverPhoto = auto.fotos_url[0];
      }
    }
  } catch (e) {}

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
    <div className="rounded-xl bg-[var(--color-card-bg)] flex p-4 items-center gap-4">
      <div className="flex-shrink-0 rounded-lg w-24 h-20 overflow-hidden relative">
        <Image
          src={coverPhoto}
          alt={`${auto.marca} ${auto.modelo}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex flex-col flex-1 gap-1">
        <span className="font-bold text-[var(--color-text-main)] text-sm leading-5">
          {auto.marca} {auto.modelo} {auto.anio}
        </span>
        <span className="text-[#9f9fa9] text-xs leading-4">
          {auto.tipo || "Sedán"} · {"No color"} · {"0 km"}
        </span>
        <span
          className="font-bold text-sm leading-5"
          style={{ color: "var(--color-primary)" }}
        >
          {displayPrice}
        </span>
        <div className="flex items-center gap-1">
          <div
            className="rounded-full w-2 h-2"
            style={{ backgroundColor: dotColor }}
          />
          <span
            className="text-xs leading-4"
            style={{ color: dotColor }}
          >
            {statusText}
          </span>
        </div>
        {clientName && (
          <span className="text-[#9f9fa9] text-xs leading-4 opacity-60">
            Cliente: {clientName}
          </span>
        )}
      </div>
      <ChevronRight className="size-4 flex-shrink-0 text-[#9f9fa9]" />
    </div>
  );
}
