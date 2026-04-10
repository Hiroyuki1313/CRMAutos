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
    <div className="bg-zinc-950 text-neutral-50 w-full min-h-[100dvh] overflow-y-auto font-sans pb-32">
      {/* Header Profile */}
      <div className="px-6 pt-10 pb-6 bg-zinc-900/50 border-b border-white/5">
        <div className="flex mb-6 items-center gap-4">
          <Link href="/clientes" className="rounded-full bg-zinc-800 p-2 hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="size-5 text-neutral-50" />
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-neutral-50 text-xl leading-7">{cliente.nombre}</h1>
            <p className="text-sm text-[#9f9fa9]">{cliente.telefono}</p>
          </div>
          <span className="font-semibold rounded-full text-[10px] uppercase tracking-widest bg-blue-600 text-white px-3 py-1">
            {cliente.origen}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
             <a href={`tel:${cliente.telefono}`} className="flex-1 rounded-xl bg-zinc-800 py-3 flex justify-center items-center gap-2 hover:bg-zinc-700 transition-colors">
                <Phone className="size-4 text-[var(--color-primary)]" />
                <span className="text-sm font-medium">Llamar</span>
             </a>
             <button className="flex-1 rounded-xl bg-zinc-800 py-3 flex justify-center items-center gap-2 hover:bg-zinc-700 transition-colors">
                <MessageCircle className="size-4 text-green-400" />
                <span className="text-sm font-medium">WhatsApp</span>
             </button>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-6 border-b border-white/10">
          <Link 
            href={`?tab=info`} 
            className={`font-semibold text-sm leading-5 pb-2 transition-all ${activeTab === 'info' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[#9f9fa9]'}`}
          >
            Info
          </Link>
          <Link 
            href={`?tab=docs`} 
            className={`font-semibold text-sm leading-5 pb-2 transition-all ${activeTab === 'docs' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[#9f9fa9]'}`}
          >
            Documentos
          </Link>
        </div>
      </div>

      <div className="px-6 py-6 flex flex-col gap-8">
        {activeTab === 'info' ? (
          <>
            <ClientBitacora 
                clientId={clientId} 
                initialComentarios={cliente.comentarios_vendedor || ""} 
                initialProbabilidad={cliente.probabilidad}
                role={role}
            />

            {/* Autos de Interés (From Apartados) */}
            <div className="flex flex-col gap-3 mt-8">
              <h3 className="font-semibold uppercase text-xs leading-4 tracking-wider text-[#9f9fa9] flex items-center gap-2">
                <Car className="size-3" /> Autos de Interés / Apartados
              </h3>
              <div className="flex flex-col gap-3">
                {clientApartados.length === 0 && (
                  <div className="bg-zinc-900/40 border border-dashed border-white/10 p-6 rounded-2xl text-center text-zinc-500 text-sm italic">
                    No hay apartados o intereses registrados aún.
                  </div>
                )}
                {clientApartados.map((a) => (
                  <Link href={`/apartado/${a.id_venta}`} key={a.id_venta} className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-zinc-800 transition-colors group">
                    <div className="size-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Car className="size-6 text-zinc-600 group-hover:text-[var(--color-primary)] transition-colors" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm">{a.auto ? `${a.auto.marca} ${a.auto.modelo}` : `Auto #${a.id_carro}`}</p>
                        <p className="text-xs text-zinc-500 capitalize">{a.auto?.tipo || 'Vehículo'} · ${a.monto_apartado}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${a.estatus_proceso === 'proceso' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                        {a.estatus_proceso}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Pestaña de Documentos */
          <div className="flex flex-col gap-4">
             <h3 className="font-semibold uppercase text-xs leading-4 tracking-wider text-[#9f9fa9] mb-2 flex items-center gap-2">
                <ShieldCheck className="size-3" /> Expediente Digital
             </h3>
             
             <DocItem label="Identificación Oficial (INE)" url={cliente.ine_url} icon={<User className="size-4" />} />
             <DocItem label="Comprobante de Domicilio" url={cliente.comprobante_domicilio_url} icon={<MapPin className="size-4" />} />
             <DocItem label="Estados de Cuenta" url={cliente.estados_cuenta_url} icon={<CreditCard className="size-4" />} />
             <DocItem label="Licencia / Contrato" url={cliente.licencia_contrato_url} icon={<FileCheck className="size-4" />} />
             <DocItem label="Póliza de Seguro" url={cliente.seguro_url} icon={<ShieldCheck className="size-4" />} />

             <div className="mt-8 p-6 border border-dashed border-white/10 rounded-2xl text-center">
                <p className="text-xs text-zinc-500 mb-4 font-medium uppercase tracking-widest">¿Necesitas cargar un nuevo archivo?</p>
                <button className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                    Configurar servicio de carga (Hostinger)
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
         <Link 
            href={`/?vendingToClient=${cliente.id}`} 
            className="font-bold rounded-xl text-base leading-6 flex py-4 px-6 justify-center items-center gap-2 w-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-colors"
         >
            <Car className="size-5" />
            Apartar Vehículo
         </Link>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-24 left-6 right-6 z-30">
        <button className="font-bold rounded-xl text-base leading-6 flex py-4 justify-center items-center gap-2 w-full bg-[#f0b100] text-[#733e0a] shadow-xl shadow-[#f0b100]/10">
            <Info className="size-5" />
            Gestionar Seguimiento
        </button>
      </div>

      <BottomNav role={role} />
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
