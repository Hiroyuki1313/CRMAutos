import { getSession } from "@/core/usecases/authService";
import { User, Bell, Settings, TrendingUp, UserPlus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/presentation/components/layouts/DashboardLayout";
import { LogoutButton } from "@/presentation/components/molecules/LogoutButton";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";

export const dynamic = 'force-dynamic';

export default async function InicioPage() {
    const session = await getSession();
    const role = session?.role as string;
    const name = session?.name as string;

    const clientRepo = new MySQLClientRepository();
    const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(role);
    const stats = await clientRepo.getProbabilityStats(!isManagement ? session?.userId as number : undefined);

    return (
        <div className="px-6 py-12 lg:px-12 lg:py-16">
            <div className="max-w-5xl mx-auto flex flex-col gap-10">
                
                {/* Header Perfil */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="text-zinc-500 text-sm font-medium">Bienvenido de nuevo,</span>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-neutral-50 tracking-tight">{name || 'Usuario'}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--color-primary)]/20">
                                {role}
                            </span>
                        </div>
                    </div>
                    <div className="hidden sm:flex size-14 rounded-2xl bg-zinc-900 border border-white/5 items-center justify-center shadow-2xl">
                        <User className="size-7 text-zinc-500" />
                    </div>
                </div>

                {/* Dashboard de Tráfico */}
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                            <TrendingUp className="size-4" /> {isManagement ? 'Tráfico Global de Agencia' : 'Mi Tráfico Personal'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/clientes?prob=frio" className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-6 flex flex-col gap-2 hover:bg-blue-600/20 active:scale-[0.98] transition-all">
                            <span className="text-blue-400 text-xs font-black uppercase tracking-widest">Fríos</span>
                            <span className="text-4xl font-black text-blue-500">{stats.frio}</span>
                        </Link>
                        <Link href="/clientes?prob=tibio" className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6 flex flex-col gap-2 hover:bg-yellow-500/20 active:scale-[0.98] transition-all">
                            <span className="text-yellow-500 text-xs font-black uppercase tracking-widest">Tibios</span>
                            <span className="text-4xl font-black text-yellow-500">{stats.tibio}</span>
                        </Link>
                        <Link href="/clientes?prob=caliente" className="bg-red-600/10 border border-red-500/20 rounded-3xl p-6 flex flex-col gap-2 hover:bg-red-600/20 active:scale-[0.98] transition-all shadow-xl shadow-red-600/5">
                            <span className="text-red-500 text-xs font-black uppercase tracking-widest">Calientes</span>
                            <span className="text-4xl font-black text-red-600">{stats.caliente}</span>
                        </Link>
                    </div>
                </div>

                {/* Administración de Staff (Solo Director) */}
                {role === 'director' && (
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center px-1">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                                <UserPlus className="size-4" /> Panel de Control de Director
                            </h2>
                        </div>
                        <Link href="/usuarios/nuevo" className="relative group overflow-hidden bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 lg:p-10 flex flex-col gap-6 hover:bg-zinc-900 transition-all duration-500 shadow-2xl">
                            {/* Background Glow */}
                            <div className="absolute -top-24 -right-24 size-64 bg-[var(--color-primary)]/10 blur-[100px] rounded-full group-hover:bg-[var(--color-primary)]/20 transition-all duration-700" />
                            
                            <div className="flex justify-between items-start relative z-10">
                                <div className="size-16 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-primary-dark)] transition-all duration-500 group-hover:scale-110 shadow-xl">
                                    <UserPlus className="size-8 text-zinc-400 group-hover:text-inherit" />
                                </div>
                                <div className="p-2 rounded-full border border-white/10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                    <ArrowUpRight className="size-5 text-zinc-600 group-hover:text-white" />
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 relative z-10 pb-2">
                                <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-1">Estructura Organizacional</span>
                                <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Añadir <span className="text-[var(--color-primary)]">Personal</span></h3>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[320px]">Configura nuevas cuentas y asigna roles estratégicos a tu equipo de trabajo.</p>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Menú de Usuario / Atajos Rápidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-zinc-900 transition-all duration-300">
                        <div className="flex items-center gap-5">
                            <div className="size-12 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-primary-dark)] transition-colors">
                                <Bell className="size-6 text-zinc-400 group-hover:text-inherit" />
                            </div>
                            <span className="font-bold text-lg">Notificaciones</span>
                        </div>
                        <span className="bg-red-500 size-2.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    </div>

                    <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-zinc-900 transition-all duration-300">
                        <div className="flex items-center gap-5">
                            <div className="size-12 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-primary-dark)] transition-colors">
                                <Settings className="size-6 text-zinc-400 group-hover:text-inherit" />
                            </div>
                            <span className="font-bold text-lg">Configuración de Cuenta</span>
                        </div>
                    </div>
                </div>

                {/* Logout Section Mobile Only (already in Sidebar for desktop) */}
                <div className="lg:hidden mt-8 pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center bg-zinc-900/30 p-6 rounded-3xl border border-white/5">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-lg">Cerrar Sesión</span>
                            <span className="text-zinc-500 text-xs">Finalizar sesión actual de forma segura</span>
                        </div>
                        <LogoutButton />
                    </div>
                </div>

            </div>
        </div>
    );
}
