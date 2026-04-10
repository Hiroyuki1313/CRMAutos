import { BottomNav } from "@/presentation/components/organisms/BottomNav";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { Search, Plus, Phone, Car, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/core/usecases/authService";

export const dynamic = 'force-dynamic';

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string, origen?: 'todos' | 'ads' | 'piso' | 'redes', apartado?: 'con' | 'sin' | 'todos', prob?: 'todos' | 'frio' | 'tibio' | 'caliente' }> }) {
  const session = await getSession();
  const role = session?.role as string;
  const repo = new MySQLClientRepository();
  
  const sp = await searchParams;
  const q = sp.q || "";
  const origen = sp.origen || "todos";
  const apartado = sp.apartado || "todos";
  const prob = sp.prob || "todos";

  const clientes = await repo.getAll({ search: q, origen, tiene_apartado: apartado, probabilidad: prob });

  const probColors = {
    'frio': 'bg-blue-400',
    'tibio': 'bg-yellow-500',
    'caliente': 'bg-red-500'
  };

  const originColors = {
    'ads': 'bg-purple-600/20 text-purple-400',
    'piso': 'bg-blue-600/20 text-blue-400',
    'redes': 'bg-green-600/20 text-green-400'
  };

  // Helper to build URL with current filters
  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams({
        ...(q && { q }),
        ...(origen !== 'todos' && { origen }),
        ...(apartado !== 'todos' && { apartado }),
        ...(prob !== 'todos' && { prob }),
        ...updates
    });
    // Remove defaults to keep URL clean
    if (updates.origen === 'todos') params.delete('origen');
    if (updates.apartado === 'todos') params.delete('apartado');
    if (updates.prob === 'todos') params.delete('prob');
    return `/clientes?${params.toString()}`;
  };

  return (
    <div className="bg-[var(--color-surface-bg)] text-neutral-50 w-full min-h-[100dvh] overflow-hidden font-sans flex flex-col">
      <div className="overflow-y-auto flex px-6 pt-2 pb-24 flex-col flex-1 gap-6">
        {/* Header */}
        <div className="flex pt-2 justify-between items-center">
            <h1 className="font-bold text-neutral-50 text-2xl leading-8">
                Clientes
            </h1>
            <div className="flex items-center gap-2">
                <Link 
                    href="/clientes/nuevo" 
                    className="font-semibold rounded-lg bg-[var(--color-primary)] hover:bg-[#ffe040] transition-colors text-[var(--color-primary-dark)] text-sm leading-5 flex px-4 py-2 items-center gap-2"
                >
                    <Plus className="size-4" />
                    <span>Nuevo</span>
                </Link>
            </div>
        </div>

        {/* Búsqueda */}
        <div className="relative">
            <form action="/clientes" method="GET" className="relative w-full">
              <Search className="size-4 top-1/2 -translate-y-1/2 text-[#9f9fa9] absolute left-4" />
              <input
                  name="q"
                  defaultValue={q}
                  type="text"
                  placeholder="Buscar por nombre o teléfono..."
                  className="outline-none rounded-xl bg-[var(--color-card-bg)] text-neutral-50 text-sm leading-5 border-white/10 hover:border-white/20 focus:border-[var(--color-primary)] transition-colors border pl-10 pr-4 py-3 w-full"
              />
              {origen !== 'todos' && <input type="hidden" name="origen" value={origen} />}
              {apartado !== 'todos' && <input type="hidden" name="apartado" value={apartado} />}
              {prob !== 'todos' && <input type="hidden" name="prob" value={prob} />}
            </form>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-2">
          {/* Origen */}
          <div className="overflow-x-auto flex items-center gap-2 pb-1 no-scrollbar">
              <Link href={buildUrl({ origen: 'todos' })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all ${origen === 'todos' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 border border-white/5 text-zinc-500'}`}>
                  Orígenes
              </Link>
              {['ads', 'piso', 'redes'].map(o => (
                <Link key={o} href={buildUrl({ origen: o })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all ${origen === o ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)]' : 'bg-zinc-900 border border-white/5 text-zinc-500'}`}>
                    {o}
                </Link>
              ))}
          </div>

          {/* Probabilidad (Tráfico) */}
          <div className="overflow-x-auto flex items-center gap-2 pb-1 no-scrollbar">
              <Link href={buildUrl({ prob: 'todos' })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all ${prob === 'todos' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 border border-white/5 text-zinc-500'}`}>
                  Tráfico
              </Link>
              <Link href={buildUrl({ prob: 'frio' })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all ${prob === 'frio' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-900 border border-white/5 text-blue-400'}`}>
                  Frío
              </Link>
              <Link href={buildUrl({ prob: 'tibio' })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all ${prob === 'tibio' ? 'bg-yellow-500 text-yellow-950 shadow-lg shadow-yellow-500/20' : 'bg-zinc-900 border border-white/5 text-yellow-500'}`}>
                  Tibio
              </Link>
              <Link href={buildUrl({ prob: 'caliente' })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all ${prob === 'caliente' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-zinc-900 border border-white/5 text-red-500'}`}>
                  Caliente
              </Link>
          </div>

          {/* Apartado */}
          <div className="overflow-x-auto flex items-center gap-2 pb-1 no-scrollbar">
              <Link href={buildUrl({ apartado: 'todos' })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all ${apartado === 'todos' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 border border-white/5 text-zinc-500'}`}>
                  Status
              </Link>
              <Link href={buildUrl({ apartado: 'con' })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all flex items-center gap-1.5 ${apartado === 'con' ? 'bg-yellow-500 text-yellow-950' : 'bg-zinc-900 border border-white/5 text-zinc-500'}`}>
                  <Car className="size-3" /> Con Apartado
              </Link>
              <Link href={buildUrl({ apartado: 'sin' })} className={`whitespace-nowrap font-bold rounded-lg text-[10px] uppercase px-3 py-1.5 transition-all ${apartado === 'sin' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 border border-white/5 text-zinc-500'}`}>
                  Sin Apartado
              </Link>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="flex flex-col gap-4">
            {clientes.length === 0 && (
                <div className="py-12 text-center text-[#9f9fa9] text-sm">
                    No se encontraron clientes con estos filtros.
                </div>
            )}
            
            {clientes.map(c => (
              <Link href={`/cliente/${c.id}`} key={c.id} className="group">
                <div className="rounded-xl bg-[var(--color-card-bg)] border-white/10 hover:border-white/20 transition-all border p-4 flex flex-col gap-3 group-hover:bg-zinc-900">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-50 text-base leading-6">
                            {c.nombre}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <span className={`size-2 rounded-full ${probColors[c.probabilidad] || 'bg-zinc-500'}`} />
                                <span className="text-[#9f9fa9] text-xs leading-4 capitalize">
                                    {c.probabilidad}
                                </span>
                            </span>
                            <span className={`font-medium rounded-full text-[10px] uppercase tracking-wider leading-4 px-2.5 py-0.5 ${originColors[c.origen] || 'bg-zinc-800 text-zinc-400'}`}>
                                {c.origen}
                            </span>
                            {c.tiene_apartado && (
                                <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 font-black rounded-full text-[9px] uppercase tracking-widest px-2.5 py-0.5 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                                    <Car className="size-3" />
                                    Con Apartado
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Phone className="size-3.5 text-[#9f9fa9]" />
                        <span className="text-[#9f9fa9] text-sm leading-5">
                            {c.telefono}
                        </span>
                    </div>

                    {c.comentarios_vendedor && (
                      <div className="flex items-start gap-2 bg-zinc-950/40 p-2 rounded-lg border border-white/5">
                          <MessageSquare className="size-3.5 text-[#9f9fa9] mt-0.5" />
                          <span className="truncate text-[#9f9fa9] text-xs leading-4 italic">
                              "{c.comentarios_vendedor}"
                          </span>
                      </div>
                    )}
                </div>
              </Link>
            ))}
        </div>
      </div>
      
      <BottomNav role={role} />
    </div>
  );
}
