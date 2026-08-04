import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { MySQLVentaRepository } from "@/infrastructure/repositories/MySQLVentaRepository";
import { 
  ArrowLeft, 
  Phone, 
  ChevronRight, 
  Car, 
  Calendar,
  ShieldCheck,
  User,
  CheckCircle2,
  Tag,
  DollarSign,
  UserCheck,
  Clock,
  FileText
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/core/usecases/authService";
import { ClientBitacora } from "./_components/ClientBitacora";
import { DocumentManager } from "./_components/DocumentManager";

export const dynamic = 'force-dynamic';

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function DetalleClientePage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ tab?: string, from?: string }> }) {
  const { id } = await params;
  const clientId = parseInt(id, 10);
  if (isNaN(clientId)) return notFound();

  const sp = await searchParams;
  const activeTab = sp.tab || 'info';

  const clientRepo = new MySQLClientRepository();
  const apartadoRepo = new MySQLApartadoRepository();
  const autoRepo = new MySQLAutoRepository();
  const ventaRepo = new MySQLVentaRepository();

  const session = await getSession();
  const role = session?.role as string;

  const cliente = await clientRepo.findById(clientId);
  if (!cliente) return notFound();

  const isComprador = cliente.probabilidad === 'venta';

  // Get sales history directly from `ventas` table
  const ventasCliente = await ventaRepo.findByClientId(clientId);

  // Get apartados history
  const apartadosRaw = await apartadoRepo.getAll();
  const clientApartados = await Promise.all(
      apartadosRaw
        .filter(a => a.telefono_prospecto === cliente.telefono)
        .map(async (a) => {
            const auto = a.id_carro ? await autoRepo.findById(a.id_carro) : null;
            return { ...a, auto };
        })
  );

  const probColors: Record<string, string> = {
    'rechazo': 'bg-red-600',
    'frio': 'bg-sky-400',
    'medio': 'bg-yellow-400',
    'alto': 'bg-emerald-500',
    'venta': 'bg-emerald-600'
  };

  return (
    <div className="px-6 py-12 lg:px-12 lg:py-16 bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Header Profile */}
        <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex items-center gap-6 flex-1">
                <div className="size-20 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-200 shadow-sm relative">
                    <User className="size-10 text-slate-300" />
                    <div className={`absolute -bottom-1 -right-1 size-5 rounded-full border-4 border-white ${probColors[cliente.probabilidad] || 'bg-slate-500'}`} />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h1 className="font-extrabold text-slate-900 text-3xl lg:text-4xl tracking-tight">{cliente.nombre}</h1>
                      {isComprador && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Cliente Comprador
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Phone className="size-4 text-slate-400" />
                          <span>{cliente.telefono}</span>
                        </div>
                        <span className="size-1 rounded-full bg-slate-300"></span>
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-400">
                          <Calendar className="size-3.5" />
                          <span>Registrado: {formatDate(cliente.fecha_registro)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
                <span className="font-black rounded-full text-[10px] uppercase tracking-[0.2em] bg-blue-600/10 text-blue-500 px-4 py-2 border border-blue-500/10">
                    Origen: {cliente.origen}
                </span>
                <div className="flex gap-3">
                    <Link 
                        href={sp.from === 'clientes' ? "/clientes" : "/apartados"} 
                        className="rounded-2xl bg-white px-6 py-4 flex justify-center items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 border border-slate-200 shadow-sm font-bold text-sm text-slate-600"
                    >
                        <ArrowLeft className="size-4" />
                        Atrás
                    </Link>
                </div>
            </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-8 border-b border-slate-200">
          <Link 
            href={`?tab=info${sp.from ? `&from=${sp.from}` : ''}`} 
            className={`font-black text-xs uppercase tracking-widest pb-4 transition-all relative ${activeTab === 'info' ? 'text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Info
            {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
          </Link>
          <Link 
            href={`?tab=documentos${sp.from ? `&from=${sp.from}` : ''}`} 
            className={`font-black text-xs uppercase tracking-widest pb-4 transition-all relative ${activeTab === 'documentos' ? 'text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Documentos
            {activeTab === 'documentos' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
          </Link>
          <Link 
            href={`?tab=vehiculos${sp.from ? `&from=${sp.from}` : ''}`} 
            className={`font-black text-xs uppercase tracking-widest pb-4 transition-all relative ${activeTab === 'vehiculos' ? 'text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Vehículos Adquiridos ({ventasCliente.length})
            {activeTab === 'vehiculos' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
          </Link>
        </div>
 
        <div className="flex flex-col gap-10">
          {activeTab === 'info' ? (
            <div className="flex flex-col gap-8">
              {/* Informacion Principal / Campos Solicitados */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6">
                <h3 className="font-black uppercase text-xs leading-4 tracking-[0.2em] text-slate-400 flex items-center gap-3">
                  <UserCheck className="size-4" /> Ficha Técnica del Cliente
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nombre Completo</span>
                    <p className="font-extrabold text-slate-900 text-base">{cliente.nombre}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Teléfono de Contacto</span>
                    <p className="font-extrabold text-slate-900 text-base">{cliente.telefono}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fecha de Registro</span>
                    <p className="font-extrabold text-slate-900 text-base">{formatDate(cliente.fecha_registro)}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Origen del Cliente</span>
                    <p className="font-extrabold text-slate-900 text-base uppercase">{cliente.origen}</p>
                  </div>
                </div>
              </div>

              {/* Bitácora de seguimiento / notas */}
              <ClientBitacora 
                  clientId={clientId} 
                  initialComentarios={cliente.comentarios_vendedor || ""} 
                  initialProbabilidad={cliente.probabilidad}
                  role={role}
              />
            </div>
          ) : activeTab === 'documentos' ? (
            <DocumentManager cliente={cliente} />
          ) : (
            /* Vehículos Adquiridos (Pestaña Ventas basada en tabla ventas) */
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black uppercase text-xs leading-4 tracking-[0.2em] text-slate-400 flex items-center gap-3">
                  <Car className="size-4" /> Historial de Vehículos Comprados
                </h3>
                <span className="text-xs font-bold text-slate-400">Total: {ventasCliente.length} unidades</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ventasCliente.length === 0 && (
                  <div className="col-span-full bg-white border border-dashed border-slate-200 p-12 rounded-[2rem] text-center text-slate-400 text-sm italic shadow-sm">
                    No se registran autos entregados o vendidos en la tabla de ventas para este cliente.
                  </div>
                )}
                {ventasCliente.map((v) => (
                  <div key={v.id} className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Car className="size-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-slate-900 text-lg truncate">{v.marca} {v.modelo}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            Año: {v.anio}
                          </span>
                          <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            Vendido
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Precio de Venta</span>
                        <span className="font-black text-slate-900 text-sm">${v.precio_venta.toLocaleString('es-MX')} MXN</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Fecha de Venta</span>
                        <span className="font-bold text-slate-700">{formatDate(v.fecha_venta)}</span>
                      </div>
                      {v.nombre_vendedor && (
                        <div className="col-span-2 pt-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Vendedor Asignado</span>
                          <span className="font-bold text-slate-800">{v.nombre_vendedor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocItem({ label, url, icon }: { label: string, url?: string, icon: React.ReactNode }) {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${url ? 'bg-zinc-900 border-white/10' : 'bg-transparent border-white/5 opacity-40'}`}>
            <div className={`size-10 rounded-lg flex items-center justify-center ${url ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{label}</p>
                <p className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500">{url ? 'Disponible' : 'Pendiente'}</p>
            </div>
            {url && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <FileText className="size-5 text-[var(--color-primary)]" />
                </a>
            )}
        </div>
    );
}

function MapPin({ className }: { className: string }) {
    // Re-importing locally or using string name if needed, but standard is fine
    return <Info className={className} /> 
}
