'use server';

import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { revalidatePath } from "next/cache";
import { uploadApartadoDocumentAction, deleteApartadoDocumentAction } from "../apartado/[id]/documentActions";

export async function updateApartadoFieldAction(id_venta: number, field: string, value: any) {
  const repo = new MySQLApartadoRepository();
  try {
    const success = await repo.update(id_venta, { [field]: value });
    if (success) {
      revalidatePath('/apartados');
      return { success: true };
    }
    return { error: 'No se pudo actualizar el registro' };
  } catch (error) {
    console.error('Action Error:', error);
    return { error: 'Error interno del servidor' };
  }
}

export async function updateClientFieldAction(id_cliente: number, field: string, value: any) {
    const repo = new MySQLClientRepository();
    try {
      const success = await repo.update(id_cliente, { [field]: value });
      if (success) {
        revalidatePath('/apartados');
        return { success: true };
      }
      return { error: 'No se pudo actualizar el cliente' };
    } catch (error) {
      console.error('Action Error:', error);
      return { error: 'Error interno del servidor' };
    }
}

export { uploadApartadoDocumentAction, deleteApartadoDocumentAction };
