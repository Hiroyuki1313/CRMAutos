import { getSession } from "@/core/usecases/authService";
import { getSalesInitialDataAction } from "@/core/usecases/salesService";
import { redirect } from "next/navigation";
import { VentasClient } from "./VentasClient";

export const dynamic = 'force-dynamic';

export default async function VentasPage() {
  const session = await getSession();
  
  // Strict role guard: only 'director' has access
  if (!session || session.role !== 'director') {
    redirect("/inicio");
  }

  // Pre-load catalogs for sales filters
  const initialDataResult = await getSalesInitialDataAction();
  
  if ("error" in initialDataResult) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-extrabold text-xs">
        Error cargando el módulo de ventas: {initialDataResult.error}
      </div>
    );
  }

  return (
    <VentasClient 
      vendedores={initialDataResult.vendedores || []}
    />
  );
}
