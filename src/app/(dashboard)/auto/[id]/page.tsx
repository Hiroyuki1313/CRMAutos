import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { 
    ArrowLeft, 
    Car, 
    FileText, 
    HandCoins, 
    Edit3,
    Calendar,
    Gauge,
    Users,
    Activity,
    ShieldCheck,
    ChevronRight,
    MapPin
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SelectionAction } from "./_components/SelectionAction";
import { AutoDetailCarousel } from "./_components/AutoDetailCarousel";
import { AutoDocumentManager } from "./_components/AutoDocumentManager";
import { ModuleHeader } from "@/presentation/components/molecules/ModuleHeader";

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
    notFound();
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
    <div className="flex flex-col gap-10 bg-slate-50/50 min-h-screen pb-24">
      
      {/* Dynamic Module Header */}
      <ModuleHeader 
        Icon={Car}
        title={`${auto.marca} ${auto.modelo}`}
        subtitle={`Stock ID: #${auto.id} · ${auto.anio}`}
        action={{
            label: "Editar Vehículo",
            href: `/auto/${auto.id}/edit`,
            icon: Edit3
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start px-6 lg:px-12">
        
        {/* Left Column: Media & Documents */}
        <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Visual Section */}
            <div className="bg-white rounded-[3rem] p-4 lg:p-6 border border-slate-200 shadow-sm">
                <AutoDetailCarousel photos={photos} alt={`${auto.marca} ${auto.modelo}`} />
            </div>

            {/* Expediente Digital Section */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-1 px-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                         <div className="size-2 rounded-full bg-indigo-500" />
                         Expediente Digital
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Documentación legal y técnica de la unidad</p>
                </div>
                
                <AutoDocumentManager 
                    autoId={auto.id} 
                    initialData={{
                        url_factura: auto.url_factura || null,
                        url_tarjeta_circulacion: auto.url_tarjeta_circulacion || null,
                        url_poliza_seguro: auto.url_poliza_seguro || null,
                        url_ine_propietario: auto.url_ine_propietario || null,
                        url_contrato_compraventa: auto.url_contrato_compraventa || null,
                    }} 
                />
            </div>
        </div>

        {/* Right Column: Key Details & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-8 sticky top-24">
            
            {/* Main Specs Card */}
            <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col gap-10 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Car className="size-48" />
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${isFrio ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {isFrio ? 'Módulo Avalúo' : 'Stock Disponible'}
                        </span>
                        <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                            <ShieldCheck className="size-5 text-slate-300" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-10 gap-x-6 relative z-10">
                    <InfoBox label="Marca" value={auto.marca} Icon={Activity} />
                    <InfoBox label="Modelo" value={auto.modelo} Icon={ChevronRight} />
                    <InfoBox label="Año" value={auto.anio.toString()} Icon={Calendar} />
                    <InfoBox label="Versión" value={auto.version || "Estándar"} Icon={ShieldCheck} />
                    <InfoBox label="Kilometraje" value={`${auto.kilometraje?.toLocaleString() || 0} km`} Icon={Gauge} />
                    <InfoBox label="Nº Dueños" value={`${auto.numero_duenos || 1}`} Icon={Users} />
                </div>

                {auto.apartados_count && auto.apartados_count > 0 ? (
                    <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4 animate-in slide-in-from-right-4 duration-500">
                        <div className="size-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <HandCoins className="size-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Comprometido</span>
                            <span className="text-xs font-bold text-amber-800">{auto.apartados_count} Seguimientos Activos</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-[1px] bg-slate-100 my-2" />
                )}

                {vendingToClient ? (
                    <div className="pt-4">
                        <SelectionAction autoId={auto.id} clientId={parseInt(vendingToClient, 10)} />
                    </div>
                ) : (
                    <div className="pt-4 flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <Activity className="size-5 text-indigo-500" />
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Referencia para venta directa</p>
                    </div>
                )}
            </div>

            {/* Logical Status Footer Widget */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col gap-5 border border-white/5 shadow-2xl">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                        <Gauge className="size-6 text-indigo-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estatus de Control</span>
                        <h4 className="text-white font-extrabold text-lg tracking-tight">Registro de Stock</h4>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-xs text-slate-400 font-bold uppercase">Estado Actual:</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${isFrio ? 'text-blue-400' : 'text-emerald-400'}`}>
                        {auto.estado_logico}
                    </span>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, Icon }: { label: string, value: string, Icon: any }) {
    return (
        <div className="flex flex-col gap-2 group/info">
            <div className="flex items-center gap-2">
                <Icon className="size-3.5 text-slate-300 group-hover/info:text-indigo-500 transition-colors" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <span className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight pl-5 truncate">{value}</span>
        </div>
    );
}
