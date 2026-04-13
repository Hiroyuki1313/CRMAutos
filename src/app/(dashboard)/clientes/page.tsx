import { Search, Plus, Phone, Car, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/core/usecases/authService";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";

export const dynamic = 'force-dynamic';

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string, origen?: 'todos' | 'ads' | 'piso' | 'redes', apartado?: 'con' | 'sin' | 'todos', prob?: 'todos' | 'frio' | 'tibio' | 'caliente', vendedores?: string }> }) {
  const session = await getSession();
  const repo = new MySQLClientRepository();
  const role = session?.role as string;
  const isDirector = role === 'director';
  
  const sp = await searchParams;
  const q = sp.q || "";
  const origen = sp.origen || "todos";
  const apartado = sp.apartado || "todos";
  const prob = sp.prob || "todos";
  const vendedoresParams = sp.vendedores ? sp.vendedores.split(',').filter(x => x).map(Number) : [];

  const userRepo = new MySQLUserRepository();
  const vendedoresLista = isDirector ? await userRepo.findAllByRole('vendedor') : [];

  const clientes = await repo.getAll({ 
    search: q, 
    origen, 
    tiene_apartado: apartado, 
    probabilidad: prob, 
    vendedorId: !isDirector ? session?.userId as number : undefined,
    vendedorIds: isDirector && vendedoresParams.length > 0 ? vendedoresParams : undefined
  });

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
        ...(vendedoresParams.length > 0 && { vendedores: vendedoresParams.join(',') }),
        ...updates
    });
    if (updates.origen === 'todos') params.delete('origen');
    if (updates.apartado === 'todos') params.delete('apartado');
    if (updates.prob === 'todos') params.delete('prob');
    return `/clientes?${params.toString()}`;
  };

  return (
    <div className="px-6 py-12 lg:px-12 lg:py-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-zinc-900/40 p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4">
               <div className="size-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20">
                  <Users className="size-6 text-[var(--color-primary)]" />
               </div>
               <h1 className="font-extrabold text-white text-3xl lg:text-4xl tracking-tight">
                   Clientes
               </h1>
            </div>
            <Link 
                href="/clientes/nuevo" 
                className="font-bold rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 active:scale-95 transition-all text-[var(--color-primary-dark)] text-sm px-6 py-3 flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/10"
            >
                <Plus className="size-5" />
                <span>Nuevo Cliente</span>
            </Link>
        </div>

        {/* Filtro por Vendedor (Solo Director) */}
        {isDirector && vendedoresLista.length > 0 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500 bg-zinc-900/40 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-2 px-2">
                    <Users className="size-3.5 text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Filtrar por Asesor</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link 
                        href={buildUrl({ vendedores: '' })}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${vendedoresParams.length === 0 ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-zinc-950/50 text-zinc-500 border-white/5 hover:border-white/20'}`}
                    >
                        Todos
                    </Link>
                    {vendedoresLista.map(v => {
                        const isSelected = vendedoresParams.includes(v.id);
                        const newVendedores = isSelected 
                            ? vendedoresParams.filter(id => id !== v.id)
                            : [...vendedoresParams, v.id];
                        
                        return (
                            <Link 
                                key={v.id}
                                href={buildUrl({ vendedores: newVendedores.join(',') })}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' : 'bg-zinc-950/50 text-zinc-500 border-white/5 hover:border-white/20'}`}
                            >
                                {v.nombre}
                            </Link>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Búsqueda y Filtros */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Buscador */}
            <div className="lg:col-span-1 space-y-4">
                <div className="relative group">
                    <form action="/clientes" method="GET" className="relative w-full">
                    <Search className="size-4 top-1/2 -translate-y-1/2 text-zinc-500 absolute left-4 group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <input
                        name="q"
                        defaultValue={q}
                        type="text"
                        placeholder="Buscar cliente..."
                        className="outline-none rounded-2xl bg-zinc-900/50 text-neutral-50 text-sm border-white/10 hover:border-white/20 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all border pl-12 pr-4 py-4 w-full"
                    />
                    {origen !== 'todos' && <input type="hidden" name="origen" value={origen} />}
                    {apartado !== 'todos' && <input type="hidden" name="apartado" value={apartado} />}
                    {prob !== 'todos' && <input type="hidden" name="prob" value={prob} />}
                    </form>
                </div>
            </div>

            {/* Chips de Filtros */}
            <div className="lg:col-span-3 flex flex-wrap gap-3 items-center">
                <div className="flex flex-wrap gap-2">
                    <Link href={buildUrl({ origen: 'todos' })} className={`whitespace-nowrap font-bold rounded-full text-[10px] uppercase px-4 py-2 transition-all ${origen === 'todos' ? 'bg-zinc-100 text-zinc-950 shadow-lg' : 'bg-transparent border border-white/10 text-zinc-500 hover:border-white/30'}`}>
                        Orígenes
                    </Link>
                    {['ads', 'piso', 'redes'].map(o => (
                        <Link key={o} href={buildUrl({ origen: o })} className={`whitespace-nowrap font-bold rounded-full text-[10px] uppercase px-4 py-2 transition-all ${origen === o ? 'bg-[var(--color-primary)] text-[var(--color-primary-dark)]' : 'bg-transparent border border-white/10 text-zinc-500 hover:border-white/30'}`}>
                            {o}
                        </Link>
                    ))}
                </div>

                <div className="h-6 w-[1px] bg-white/5 hidden md:block" />

                <div className="flex flex-wrap gap-2">
                    <Link href={buildUrl({ prob: 'todos' })} className={`whitespace-nowrap font-bold rounded-full text-[10px] uppercase px-4 py-2 transition-all ${prob === 'todos' ? 'bg-zinc-100 text-zinc-950 shadow-lg' : 'bg-transparent border border-white/10 text-zinc-500 hover:border-white/30'}`}>
                        Tráfico
                    </Link>
                    <Link href={buildUrl({ prob: 'frio' })} className={`whitespace-nowrap font-bold rounded-full text-[10px] uppercase px-4 py-2 transition-all ${prob === 'frio' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-transparent border border-white/10 text-blue-400 hover:border-blue-400/30'}`}>
                        Frío
                    </Link>
                    <Link href={buildUrl({ prob: 'tibio' })} className={`whitespace-nowrap font-bold rounded-full text-[10px] uppercase px-4 py-2 transition-all ${prob === 'tibio' ? 'bg-yellow-500 text-yellow-950 shadow-lg shadow-yellow-500/20' : 'bg-transparent border border-white/10 text-yellow-500 hover:border-yellow-500/30'}`}>
                        Tibio
                    </Link>
                    <Link href={buildUrl({ prob: 'caliente' })} className={`whitespace-nowrap font-bold rounded-full text-[10px] uppercase px-4 py-2 transition-all ${prob === 'caliente' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-transparent border border-white/10 text-red-500 hover:border-red-500/30'}`}>
                        Caliente
                    </Link>
                </div>

                <div className="h-6 w-[1px] bg-white/5 hidden md:block" />

                <div className="flex flex-wrap gap-2">
                    <Link href={buildUrl({ apartado: 'todos' })} className={`whitespace-nowrap font-bold rounded-full text-[10px] uppercase px-4 py-2 transition-all ${apartado === 'todos' ? 'bg-zinc-100 text-zinc-950 shadow-lg' : 'bg-transparent border border-white/10 text-zinc-500 hover:border-white/30'}`}>
                        Estatus
                    </Link>
                    <Link href={buildUrl({ apartado: 'con' })} className={`whitespace-nowrap font-bold rounded-full text-[10px] uppercase px-4 py-2 transition-all flex items-center gap-2 ${apartado === 'con' ? 'bg-yellow-500 text-yellow-950' : 'bg-transparent border border-white/10 text-zinc-500 hover:border-white/30'}`}>
                        <Car className="size-3" /> Con Apartado
                    </Link>
                </div>
            </div>
        </div>

        {/* Lista de Clientes - Grid en Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientes.length === 0 && (
                <div className="col-span-full py-24 text-center text-zinc-500 text-sm bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
                    No se encontraron clientes con estos filtros.
                </div>
            )}
            
            {clientes.map(c => (
              <Link href={`/cliente/${c.id}`} key={c.id} className="group flex">
                <div className="w-full rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-[var(--color-primary)]/50 transition-all duration-300 p-6 flex flex-col gap-4 group-hover:bg-zinc-900 group-hover:shadow-2xl group-hover:shadow-[var(--color-primary)]/5">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <span className="font-extrabold text-white text-lg lg:text-xl truncate leading-tight">
                                {c.nombre}
                            </span>
                            <div className="flex items-center gap-2">
                                <Phone className="size-3.5 text-zinc-500" />
                                <span className="text-zinc-500 text-sm font-medium">
                                    {c.telefono}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                           <div className={`p-1 rounded-full ${probColors[c.probabilidad] || 'bg-zinc-500'}`} />
                           <span className={`font-black rounded-full text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 ${originColors[c.origen] || 'bg-zinc-800 text-zinc-400'}`}>
                                {c.origen}
                           </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                         {c.tiene_apartado && (
                            <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 font-black rounded-full text-[9px] uppercase tracking-widest px-3 py-1 border border-yellow-500/20">
                                <Car className="size-3" />
                                Con Apartado
                            </span>
                        )}
                        <span className="text-zinc-400 text-[10px] font-bold uppercase py-1 px-3 bg-white/5 rounded-full border border-white/5 capitalize">
                            {c.probabilidad}
                        </span>
                    </div>

                    {c.comentarios_vendedor && (
                      <div className="mt-auto bg-zinc-950/60 p-4 rounded-2xl border border-white/5 group-hover:border-[var(--color-primary)]/10 transition-colors">
                          <div className="flex items-start gap-3">
                              <MessageSquare className="size-4 text-[var(--color-primary)] mt-0.5 opacity-50" />
                              <span className="text-zinc-400 text-xs leading-relaxed italic line-clamp-2">
                                  "{c.comentarios_vendedor}"
                              </span>
                          </div>
                      </div>
                    )}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
