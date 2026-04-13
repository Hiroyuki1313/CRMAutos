'use server';

import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { LocalStorageService } from "@/infrastructure/services/LocalStorageService";
import { SharpImageProcessor } from "@/infrastructure/services/SharpImageProcessor";
import { getSession } from "@/core/usecases/authService";
import { revalidatePath } from "next/cache";

export async function uploadClientDocumentAction(clientId: number, field: string, formData: FormData) {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    const file = formData.get('file') as File;
    if (!file || file.size === 0) throw new Error("No se seleccionó ningún archivo");

    const clientRepo = new MySQLClientRepository();
    const cliente = await clientRepo.findById(clientId);
    if (!cliente) throw new Error("Cliente no encontrado");

    const storageService = new LocalStorageService(`clientes/${clientId}`);
    const imageProcessor = new SharpImageProcessor();

    const buffer = Buffer.from(await file.arrayBuffer());
    let finalBuffer = buffer;
    let extension = file.name.split('.').pop()?.toLowerCase();
    let filename = `${field}_${Date.now()}.${extension}`;

    // Si es imagen, optimizar a WebP
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '');
    if (isImage) {
        finalBuffer = await imageProcessor.optimize(buffer);
        filename = `${field}_${Date.now()}.webp`;
    }

    const url = await storageService.save(finalBuffer, filename);

    // Actualizar base de datos
    await clientRepo.update(clientId, { [field]: url });

    revalidatePath(`/cliente/${clientId}`);
    revalidatePath('/clientes');

    return { success: true, url };
}

export async function deleteClientDocumentAction(clientId: number, field: string) {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    const clientRepo = new MySQLClientRepository();
    
    // Simplemente marcamos como null en la base de datos. 
    // Los archivos físicos se quedan en el hosting por auditoría (o se pueden borrar si se prefiere)
    await clientRepo.update(clientId, { [field]: null });

    revalidatePath(`/cliente/${clientId}`);
    return { success: true };
}
