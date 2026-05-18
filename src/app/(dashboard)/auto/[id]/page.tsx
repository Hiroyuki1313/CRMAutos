import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { getSession } from "@/core/usecases/authService";
import { notFound } from "next/navigation";
import { DetalleAutoClient } from "./DetalleAutoClient";

export const dynamic = 'force-dynamic';

export default async function AutoDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ vendingToClient?: string }> }) {
  const repo = new MySQLAutoRepository();
  const unwrappedParams = await params;
  const sp = await searchParams;
  const vendingToClient = sp.vendingToClient;
  const autoId = parseInt(unwrappedParams.id, 10);
  
  if (isNaN(autoId)) {
    notFound();
  }

  const auto = await repo.findById(autoId);

  if (!auto) {
    notFound();
  }

  const session = await getSession();
  const role = session?.role as string;

  return (
    <DetalleAutoClient 
        auto={JSON.parse(JSON.stringify(auto))}
        vendingToClient={vendingToClient}
        role={role}
    />
  );
}
