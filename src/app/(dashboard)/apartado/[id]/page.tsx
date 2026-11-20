import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { getSession } from "@/core/usecases/authService";
import { notFound } from "next/navigation";
import { DetalleApartadoClient } from "./DetalleApartadoClient";

export const dynamic = 'force-dynamic';

export default async function DetalleApartadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idVenta = parseInt(id, 10);

  if (isNaN(idVenta)) return notFound();

  const repo = new MySQLApartadoRepository();
  const autoRepo = new MySQLAutoRepository();
  const clientRepo = new MySQLClientRepository();
  const userRepo = new MySQLUserRepository();

  const apartado = await repo.findById(idVenta);
  if (!apartado) return notFound();

  // Hydrate related data
  const cliente = await clientRepo.findByPhone(apartado.telefono_prospecto || '');
  const auto = apartado.id_carro ? await autoRepo.findById(apartado.id_carro) : null;
  
  const session = await getSession();
  const role = session?.role as string;

  const currentUser = session?.userId ? await userRepo.findById(session.userId as number) : null;
  const userEmail = ((session as any)?.email || currentUser?.email || '').toLowerCase().trim();
  const isSpecialSalesEditor = userEmail === 'alexa_acevedo26@yahoo.com';
  const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(role || '');
  const canEdit = isManagement || isSpecialSalesEditor || (session?.userId ? apartado.id_vendedor === session.userId : false);

  return (
    <DetalleApartadoClient 
        apartado={JSON.parse(JSON.stringify(apartado))} 
        cliente={JSON.parse(JSON.stringify(cliente))} 
        auto={JSON.parse(JSON.stringify(auto))}
        role={role}
        currentUserId={session?.userId as number}
        canEdit={canEdit}
    />
  );
}
