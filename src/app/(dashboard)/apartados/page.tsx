import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { HandCoins } from "lucide-react";
import { SeguimientosTable } from "@/presentation/components/organisms/SeguimientosTable";
import { ModuleHeader } from "@/presentation/components/molecules/ModuleHeader";
import { getSession } from "@/core/usecases/authService";

export const dynamic = 'force-dynamic';

export default async function ApartadosPage({ searchParams }: { searchParams: Promise<{ q?: string, tab?: 'todos' | 'hoy' | 'semana' | 'vencidos' | 'criticos', vendedores?: string, from?: string, to?: string, prob?: string, origen?: string, credito?: string }> }) {
  const repo = new MySQLApartadoRepository();
  const userRepo = new MySQLUserRepository();

  const sp = await searchParams;
  const q = sp.q || "";
  const tab = sp.tab || "todos";
  const vendedoresParams = sp.vendedores ? sp.vendedores.split(',').filter(x => x).map(Number) : [];
  const { from, to, prob, origen, credito } = sp;

  const session = await getSession();
  const role = session?.role as string;
  const isDirector = role === 'director';
  const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(role);
  const canReassign = ['director', 'gerente'].includes(role);

  const vendedoresLista = isManagement 
    ? await userRepo.findAllEligibleForSales() 
    : (session?.userId ? [await userRepo.findById(session.userId as number)].filter(Boolean) as any[] : []);

  // One single optimized call to get everything
  const apartados = await repo.getAll({ 
    search: q, 
    tab, 
    vendedorId: !isDirector ? session?.userId as number : undefined,
    vendedorIds: isDirector && vendedoresParams.length > 0 ? vendedoresParams : undefined,
    from,
    to,
    probabilidad: prob,
    origen,
    estatus_credito: credito
  });

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-100px)] overflow-hidden -mb-24">
        
        {/* Unified Interface: Header + Controls + Table */}
        <div className="flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <SeguimientosTable 
                data={apartados} 
                vendedores={vendedoresLista}
                canReassign={canReassign}
                isDirector={isDirector}
                title="Seguimientos"
                subtitle={`${apartados.length} trámites activos`}
            />
            {apartados.length === 0 && (
                <div className="py-32 text-center text-slate-400 text-sm bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm mt-6">
                    {tab === 'criticos' ? 'No hay seguimientos con rezago crítico.' : 'No hay registros que coincidan con los filtros actuales.'}
                </div>
            )}
        </div>

    </div>
  );
}
