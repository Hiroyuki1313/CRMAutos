import React from 'react';
import Link from 'next/link';
import { DashboardAccordion } from '@/presentation/components/DashboardAccordion';
import { MetricCard } from '@/presentation/components/MetricCard';
import { Car, BarChart3, Users, Landmark, UserPlus, ArrowUpRight, User } from 'lucide-react';
import { LogoutButton } from "@/presentation/components/molecules/LogoutButton";
import { CRMStats } from '@/core/domain/repositories/IApartadoRepository';

interface VistaGerencialProps {
  name: string;
  role: string;
  crmStats?: CRMStats;
}

export function VistaGerencial({ name, role, crmStats }: VistaGerencialProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const sevenDaysAgoStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Perfil */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <span className="text-slate-400 text-sm font-medium">Panel Ejecutivo,</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{name || 'Director'}</h1>
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

      {/* Grid de 2 Columnas - Dashboard Gerencial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-6">
          <DashboardAccordion title="Inventario" icon={<Car size={24} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard title="Disponibles" value="24" colorType="success" subtitle="En patio" />
              <MetricCard title="Apartados" value="5" colorType="warning" subtitle="Pendiente de firma" />
              <MetricCard title="Vendidos" value="12" colorType="info" subtitle="Este mes" />
            </div>
          </DashboardAccordion>

          <DashboardAccordion title="CRM y Seguimientos" icon={<Users size={24} />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MetricCard 
                title="Prospectos Nuevos" 
                value={crmStats?.prospectosNuevos.total ?? 0} 
                colorType="info" 
                subtitle="Últimos 7 días"
                href="/clientes?filtro=nuevos"
              >
                {!crmStats?.prospectosNuevos.asesores || crmStats.prospectosNuevos.asesores.length === 0 ? (
                  <div className="text-[10px] text-slate-400 italic">Sin prospectos asignados</div>
                ) : (
                  crmStats.prospectosNuevos.asesores.map((item) => (
                    <Link 
                      key={item.vendedor} 
                      href={item.id_vendedor ? `/apartados?vendedores=${item.id_vendedor}&fromAdded=${sevenDaysAgoStr}&toAdded=${todayStr}` : `/apartados?fromAdded=${sevenDaysAgoStr}&toAdded=${todayStr}`} 
                      className="flex justify-between items-center text-xs hover:bg-slate-50 p-1.5 rounded-lg border border-transparent hover:border-slate-100 transition-all group"
                    >
                      <span className="text-slate-500 font-medium truncate max-w-[150px] group-hover:text-[var(--color-primary)] transition-colors">{item.vendedor}</span>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition-all">{item.count}</span>
                    </Link>
                  ))
                )}
              </MetricCard>
              
              <MetricCard 
                title="Citas de Hoy" 
                value={crmStats?.citasDeHoy.total ?? 0} 
                colorType="success"
                href="/apartados"
              >
                {!crmStats?.citasDeHoy.asesores || crmStats.citasDeHoy.asesores.length === 0 ? (
                  <div className="text-[10px] text-slate-400 italic">Sin citas para hoy</div>
                ) : (
                  crmStats.citasDeHoy.asesores.map((item) => (
                    <Link 
                      key={item.vendedor} 
                      href={item.id_vendedor ? `/apartados?vendedores=${item.id_vendedor}&from=${todayStr}&to=${todayStr}` : `/apartados?from=${todayStr}&to=${todayStr}`} 
                      className="flex justify-between items-center text-xs hover:bg-slate-50 p-1.5 rounded-lg border border-transparent hover:border-slate-100 transition-all group"
                    >
                      <span className="text-slate-500 font-medium truncate max-w-[150px] group-hover:text-emerald-600 transition-colors">{item.vendedor}</span>
                      <span className="font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">{item.count}</span>
                    </Link>
                  ))
                )}
              </MetricCard>
              
              <div className="lg:col-span-2">
                 <MetricCard 
                  title="Seguimientos Vencidos" 
                  value={crmStats?.seguimientosVencidos.total ?? 0} 
                  colorType="danger" 
                  subtitle="⚠️ Requieren atención inmediata"
                  href="/apartados?filtro=vencidos"
                 >
                  {!crmStats?.seguimientosVencidos.asesores || crmStats.seguimientosVencidos.asesores.length === 0 ? (
                    <div className="text-[10px] text-slate-400 italic mt-2">Sin seguimientos vencidos</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      {crmStats.seguimientosVencidos.asesores.map((item) => (
                        <Link 
                          key={item.vendedor} 
                          href={item.id_vendedor ? `/apartados?tab=vencidos&vendedores=${item.id_vendedor}` : `/apartados?tab=vencidos`} 
                          className="flex justify-between items-center text-xs bg-rose-50 hover:bg-rose-100/70 p-2.5 rounded-xl border border-rose-100 hover:border-rose-200 transition-all group"
                        >
                          <span className="text-rose-700 font-bold truncate max-w-[180px]">{item.vendedor}</span>
                          <span className="font-black text-rose-700 group-hover:scale-105 transition-transform">{item.count} vencidos</span>
                        </Link>
                      ))}
                    </div>
                  )}
                 </MetricCard>
              </div>
            </div>
          </DashboardAccordion>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          <DashboardAccordion title="Ventas Globales" icon={<BarChart3 size={24} />}>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard title="Ventas del Mes" value="12" colorType="default" />
              <MetricCard title="Ticket Promedio" value="$245,000" colorType="default" subtitle="Valor por unidad" />
              <div className="sm:col-span-2">
                 <MetricCard title="Utilidad del Mes" value="$312,000" colorType="success" subtitle="Beneficio real cerrado" />
              </div>
            </div>
          </DashboardAccordion>

          <DashboardAccordion title="Finanzas e Inversión" icon={<Landmark size={24} />}>
            <div className="space-y-4">
              <MetricCard title="Valor del Inventario" value="$6,850,000" colorType="default" subtitle="Basado en precio objetivo" />
              <MetricCard title="Capital Invertido" value="$5,230,000" colorType="warning" subtitle="Suma de compra + gastos" />
              <MetricCard title="Utilidad Proyectada Global" value="$1,620,000" colorType="success" subtitle="Si se vende todo el stock hoy" />
            </div>
          </DashboardAccordion>
        </div>

      </div>

      {/* Administración de Staff (Director / Gerente) */}
      <div className="flex flex-col gap-6 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center px-1">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <UserPlus className="size-4" /> Gestión de Personal
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

      {/* Logout Section Mobile Only */}
      <div className="lg:hidden mt-4">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-lg text-slate-900">Cerrar Sesión</span>
            <span className="text-slate-400 text-xs">Finalizar sesión actual de forma segura</span>
          </div>
          <LogoutButton />
        </div>
      </div>

    </div>
  );
}
