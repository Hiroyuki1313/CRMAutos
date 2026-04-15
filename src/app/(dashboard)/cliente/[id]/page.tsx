import { BottomNav } from "@/presentation/components/organisms/BottomNav";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  FileText, 
  ChevronRight, 
  Car, 
  Calendar,
  Thermometer,
  ShieldCheck,
  FileCheck,
  CreditCard,
  User,
  Info
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/core/usecases/authService";
import { ClientBitacora } from "./_components/ClientBitacora";
import { DocumentManager } from "./_components/DocumentManager";

export const dynamic = 'force-dynamic';

export default async function DetalleClientePage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params;
  const clientId = parseInt(id, 10);
  if (isNaN(clientId)) return notFound();

  const sp = await searchParams;
  const activeTab = sp.tab || 'info';

  const clientRepo = new MySQLClientRepository();
  const apartadoRepo = new MySQLApartadoRepository();
  const autoRepo = new MySQLAutoRepository();

  const session = await getSession();
  const role = session?.role as string;

  const cliente = await clientRepo.findById(clientId);
  if (!cliente) return notFound();

  // Get history from apartados
  const apartadosRaw = await apartadoRepo.getAll(); // Ideally findByClient if exists, but we'll filter for now 
  const clientApartados = await Promise.all(
      apartadosRaw
        .filter(a => a.id_cliente === clientId)
        .map(async (a) => {
            const auto = a.id_carro ? await autoRepo.findById(a.id_carro) : null;
            return { ...a, auto };
        })
  );

  const probColors = {
    'frio': 'bg-blue-600',
    'tibio': 'bg-yellow-500',
    'caliente': 'bg-red-500'
  };

  const probText = {
    'frio': 'Frío',
    'tibio': 'Tibio',
    'caliente': 'Caliente'
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
                    <h1 className="font-extrabold text-slate-900 text-3xl lg:text-4xl tracking-tight">{cliente.nombre}</h1>
                    <div className="flex items-center gap-2">
                        <Phone className="size-4 text-slate-400" />
                        <span className="text-slate-500 font-bold">{cliente.telefono}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
                <span className="font-black rounded-full text-[10px] uppercase tracking-[0.2em] bg-blue-600/10 text-blue-400 px-4 py-2 border border-blue-500/10">
                    Campaña: {cliente.origen}
                </span>
                <div className="flex gap-3">
                    <a href={`tel:${cliente.telefono}`} className="rounded-2xl bg-white p-4 flex justify-center items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 border border-slate-200 shadow-sm">
                        <Phone className="size-5 text-[var(--color-primary)]" />
                    </a>
                    <button className="rounded-2xl bg-white p-4 flex justify-center items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 border border-slate-200 shadow-sm">
                        <MessageCircle className="size-5 text-emerald-500" />
                    </button>
                    <button className="rounded-2xl bg-white px-6 py-4 flex justify-center items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 border border-slate-200 shadow-sm font-bold text-sm text-slate-600">
                        <ArrowLeft className="size-4" />
                        Atrás
                    </button>
                </div>
            </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-8 border-b border-white/5">
          <Link 
            href={`?tab=info`} 
            className={`font-black text-xs uppercase tracking-widest pb-4 transition-all relative ${activeTab === 'info' ? 'text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Detalles & Bitácora
            {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
          </Link>
          <Link 
            href={`?tab=docs`} 
            className={`font-black text-xs uppercase tracking-widest pb-4 transition-all relative ${activeTab === 'docs' ? 'text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Expediente Digital
            {activeTab === 'docs' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-lg shadow-[var(--color-primary)]/20" />}
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-10">
            {activeTab === 'info' ? (
              <>
                <ClientBitacora 
                    clientId={clientId} 
                    initialComentarios={cliente.comentarios_vendedor || ""} 
                    initialProbabilidad={cliente.probabilidad}
                    role={role}
                />

                {/* Autos de Interés */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-black uppercase text-xs leading-4 tracking-[0.2em] text-slate-400 flex items-center gap-3">
                    <Car className="size-4" /> Historial de Interés
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientApartados.length === 0 && (
                      <div className="col-span-full bg-white border border-dashed border-slate-200 p-12 rounded-[2rem] text-center text-slate-400 text-sm italic shadow-sm">
                        No hay apartados o intereses registrados aún.
                      </div>
                    )}
                    {clientApartados.map((a) => (
                      <Link href={`/apartado/${a.id_venta}`} key={a.id_venta} className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-5 hover:border-[var(--color-primary)] transition-all group overflow-hidden shadow-sm hover:shadow-md">
                        <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                            <Car className="size-8 text-slate-200 group-hover:text-[var(--color-primary)] transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-slate-900 text-base truncate">{a.auto ? `${a.auto.marca} ${a.auto.modelo}` : `Unidad por definir`}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${a.estatus_proceso === 'proceso' ? 'bg-blue-600/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                    {a.estatus_proceso}
                                </span>
                                <span className="text-slate-400 font-bold text-[10px] uppercase">
                                    {a.auto?.year || a.auto?.anio}
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="size-5 text-slate-200 group-hover:text-slate-900 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <DocumentManager cliente={cliente} />
            )}
          </div>
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
