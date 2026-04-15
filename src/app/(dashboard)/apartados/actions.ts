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

export async function addApartadoCommentAction(id_venta: number, text: string, nextDate?: string) {
  const repo = new MySQLApartadoRepository();
  try {
    const info = await repo.findById(id_venta);
    if (!info) return { error: 'No se encontró el registro' };

    let comments: any[] = [];
    try {
      if (info.comentarios_vendedor) {
        const parsed = JSON.parse(info.comentarios_vendedor);
        comments = Array.isArray(parsed) ? parsed : [{ date: new Date().toISOString(), text: info.comentarios_vendedor }];
      }
    } catch {
      comments = [{ date: new Date().toISOString(), text: info.comentarios_vendedor }];
    }

    const newComment = {
      date: new Date().toISOString(),
      text: text
    };

    comments.unshift(newComment); // Newest first

    const updateData: any = {
      comentarios_vendedor: JSON.stringify(comments),
      proximo_seguimiento_texto: text
    };

    if (nextDate) {
      updateData.fecha_proximo_seguimiento = nextDate;
    }

    const success = await repo.update(id_venta, updateData);

    if (success) {
      revalidatePath('/apartados');
      return { success: true };
    }
    return { error: 'Error al guardar comentario' };
  } catch (error) {
    console.error('Comment Action Error:', error);
    return { error: 'Error de servidor' };
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
