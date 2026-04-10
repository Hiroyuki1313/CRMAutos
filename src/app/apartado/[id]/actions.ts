'use server';

import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { getSession } from "@/core/usecases/authService";
import { revalidatePath } from "next/cache";

export async function getAvailableAutosAction(query: string) {
  const repo = new MySQLAutoRepository();
  return await repo.getAll({ search: query, estado_logico: 'inventario' });
}

export async function updateApartadoAction(idVenta: number, data: {
    id_carro?: number | null;
    monto_apartado?: number;
    metodo_pago?: any;
    estatus_proceso?: any;
    acudio_cita?: boolean;
    hizo_demo?: boolean;
    toma_a_cuenta?: boolean;
    banco_financiera?: string;
    ofrecimiento_cliente?: number;
    cotizacion_url?: string;
    comentarios_vendedor?: string;
    tipo_accion?: string; // Nuevo campo para la bitácora
    fecha_proximo_seguimiento?: Date | string | null;
}) {
  const session = await getSession();
  if (!session) return { error: 'Sesión no válida' };

  const repo = new MySQLApartadoRepository();
  const current = await repo.findById(idVenta);
  if (!current) return { error: 'Apartado no encontrado' };

  // Lógica de Bitácora (Jerarquía)
  let bitacora: any[] = [];
  try {
    if (current.comentarios_vendedor) {
      const parsed = JSON.parse(current.comentarios_vendedor);
      bitacora = Array.isArray(parsed) ? parsed : [{ text: current.comentarios_vendedor, user: 'Sistema/Migración', date: new Date() }];
    }
  } catch {
    bitacora = [{ text: current.comentarios_vendedor || "", user: 'Sistema/Migración', date: new Date() }];
  }

  // Solo agregar si el comentario es nuevo y distinto al anterior
  if (data.comentarios_vendedor && data.comentarios_vendedor.trim() !== "") {
    bitacora.unshift({
      text: data.comentarios_vendedor.trim(),
      user: session.nombre || session.email,
      date: new Date(),
      tipo_accion: data.tipo_accion || 'Seguimiento'
    });
  }

  // Limpiamos data de los campos que ya no queremos persistir como individuales (o que queremos limpiar)
  // Nota: Usamos undefined en lugar de null para cumplir con la interfaz de Apartado
  const finalData: any = {
    ...data,
    comentarios_vendedor: JSON.stringify(bitacora),
    id_carro: data.id_carro ?? undefined,
    cita_programada: undefined, 
    fecha_recordatorio_mensaje: undefined,
    fecha_proximo_seguimiento: data.fecha_proximo_seguimiento ? new Date(data.fecha_proximo_seguimiento) : undefined
  };
  delete finalData.tipo_accion; 

  try {
    const success = await repo.update(idVenta, finalData);
    if (!success) return { error: 'No se pudo actualizar el apartado' };
    
    revalidatePath(`/apartado/${idVenta}`);
    revalidatePath('/apartados');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating apartado:', error);
    return { error: 'Error interno al actualizar' };
  }
}

export async function deleteLastCommentAction(idVenta: number) {
  const session = await getSession();
  const isManagement = ['director', 'gerente', 'ti', 'redes'].includes(session?.role as string);
  if (!isManagement) return { error: 'No tienes permisos para borrar comentarios' };

  const repo = new MySQLApartadoRepository();
  const current = await repo.findById(idVenta);
  if (!current || !current.comentarios_vendedor) return { error: 'No hay comentarios para borrar' };

  try {
    const bitacora = JSON.parse(current.comentarios_vendedor);
    if (Array.isArray(bitacora) && bitacora.length > 0) {
      bitacora.shift(); // Elimina el último (el primero del array)
      await repo.update(idVenta, { comentarios_vendedor: JSON.stringify(bitacora) });
      revalidatePath(`/apartado/${idVenta}`);
      return { success: true };
    }
    return { error: 'Formato de bitácora inválido' };
  } catch (e) {
    return { error: 'Error al procesar la bitácora' };
  }
}
