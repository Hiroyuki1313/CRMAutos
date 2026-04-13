'use server';

import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { getSession } from "@/core/usecases/authService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getAvailableAutosAction(query: string) {
  const repo = new MySQLAutoRepository();
  // Filter by 'inventario' status as per user request
  return await repo.getAll({ search: query, estado_logico: 'inventario' });
}

export async function createClientAction(formData: FormData) {
  const clientRepo = new MySQLClientRepository();
  const apartadoRepo = new MySQLApartadoRepository();
  const autoRepo = new MySQLAutoRepository();
  const session = await getSession();

  if (!session) return { error: 'No tienes una sesión activa' };

  const nombre = formData.get('nombre') as string;
  const telefono = formData.get('telefono') as string;
  const origen = formData.get('origen') as any;
  const probabilidad = formData.get('probabilidad') as any;
  const comentarios = formData.get('comentarios') as string;

  // Apartado data (optional)
  const idCarro = formData.get('id_carro') ? parseInt(formData.get('id_carro') as string, 10) : null;
  const montoApartado = formData.get('monto_apartado') ? parseFloat(formData.get('monto_apartado') as string) : null;
  const metodoPago = formData.get('metodo_pago') as any;
  const abrirTramite = formData.get('abrir_tramite') === 'true';

  if (!nombre || !telefono) {
    return { error: 'Nombre y teléfono son obligatorios' };
  }

  try {
    // 1. Create or get Client
    let clientId: number;
    const existing = await clientRepo.findByPhone(telefono);
    
    if (existing) {
      clientId = existing.id;
      // Optionally update probability/comments if lead exists
      await clientRepo.update(clientId, { probabilidad, comentarios_vendedor: comentarios });
    } else {
      clientId = await clientRepo.create({
        nombre,
        telefono,
        id_vendedor: session.userId as number,
        origen: origen || 'piso',
        probabilidad: probabilidad || 'frio',
        comentarios_vendedor: comentarios || '',
      });
    }

    // 2. Create Apartado if car selected OR explicit trámite requested
    if (idCarro || abrirTramite) {
        await apartadoRepo.create({
            id_venta: 0, // Auto-increment
            id_cliente: clientId,
            id_vendedor: session.userId as number,
            id_carro: idCarro || undefined,
            monto_apartado: montoApartado || 0,
            metodo_pago: metodoPago || 'contado',
            acudio_cita: true, 
            estatus_proceso: 'proceso',
            toma_a_cuenta: false,
            hizo_demo: false
        });
    }

  } catch (err) {
    console.error(err);
    return { error: 'Error al procesar el registro' };
  }

  revalidatePath('/clientes');
  revalidatePath('/apartados');
  redirect('/clientes');
}
