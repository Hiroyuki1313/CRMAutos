'use server';

import { MySQLAvaluoRepository } from "@/infrastructure/repositories/MySQLAvaluoRepository";
import { LocalStorageService } from "@/infrastructure/services/LocalStorageService";
import { SharpImageProcessor } from "@/infrastructure/services/SharpImageProcessor";
import { getSession } from "@/core/usecases/authService";
import { revalidatePath } from "next/cache";

export async function uploadAvaluoDocumentAction(avaluoId: number, field: string, formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'director') throw new Error("No autorizado");

    const file = formData.get('file') as File;
    if (!file || file.size === 0) throw new Error("No se seleccionó ningún archivo");

    const repo = new MySQLAvaluoRepository();
    const avaluo = await repo.findById(avaluoId);
    if (!avaluo) throw new Error("Avalúo no encontrado");

    const storageService = new LocalStorageService(`avaluos/${avaluoId}`);
    const imageProcessor = new SharpImageProcessor();

    const arrayBuffer = await file.arrayBuffer();
    let finalBuffer: Uint8Array = new Uint8Array(arrayBuffer);
    let extension = file.name.split('.').pop()?.toLowerCase();
    let filename = `${field}_${Date.now()}.${extension}`;

    // Si es imagen, optimizar a WebP
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '');
    if (isImage) {
        finalBuffer = await imageProcessor.optimize(finalBuffer);
        filename = `${field}_${Date.now()}.webp`;
    }

    const url = await storageService.save(finalBuffer, filename);

    // Actualizar base de datos
    await repo.update(avaluoId, { [field]: url });

    revalidatePath(`/avaluos/${avaluoId}`);
    revalidatePath('/avaluos');

    return { success: true, url };
}

export async function deleteAvaluoDocumentAction(avaluoId: number, field: string) {
    const session = await getSession();
    if (!session || session.role !== 'director') throw new Error("No autorizado");

    const repo = new MySQLAvaluoRepository();
    await repo.update(avaluoId, { [field]: null });

    revalidatePath(`/avaluos/${avaluoId}`);
    return { success: true };
}
