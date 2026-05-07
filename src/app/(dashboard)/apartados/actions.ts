'use server';

import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { revalidatePath } from "next/cache";
import { uploadApartadoDocumentAction, deleteApartadoDocumentAction } from "../apartado/[id]/documentActions";
import { getSession } from "@/core/usecases/authService";

export async function updateApartadoFieldAction(id_venta: number, field: string, value: any) {
  const repo = new MySQLApartadoRepository();
  const clientRepo = new MySQLClientRepository();
  try {
    const success = await repo.update(id_venta, { [field]: value });
    
    if (success) {
      // Logic for promotion to Client
      if (field === 'probabilidad' && value === 'Venta') {
        const apartado = await repo.findById(id_venta);
        if (apartado) {
          const existingClient = await clientRepo.findByPhone(apartado.telefono_prospecto || '');
          if (!existingClient && (apartado.nombre_prospecto || (apartado as any).cliente?.nombre)) {
            // Promote prospect to Client
            await clientRepo.create({
              nombre: apartado.nombre_prospecto || (apartado as any).cliente?.nombre,
              telefono: apartado.telefono_prospecto || (apartado as any).cliente?.telefono || '',
              id_vendedor: apartado.id_vendedor as number,
              origen: apartado.origen_prospecto || 'prospectos de piso',
              probabilidad: 'venta',
              comentarios_vendedor: apartado.proximo_seguimiento_texto || '',
              ine_url: apartado.ine_url,
              comprobante_domicilio_url: apartado.comprobante_domicilio_url,
              estados_cuenta_url: apartado.estados_cuenta_url,
              licencia_contrato_url: apartado.licencia_contrato_url,
              seguro_url: apartado.seguro_url
            });
          }
        }
      }

      revalidatePath('/apartados');
      revalidatePath('/clientes');
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

export async function createSeguimientoAction(formData: FormData) {
  const repo = new MySQLApartadoRepository();
  const session = await getSession();
  if (!session) return { error: 'No autorizado' };

  const nombre = formData.get('nombre') as string;
  const telefono = formData.get('telefono') as string;
  const comentarios = formData.get('comentarios') as string;
  const origen = formData.get('origen') as any;

  if (!nombre || !telefono) return { error: 'Nombre y teléfono son obligatorios' };

  try {
    const initialComments = comentarios ? JSON.stringify([{
        date: new Date().toISOString(),
        text: comentarios
    }]) : '';

    await repo.create({
        id_venta: 0,
        id_vendedor: session.userId as number,
        nombre_prospecto: nombre,
        telefono_prospecto: telefono,
        origen_prospecto: origen || 'prospectos de piso',
        comentarios_vendedor: initialComments,
        proximo_seguimiento_texto: comentarios || '',
        estatus_credito: 'pendiente respuesta',
        acudio_cita: false,
        hizo_demo: false,
        toma_a_cuenta: false
    } as any);

    revalidatePath('/apartados');
    return { success: true };
  } catch (err) {
    console.error('Create Seguimiento Error:', err);
    return { error: 'Error al registrar el seguimiento' };
  }
}

export { uploadApartadoDocumentAction, deleteApartadoDocumentAction };
