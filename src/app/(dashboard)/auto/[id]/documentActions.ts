'use server';

import { MySQLAutoRepository } from '@/infrastructure/repositories/MySQLAutoRepository';
import { SharpImageProcessor } from '@/infrastructure/services/SharpImageProcessor';
import { LocalStorageService } from '@/infrastructure/services/LocalStorageService';
import { getSession } from '@/core/usecases/authService';
import { revalidatePath } from 'next/cache';

/**
 * Normaliza nombres de archivos
 */
function normalizeString(str: string): string {
    return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export async function uploadAutoDocumentAction(id: number, field: string, formData: FormData) {
    const session = await getSession();
    if (!session || (session.role !== 'director' && session.role !== 'gerente')) {
        return { success: false, error: 'No autorizado' };
    }

    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { success: false, error: 'Archivo inválido' };

    const autoRepo = new MySQLAutoRepository();
    const auto = await autoRepo.findById(id);
    if (!auto) return { success: false, error: 'Auto no encontrado' };

    const storageService = new LocalStorageService();
    const imageProcessor = new SharpImageProcessor();

    try {
        let finalBuffer: Buffer;
        let filename: string;

        if (file.type.startsWith('image/')) {
            const buffer = Buffer.from(await file.arrayBuffer());
            finalBuffer = await imageProcessor.optimize(buffer);
            filename = `${field}_${normalizeString(auto.marca)}_${normalizeString(auto.modelo)}_${Date.now()}.webp`;
        } else {
            // PDF o similar
            finalBuffer = Buffer.from(await file.arrayBuffer());
            const ext = file.name.split('.').pop();
            filename = `${field}_${normalizeString(auto.marca)}_${normalizeString(auto.modelo)}_${Date.now()}.${ext}`;
        }

        const url = await storageService.save(finalBuffer, filename);
        
        // Actualizar en BD
        await autoRepo.update(id, { [field]: url });

        revalidatePath(`/auto/${id}`);
        return { success: true, url };
    } catch (error) {
        console.error('Error uploading auto document:', error);
        return { success: false, error: 'Error al subir documento' };
    }
}

export async function deleteAutoDocumentAction(id: number, field: string) {
    const session = await getSession();
    if (!session || (session.role !== 'director' && session.role !== 'gerente')) {
        return { success: false, error: 'No autorizado' };
    }

    const autoRepo = new MySQLAutoRepository();
    try {
        // En un sistema real, querríamos borrar el archivo físico también usando LocalStorageService.delete
        // Para este MVP, solo limpiamos el campo en la BD.
        await autoRepo.update(id, { [field]: null });
        revalidatePath(`/auto/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting auto document:', error);
        return { success: false, error: 'Error al eliminar documento' };
    }
}
