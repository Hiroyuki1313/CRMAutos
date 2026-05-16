'use server';

import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { getSession } from "@/core/usecases/authService";
import { revalidatePath } from "next/cache";
import { uploadFileGeneric, deleteFileGeneric } from "@/infrastructure/utils/storageUtils";

export async function uploadClientDocumentAction(clientId: number, field: string, formData: FormData) {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    const file = formData.get('file') as File;
    if (!file || file.size === 0) throw new Error("No se seleccionó ningún archivo");

    const clientRepo = new MySQLClientRepository();
    const cliente = await clientRepo.findById(clientId);
    if (!cliente) throw new Error("Cliente no encontrado");

    try {
        const url = await uploadFileGeneric({
            file,
            subfolder: `clientes/${clientId}`,
            filenamePrefix: field
        });

        // Actualizar base de datos
        await clientRepo.update(clientId, { [field]: url });

        revalidatePath(`/cliente/${clientId}`);
        revalidatePath('/clientes');

        return { success: true, url };
    } catch (error) {
        console.error('Error uploading client document:', error);
        throw error;
    }
}

export async function deleteClientDocumentAction(clientId: number, field: string) {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    const clientRepo = new MySQLClientRepository();
    const cliente = await clientRepo.findById(clientId);
    
    if (cliente && (cliente as any)[field]) {
        try {
            await deleteFileGeneric((cliente as any)[field], `clientes/${clientId}`);
        } catch (error) {
            console.warn('Could not delete physical file for client:', error);
        }
    }

    // Siempre limpiamos la base de datos para evitar iconos rotos
    await clientRepo.update(clientId, { [field]: null });

    revalidatePath(`/cliente/${clientId}`);
    return { success: true };
}

