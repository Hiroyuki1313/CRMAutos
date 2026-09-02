'use client';

import { ChevronRight, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Auto } from "../../../core/domain/entities/Auto";
import { autoFinancialCalculator } from "../../../core/domain/services/AutoFinancialCalculator";
import { deleteAutoAction } from "@/core/usecases/autoService";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CarCardProps {
  auto: Auto;
  clientName?: string; // Si está apartado
  vendingToClient?: string;
  role?: string;
}

export function CarCard({ auto, clientName, vendingToClient, role }: CarCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isManagerOrDirector = ['gerente', 'director'].includes(role || '');

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

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    setErrorMsg(null);
    try {
      const res = await deleteAutoAction(auto.id);
      if (res.success) {
        setShowDeleteModal(false);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Error al eliminar vehículo');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error inesperado al eliminar');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Link href={`/auto/${auto.id}${vendingToClient ? `?vendingToClient=${vendingToClient}` : ''}`} className="block h-full">
        <div className="rounded-[1.75rem] bg-white border border-slate-200 flex p-4 sm:p-5 items-center gap-4 sm:gap-5 cursor-pointer hover:bg-slate-50/70 hover:border-slate-300 transition-all shadow-sm group h-full min-h-[140px] relative">
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

            {/* Badges de Estado (Superior Izquierda) */}
            {auto.apartados_count && auto.apartados_count > 0 ? (
              <div className="absolute top-2 left-2 bg-slate-900/85 text-white px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider shadow-md backdrop-blur-xs z-10">
                <span>{auto.apartados_count} AP.</span>
              </div>
            ) : auto.interesados_count && auto.interesados_count > 0 ? (
              <div className="absolute top-2 left-2 bg-sky-950/80 text-sky-200 border border-sky-500/30 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider shadow-md backdrop-blur-xs z-10">
                <span>{auto.interesados_count} INT.</span>
              </div>
            ) : null}

            {/* Botón de Eliminación (Superior Derecha - Recuadro Negro) */}
            {isManagerOrDirector && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="absolute top-2 right-2 size-7 rounded-lg bg-slate-950/80 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 hover:border-rose-500 transition-all shadow-md active:scale-90 z-20 backdrop-blur-xs"
                title="Eliminar vehículo"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
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
                  <span className="text-slate-600 font-bold">{auto.vin}</span>
                </div>
              </>
            )}
          </div>

          {/* Fila 2: Días, Precio Sugerido, Apartados / Interesados / Estado */}
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
            ) : auto.interesados_count && auto.interesados_count > 0 ? (
              <>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1">
                  <span className="text-sky-600 font-black uppercase tracking-wider text-[9px]">INTERESADOS</span>
                  <span className="text-slate-700 font-bold">{auto.interesados_count}</span>
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

    {/* Modal de Confirmación de Eliminación */}
    {showDeleteModal && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!deleting) setShowDeleteModal(false);
        }}
      >
        <div 
          className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-200 cursor-default"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Ícono de Advertencia */}
          <div className="size-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-600/10">
            <AlertTriangle className="size-8" />
          </div>

          {/* Mensajes */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              ¿Eliminar vehículo?
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
              ¿Estás seguro de que deseas eliminar permanentemente <strong className="text-slate-900">{auto.marca} {auto.modelo} {auto.anio}</strong> (Stock ID: #{auto.id})? Esta unidad se borrará del inventario y esta acción no se puede deshacer.
            </p>
          </div>

          {/* Error si ocurre */}
          {errorMsg && (
            <div className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* Botones de Confirmación */}
          <div className="flex items-center gap-3 w-full pt-2">
            <button
              type="button"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteModal(false);
              }}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={confirmDelete}
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  <span>Eliminar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
