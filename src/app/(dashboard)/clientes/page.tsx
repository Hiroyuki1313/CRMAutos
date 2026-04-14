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

  const probColorsClass = {
    'frio': 'bg-blue-500',
    'tibio': 'bg-amber-500',
    'caliente': 'bg-red-500'
  };

  const originStyles = {
    'ads': 'bg-purple-50 text-purple-600 border-purple-100',
    'piso': 'bg-blue-50 text-blue-600 border-blue-100',
    'redes': 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };

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
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 lg:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-5">
               <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 shadow-xl shadow-[var(--color-primary)]/5">
                  <Users className="size-8 text-[var(--color-primary)]" />
               </div>
               <div className="flex flex-col">
                  <h1 className="font-extrabold text-slate-900 text-3xl lg:text-4xl tracking-tight">Clientes</h1>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Directorio y prospección</p>
               </div>
            </div>
            <Link 
                href="/clientes/nuevo" 
                className="font-black rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 active:scale-95 transition-all text-white text-sm px-8 py-4 flex items-center gap-2 shadow-xl shadow-[var(--color-primary)]/20 uppercase tracking-widest"
            >
                <Plus className="size-5" />
                <span>Nuevo Cliente</span>
            </Link>
        </div>

        {/* Filtro por Vendedor (Solo Director) */}
        {isDirector && vendedoresLista.length > 0 && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <Users className="size-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Filtrar por Asesor</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link 
                        href={buildUrl({ vendedores: '' })}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${vendedoresParams.length === 0 ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
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
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
                            >
                                {v.nombre}
                            </Link>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Búsqueda y Filtros */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="relative group w-full lg:max-w-md">
                <form action="/clientes" method="GET" className="relative w-full">
                <Search className="size-4 top-1/2 -translate-y-1/2 text-slate-400 absolute left-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                    name="q"
                    defaultValue={q}
                    type="text"
                    placeholder="Buscar cliente..."
                    className="outline-none rounded-[1.5rem] bg-white text-slate-900 text-sm border-slate-200 hover:border-slate-300 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all border pl-12 pr-6 py-4 w-full font-bold shadow-sm"
                />
                {origen !== 'todos' && <input type="hidden" name="origen" value={origen} />}
                {apartado !== 'todos' && <input type="hidden" name="apartado" value={apartado} />}
                {prob !== 'todos' && <input type="hidden" name="prob" value={prob} />}
                </form>
            </div>

            <div className="flex flex-wrap gap-4 items-center bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
                <div className="flex items-center gap-1">
                    <Link href={buildUrl({ origen: 'todos' })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${origen === 'todos' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                        Orígenes
                    </Link>
                    {['ads', 'piso', 'redes'].map(o => (
                        <Link key={o} href={buildUrl({ origen: o })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${origen === o ? 'bg-white text-[var(--color-primary)] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                            {o}
                        </Link>
                    ))}
                </div>

                <div className="h-4 w-[1px] bg-slate-200" />

                <div className="flex items-center gap-1">
                    <Link href={buildUrl({ prob: 'todos' })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${prob === 'todos' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                        Tráfico
                    </Link>
                    <Link href={buildUrl({ prob: 'frio' })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${prob === 'frio' ? 'text-blue-500 bg-white border border-blue-100 shadow-sm' : 'text-slate-400 hover:text-blue-400'}`}>
                        Frío
                    </Link>
                    <Link href={buildUrl({ prob: 'tibio' })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${prob === 'tibio' ? 'text-amber-500 bg-white border border-amber-100 shadow-sm' : 'text-slate-400 hover:text-amber-400'}`}>
                        Tibio
                    </Link>
                    <Link href={buildUrl({ prob: 'caliente' })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all ${prob === 'caliente' ? 'text-red-500 bg-white border border-red-100 shadow-sm' : 'text-slate-400 hover:text-red-400'}`}>
                        Caliente
                    </Link>
                </div>

                <div className="h-4 w-[1px] bg-slate-200" />

                <Link href={buildUrl({ apartado: 'con' })} className={`whitespace-nowrap font-black rounded-xl text-[9px] uppercase px-4 py-2 transition-all flex items-center gap-2 ${apartado === 'con' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-400 hover:text-slate-600 bg-white border border-slate-200'}`}>
                    <Car className="size-3" /> Con Apartado
                </Link>
            </div>
        </div>

        {/* Lista de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clientes.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
                    <Users className="size-16 mb-6 text-slate-100" />
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">No se encontraron clientes</p>
                </div>
            )}
            
            {clientes.map(c => (
              <Link href={`/cliente/${c.id}`} key={c.id} className="group flex">
                <div className="w-full rounded-[2.5rem] bg-white border border-slate-200 hover:border-[var(--color-primary)]/50 transition-all duration-300 p-8 flex flex-col gap-6 shadow-sm hover:shadow-xl">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1.5 overflow-hidden">
                            <span className="font-black text-slate-900 text-2xl tracking-tight leading-tight group-hover:text-[var(--color-primary)] transition-colors truncate">
                                {c.nombre}
                            </span>
                            <div className="flex items-center gap-2.5">
                                <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                                    <Phone className="size-4 text-slate-400 group-hover:text-[var(--color-primary)]" />
                                </div>
                                <span className="text-slate-500 text-sm font-bold">
                                    {c.telefono}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 shrink-0">
                           <div className={`size-3 rounded-full shadow-lg ${probColorsClass[c.probabilidad] || 'bg-slate-300'}`} />
                           <span className={`font-black rounded-xl text-[8px] uppercase tracking-widest px-3 py-1.5 border ${originStyles[c.origen] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                {c.origen}
                           </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                         {c.tiene_apartado && (
                            <span className="flex items-center gap-2 bg-amber-50 text-amber-600 font-black rounded-xl text-[9px] uppercase tracking-widest px-4 py-2 border border-amber-100 shadow-sm shadow-amber-500/5">
                                <Car className="size-3.5" />
                                Con Apartado
                            </span>
                        )}
                        <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest py-2 px-4 bg-slate-50 rounded-xl border border-slate-100">
                             {c.probabilidad}
                        </span>
                    </div>

                    {c.comentarios_vendedor && (
                      <div className="mt-2 bg-slate-50/80 p-5 rounded-[1.5rem] border border-slate-100 group-hover:border-[var(--color-primary)]/10 transition-colors relative">
                          <MessageSquare className="size-4 text-[var(--color-primary)] absolute -top-2 -left-2 bg-white rounded-lg p-1 border border-slate-100 shadow-sm" />
                          <span className="text-slate-500 text-xs leading-relaxed italic line-clamp-3 block pl-2 font-medium">
                              "{c.comentarios_vendedor}"
                          </span>
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
