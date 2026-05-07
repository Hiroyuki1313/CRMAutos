'use server';

import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { getSession } from "@/core/usecases/authService";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getAvailableAutosAction(query: string) {
  const repo = new MySQLAutoRepository();
// Filter by 'inventario' status as per user request
  return await repo.getAll({ search: query, estado_logico: 'inventario' });
}

export async function checkPhoneAction(phone: string) {
  const repo = new MySQLClientRepository();
  const existing = await repo.findByPhone(phone);
  if (existing) {
    return { 
      exists: true, 
      name: existing.nombre,
      vendor: existing.nombre_vendedor || 'Sistema'
    };
  }
  return { exists: false };
}

export async function createClientAction(formData: FormData) {
  const clientRepo = new MySQLClientRepository();
  const session = await getSession();

  if (!session) return { error: 'No tienes una sesión activa' };

  const nombre = formData.get('nombre') as string;
  const telefono = formData.get('telefono') as string;
  const origen = formData.get('origen') as any;
  const probabilidad = formData.get('probabilidad') as any;
  const comentarios = formData.get('comentarios') as string;



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



  } catch (err) {
    console.error(err);
    return { error: 'Error al procesar el registro' };
  }

  revalidatePath('/clientes');
  revalidatePath('/apartados');
  redirect('/clientes');
}
