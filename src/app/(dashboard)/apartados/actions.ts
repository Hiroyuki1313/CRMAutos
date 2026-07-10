'use server';

import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { revalidatePath } from "next/cache";
import { uploadApartadoDocumentAction, deleteApartadoDocumentAction } from "../apartado/[id]/documentActions";
import { getSession } from "@/core/usecases/authService";
import pool from "@/infrastructure/db/connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";


export async function updateApartadoFieldAction(id_venta: number, field: string, value: any) {
  const repo = new MySQLApartadoRepository();
  const clientRepo = new MySQLClientRepository();
  try {
    let finalValue = value;
    if (field === 'fecha_proximo_seguimiento' && (!value || value === '')) {
      const twoDaysLater = new Date();
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      finalValue = twoDaysLater.toISOString().split('T')[0];
    }
    const success = await repo.update(id_venta, { [field]: finalValue });
    
    if (success) {
      if (field === 'probabilidad' && value === 'Venta') {
        const apartado = await repo.findById(id_venta);
        if (apartado) {
          const existingClient = await clientRepo.findByPhone(apartado.telefono_prospecto || '');
          if (!existingClient && (apartado.nombre_prospecto || (apartado as any).cliente?.nombre)) {
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

    const session = await getSession();
    const authorName = session?.name || 'Desconocido';

    const newComment = {
      date: new Date().toISOString(),
      text: text,
      author: authorName
    };

    comments.unshift(newComment);
    const updateData: any = {
      comentarios_vendedor: JSON.stringify(comments),
      proximo_seguimiento_texto: text
    };

    if (nextDate && nextDate !== '') {
      updateData.fecha_proximo_seguimiento = nextDate;
    } else {
      const twoDaysLater = new Date();
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      updateData.fecha_proximo_seguimiento = twoDaysLater.toISOString().split('T')[0];
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

    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    const defaultFollowUpDate = twoDaysLater.toISOString().split('T')[0];

    await repo.create({
        id_venta: 0,
        id_vendedor: session.userId as number,
        nombre_prospecto: nombre,
        telefono_prospecto: telefono,
        origen_prospecto: origen || 'prospectos de piso',
        comentarios_vendedor: initialComments,
        proximo_seguimiento_texto: comentarios || '',
        fecha_proximo_seguimiento: defaultFollowUpDate,
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

export async function checkDuplicatePhoneAction(telefono: string) {
    const apartadosRepo = new MySQLApartadoRepository();
    const clientesRepo = new MySQLClientRepository();

    try {
        const prospecto = await apartadosRepo.findByPhone(telefono);
        if (prospecto) {
            return { 
                found: true, 
                type: 'seguimiento', 
                nombre: prospecto.nombre_prospecto, 
                vendedor: (prospecto as any).nombre_vendedor || 'Desconocido' 
            };
        }

        const cliente = await clientesRepo.findByPhone(telefono);
        if (cliente) {
            return { 
                found: true, 
                type: 'directorio', 
                nombre: cliente.nombre, 
                vendedor: (cliente as any).nombre_vendedor || 'Desconocido' 
            };
        }

        return { found: false };
    } catch (error) {
        console.error('Check Duplicate Error:', error);
        return { error: 'Error al verificar duplicado' };
    }
}

export async function confirmSaleFromSeguimientoAction(id_venta: number, precio_venta: number, fecha_venta_str: string) {
  const session = await getSession();
  if (!session) return { error: "No autorizado" };

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Obtener apartado
    const [apartadoRows] = await conn.query<RowDataPacket[]>(
      "SELECT * FROM apartados WHERE id_venta = ?",
      [id_venta]
    );
    if (!apartadoRows.length) {
      await conn.rollback();
      return { error: "No se encontró el seguimiento seleccionado." };
    }
    const apartado = apartadoRows[0];

    const id_auto = apartado.id_carro;
    if (!id_auto) {
      await conn.rollback();
      return { error: "Este seguimiento no tiene ningún vehículo asignado. Asigna un vehículo antes de confirmar la venta." };
    }

    // 2. Obtener auto y sus costos
    const [autoRows] = await conn.query<RowDataPacket[]>(
      "SELECT * FROM autos WHERE id = ?",
      [id_auto]
    );
    if (!autoRows.length) {
      await conn.rollback();
      return { error: "El vehículo asignado a este seguimiento no existe." };
    }
    const auto = autoRows[0];

    // Calcular costo de acondicionamiento acumulado
    const costo_acondicionamiento = 
      Number(auto.acondicionamiento_llantas || 0) +
      Number(auto.acondicionamiento_pintura || 0) +
      Number(auto.acondicionamiento_mecanica || 0) +
      Number(auto.acondicionamiento_refacciones || 0) +
      Number(auto.acondicionamiento_accesorios || 0) +
      Number(auto.acondicionamiento_limpieza || 0) +
      Number(auto.acondicionamiento_tapiceria || 0) +
      Number(auto.acondicionamiento_odometros || 0) +
      Number(auto.acondicionamiento_pulido || 0) +
      Number(auto.acondicionamiento_mecanica_servicios || 0) +
      Number(auto.acondicionamiento_mecanica_reparaciones || 0);

    // 3. Traspaso o creación del cliente
    let id_cliente: number | null = null;
    const [clientRows] = await conn.query<RowDataPacket[]>(
      "SELECT * FROM clientes WHERE telefono = ?",
      [apartado.telefono_prospecto]
    );

    if (clientRows.length > 0) {
      // Cliente ya existe en el directorio: lo actualizamos con los datos y documentos más recientes del seguimiento
      const existingClient = clientRows[0];
      id_cliente = existingClient.id;

      await conn.query(
        `UPDATE clientes SET 
          nombre = ?, 
          id_vendedor = ?, 
          ine_url = ?, 
          comprobante_domicilio_url = ?, 
          estados_cuenta_url = ?, 
          licencia_contrato_url = ?, 
          seguro_url = ?, 
          probabilidad = 'venta', 
          comentarios_vendedor = ?
        WHERE id = ?`,
        [
          apartado.nombre_prospecto || existingClient.nombre,
          apartado.id_vendedor || existingClient.id_vendedor,
          apartado.ine_url || existingClient.ine_url,
          apartado.comprobante_domicilio_url || existingClient.comprobante_domicilio_url,
          apartado.estados_cuenta_url || existingClient.estados_cuenta_url,
          apartado.licencia_contrato_url || existingClient.licencia_contrato_url,
          apartado.seguro_url || existingClient.seguro_url,
          apartado.comentarios_vendedor || existingClient.comentarios_vendedor,
          id_cliente
        ]
      );
    } else {
      // Cliente no existe: lo creamos desde cero en el directorio de clientes
      const [insertResult] = await conn.query<ResultSetHeader>(
        `INSERT INTO clientes (nombre, telefono, id_vendedor, origen, ine_url, comprobante_domicilio_url, estados_cuenta_url, licencia_contrato_url, seguro_url, probabilidad, comentarios_vendedor) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'venta', ?)`,
        [
          apartado.nombre_prospecto || "Cliente sin nombre",
          apartado.telefono_prospecto,
          apartado.id_vendedor || session.userId,
          apartado.origen_prospecto || "prospectos de piso",
          apartado.ine_url || null,
          apartado.comprobante_domicilio_url || null,
          apartado.estados_cuenta_url || null,
          apartado.licencia_contrato_url || null,
          apartado.seguro_url || null,
          apartado.comentarios_vendedor || ""
        ]
      );
      id_cliente = insertResult.insertId;
    }

    // 4. Crear la transacción financiera en la tabla ventas
    await conn.query(
      `INSERT INTO ventas (id_auto, id_cliente, id_vendedor, fecha_venta, costo_acondicionamiento, precio_venta) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_auto,
        id_cliente,
        apartado.id_vendedor || session.userId,
        new Date(fecha_venta_str),
        costo_acondicionamiento,
        precio_venta
      ]
    );

    // 5. Actualizar el estado lógico del auto a 'venta'
    await conn.query(
      "UPDATE autos SET estado_logico = 'venta' WHERE id = ?",
      [id_auto]
    );

    // 6. Actualizar el seguimiento comercial a estatus_credito = 'vendido' y probabilidad = 'Venta'
    await conn.query(
      "UPDATE apartados SET estatus_credito = 'vendido', probabilidad = 'Venta' WHERE id_venta = ?",
      [id_venta]
    );

    await conn.commit();
    
    revalidatePath("/apartados");
    revalidatePath("/clientes");
    revalidatePath("/ventas");
    
    return { success: true };
  } catch (err: any) {
    await conn.rollback();
    console.error("confirmSaleFromSeguimientoAction Error:", err);
    return { error: `Error crítico al concretar la venta: ${err.message || "Error desconocido"}` };
  } finally {
    conn.release();
  }
}

export { uploadApartadoDocumentAction, deleteApartadoDocumentAction };
