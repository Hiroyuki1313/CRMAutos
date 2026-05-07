'use server';

import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { StorageProvider } from "@/infrastructure/services/StorageProvider";
import { SharpImageProcessor } from "@/infrastructure/services/SharpImageProcessor";
import { getSession } from "@/core/usecases/authService";
import { revalidatePath } from "next/cache";

export async function uploadApartadoDocumentAction(formData: FormData) {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    const idVenta = parseInt(formData.get('id_venta') as string, 10);
    const field = formData.get('field') as string;
    const file = formData.get('file') as File;

    if (!idVenta || !field) throw new Error("Parámetros incompletos");
    if (!file || file.size === 0) throw new Error("No se seleccionó ningún archivo");

    const repo = new MySQLApartadoRepository();
    const apartado = await repo.findById(idVenta);
    if (!apartado) throw new Error("Apartado no encontrado");

    const storageService = StorageProvider.getStorageService(`apartados/${idVenta}`);
    const imageProcessor = new SharpImageProcessor();

    const arrayBuffer = await file.arrayBuffer();
    let finalBuffer: Uint8Array = new Uint8Array(arrayBuffer);
    let extension = file.name.split('.').pop()?.toLowerCase();
    
    // Normalizar nombre de archivo
    let filename = `${field}_${idVenta}_${Date.now()}.${extension}`;

    // Si es imagen, optimizar a WebP
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '');
    if (isImage) {
        finalBuffer = await imageProcessor.optimize(finalBuffer);
        filename = `${field}_${idVenta}_${Date.now()}.webp`;
    }

    const url = await storageService.save(finalBuffer, filename);

    // Actualizar base de datos
    await repo.update(idVenta, { [field]: url });

    revalidatePath(`/apartado/${idVenta}`);
    revalidatePath('/apartados');

    return { success: true, url };
}

export async function deleteApartadoDocumentAction(idVenta: number, field: string) {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    const repo = new MySQLApartadoRepository();
    await repo.update(idVenta, { [field]: null });

    revalidatePath(`/apartado/${idVenta}`);
    return { success: true };
}
