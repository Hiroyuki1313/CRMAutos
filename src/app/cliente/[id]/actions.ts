'use server';

import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { getSession } from "@/core/usecases/authService";
import { revalidatePath } from "next/cache";

export async function updateClientBitacoraAction(clientId: number, data: {
    comentarios_vendedor: string;
    tipo_accion: string;
    probabilidad: 'frio' | 'tibio' | 'caliente';
}) {
    const session = await getSession();
    if (!session) return { error: 'Sesión no válida' };

    const repo = new MySQLClientRepository();
    const current = await repo.findById(clientId);
    if (!current) return { error: 'Cliente no encontrado' };

    // Lógica de Bitácora JSON
    let bitacora: any[] = [];
    try {
        if (current.comentarios_vendedor) {
            const parsed = JSON.parse(current.comentarios_vendedor);
            bitacora = Array.isArray(parsed) ? parsed : [{ text: current.comentarios_vendedor, user: 'Sistema', date: new Date() }];
        }
    } catch {
        bitacora = [{ text: current.comentarios_vendedor || "", user: 'Sistema', date: new Date() }];
    }

    if (data.comentarios_vendedor.trim() !== "") {
        bitacora.unshift({
            text: data.comentarios_vendedor.trim(),
            user: session.nombre || session.email,
            date: new Date(),
            tipo_accion: data.tipo_accion
        });
    }

    try {
        await repo.update(clientId, {
            comentarios_vendedor: JSON.stringify(bitacora),
            probabilidad: data.probabilidad
        });
        revalidatePath(`/cliente/${clientId}`);
        revalidatePath('/clientes');
        return { success: true };
    } catch (e) {
        return { error: 'Error al actualizar cliente' };
    }
}

export async function deleteLastClientCommentAction(clientId: number) {
    const session = await getSession();
    const isManagement = ['director', 'gerente', 'ti'].includes(session?.role as string);
    if (!isManagement) return { error: 'Permisos insuficientes' };

    const repo = new MySQLClientRepository();
    const current = await repo.findById(clientId);
    if (!current || !current.comentarios_vendedor) return { error: 'No hay comentarios' };

    try {
        const bitacora = JSON.parse(current.comentarios_vendedor);
        if (Array.isArray(bitacora) && bitacora.length > 0) {
            bitacora.shift();
            await repo.update(clientId, { comentarios_vendedor: JSON.stringify(bitacora) });
            revalidatePath(`/cliente/${clientId}`);
            return { success: true };
        }
        return { error: 'Formato inválido' };
    } catch (e) {
        return { error: 'Error al borrar' };
    }
}
