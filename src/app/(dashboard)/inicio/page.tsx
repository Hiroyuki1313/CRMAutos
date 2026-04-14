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
        <div className="flex flex-col gap-10">
                
                {/* Header Perfil */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="text-slate-400 text-sm font-medium">Bienvenido de nuevo,</span>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{name || 'Usuario'}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--color-primary)]/20">
                                {role}
                            </span>
                        </div>
                    </div>
                    <div className="hidden sm:flex size-14 rounded-2xl bg-white border border-slate-200 items-center justify-center shadow-sm">
                        <User className="size-7 text-slate-300" />
                    </div>
                </div>

                {/* Dashboard de Tráfico */}
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <TrendingUp className="size-4" /> {isManagement ? 'Tráfico Global de Agencia' : 'Mi Tráfico Personal'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/clientes?prob=frio" className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm">
                            <span className="text-slate-400 text-xs font-black uppercase tracking-widest font-mono">01. Fríos</span>
                            <span className="text-4xl font-black text-blue-500">{stats.frio}</span>
                        </Link>
                        <Link href="/clientes?prob=tibio" className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm">
                            <span className="text-slate-400 text-xs font-black uppercase tracking-widest font-mono">02. Tibios</span>
                            <span className="text-4xl font-black text-amber-500">{stats.tibio}</span>
                        </Link>
                        <Link href="/clientes?prob=caliente" className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm">
                            <span className="text-slate-400 text-xs font-black uppercase tracking-widest font-mono">03. Calientes</span>
                            <span className="text-4xl font-black text-red-500">{stats.caliente}</span>
                        </Link>
                    </div>
                </div>

                {/* Administración de Staff (Solo Director) */}
                {role === 'director' && (
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center px-1">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <UserPlus className="size-4" /> Panel de Control de Director
                            </h2>
                        </div>
                        <Link href="/usuarios/nuevo" className="relative group overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] p-8 lg:p-10 flex flex-col gap-6 hover:border-[var(--color-primary)] transition-all duration-500 shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="size-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-all duration-500 group-hover:scale-110">
                                    <UserPlus className="size-8 text-slate-400 group-hover:text-[var(--color-primary)]" />
                                </div>
                                <div className="p-2 rounded-full border border-slate-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                    <ArrowUpRight className="size-5 text-slate-300 group-hover:text-[var(--color-primary)]" />
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 relative z-10 pb-2">
                                <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-1">Estructura Organizacional</span>
                                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Añadir <span className="text-[var(--color-primary)]">Personal</span></h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[320px]">Configura nuevas cuentas y asigna roles estratégicos a tu equipo de trabajo.</p>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Logout Section Mobile Only (already in Sidebar for desktop) */}
                <div className="lg:hidden mt-8 pt-8 border-t border-slate-100">
                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-lg text-slate-900">Cerrar Sesión</span>
                            <span className="text-slate-400 text-xs">Finalizar sesión actual de forma segura</span>
                        </div>
                        <LogoutButton />
                    </div>
                </div>

    );
}
