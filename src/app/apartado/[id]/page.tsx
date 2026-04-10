import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
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

  const apartado = await repo.findById(idVenta);
  if (!apartado) return notFound();

  // Hydrate related data
  const cliente = apartado.id_cliente ? await clientRepo.findById(apartado.id_cliente) : null;
  const auto = apartado.id_carro ? await autoRepo.findById(apartado.id_carro) : null;
  
  const session = await getSession();
  const role = session?.role as string;

  return (
    <DetalleApartadoClient 
        apartado={JSON.parse(JSON.stringify(apartado))} 
        cliente={JSON.parse(JSON.stringify(cliente))} 
        auto={JSON.parse(JSON.stringify(auto))}
        role={role}
    />
  );
}
