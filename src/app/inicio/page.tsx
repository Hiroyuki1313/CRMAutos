import { BottomNav } from "@/presentation/components/organisms/BottomNav";
import { LogoutButton } from "@/presentation/components/molecules/LogoutButton";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { getSession } from "@/core/usecases/authService";
import { User, Bell, Settings, TrendingUp, Flame, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function InicioPage() {
    const session = await getSession();
    const role = session?.role as string;
    const name = session?.name as string;

    const clientRepo = new MySQLClientRepository();
    const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(role);
    const stats = await clientRepo.getProbabilityStats(!isManagement ? session?.userId as number : undefined);

    return (
        <div className="bg-zinc-950 text-neutral-50 h-screen w-full flex flex-col overflow-hidden font-sans">
            <div className="flex-1 overflow-y-auto pb-24 px-6 pt-12 custom-scrollbar">
                <div className="max-w-md mx-auto flex flex-col gap-8">
                    
                    {/* Header Perfil */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <span className="text-zinc-500 text-sm font-medium">Bienvenido de nuevo,</span>
                            <h1 className="text-2xl font-bold text-neutral-50">{name || 'Usuario'}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[var(--color-primary)]/20">
                                    {role}
                                </span>
                            </div>
                        </div>
                        <div className="size-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                            <User className="size-6 text-zinc-500" />
                        </div>
                    </div>

                    {/* Dashboard de Tráfico moved to Inicio */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                                <TrendingUp className="size-3" /> {isManagement ? 'Tráfico Global de Agencia' : 'Mi Tráfico Personal'}
                            </h2>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <Link href="/clientes?prob=frio" className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col gap-1 active:scale-95 transition-all">
                                <span className="text-blue-400 text-[10px] font-black uppercase tracking-tighter">Fríos</span>
                                <span className="text-2xl font-black text-blue-500">{stats.frio}</span>
                            </Link>
                            <Link href="/clientes?prob=tibio" className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex flex-col gap-1 active:scale-95 transition-all">
                                <span className="text-yellow-500 text-[10px] font-black uppercase tracking-tighter">Tibios</span>
                                <span className="text-2xl font-black text-yellow-500">{stats.tibio}</span>
                            </Link>
                            <Link href="/clientes?prob=caliente" className="bg-red-600/10 border border-red-500/20 rounded-2xl p-4 flex flex-col gap-1 active:scale-95 transition-all shadow-lg shadow-red-600/5">
                                <span className="text-red-500 text-[10px] font-black uppercase tracking-tighter">Calientes</span>
                                <span className="text-2xl font-black text-red-600">{stats.caliente}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Menú de Usuario / Atajos Rápidos */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 rounded-3xl bg-zinc-900/50 border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-zinc-900 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                                    <Bell className="size-5 text-zinc-400" />
                                </div>
                                <span className="font-bold text-sm">Notificaciones</span>
                            </div>
                            <span className="bg-red-500 size-2 rounded-full shadow-lg shadow-red-500/50" />
                        </div>

                        <div className="p-4 rounded-3xl bg-zinc-900/50 border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-zinc-900 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                                    <Settings className="size-5 text-zinc-400" />
                                </div>
                                <span className="font-bold text-sm">Configuración</span>
                            </div>
                        </div>

                        {/* Logout Section */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-sm">Cerrar Sesión</span>
                                    <span className="text-zinc-500 text-[10px]">Finalizar sesión actual de forma segura</span>
                                </div>
                                <LogoutButton />
                            </div>
                        </div>
                    </div>



                </div>
            </div>

            <BottomNav role={role} />
        </div>
    );
}
