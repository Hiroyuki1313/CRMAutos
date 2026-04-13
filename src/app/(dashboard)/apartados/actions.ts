'use server';

import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { revalidatePath } from "next/cache";

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
