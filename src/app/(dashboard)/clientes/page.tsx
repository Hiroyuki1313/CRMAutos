import { ModuleHeader } from "@/presentation/components/molecules/ModuleHeader";
import { getSession } from "@/core/usecases/authService";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import ClientesTable from "@/presentation/components/organisms/ClientesTable";
import { Search, Users, Plus } from "lucide-react";
import Link from "next/link";

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
  const vendedoresLista = isDirector 
    ? await userRepo.findAllByRole('vendedor') 
    : (session?.userId ? [await userRepo.findById(session.userId as number)].filter(Boolean) as any[] : []);

  const clientes = await repo.getAll({ 
    search: q, 
    origen, 
    tiene_apartado: apartado, 
    probabilidad: prob, 
    vendedorId: !isDirector ? session?.userId as number : undefined,
    vendedorIds: isDirector && vendedoresParams.length > 0 ? vendedoresParams : undefined
  });

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
    <div className="flex flex-col gap-10">
        
        {/* Row 1: Título y Acción Principal */}
        <ModuleHeader 
            title="Directorio"
            subtitle={`${clientes.length} registros actuales`}
            Icon={Users}
            action={{
                label: "Nuevo Registro",
                href: "/clientes/nuevo",
                icon: Plus
            }}
        />


        {/* Row 3: Tabla de Gestión Centralizada */}
        <ClientesTable 
            data={clientes} 
            vendedores={vendedoresLista} 
            isDirector={isDirector} 
        />

    </div>
  );
}
