import { getSession } from "@/core/usecases/authService";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { VistaVendedor } from "./_components/VistaVendedor";
import { VistaGerencial } from "./_components/VistaGerencial";

export const dynamic = 'force-dynamic';

export default async function InicioPage() {
    const session = await getSession();
    const role = session?.role as string;
    const name = session?.name as string;

    const isManagement = ['director', 'gerente'].includes(role?.toLowerCase());

    if (isManagement) {
        const apartadoRepo = new MySQLApartadoRepository();
        const crmStats = await apartadoRepo.getCRMStats();
        // RENDERIZA EL NUEVO DASHBOARD DIRECTIVO
        return <VistaGerencial name={name} role={role} crmStats={crmStats} />;
    } else {
        // RENDERIZA LA VISTA PERSONAL DE VENDEDOR
        const clientRepo = new MySQLClientRepository();
        const stats = await clientRepo.getProbabilityStats(session?.userId as number);
        
        return <VistaVendedor name={name} role={role} stats={stats} />;
    }
}
