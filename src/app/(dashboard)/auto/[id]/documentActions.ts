'use server';

import { MySQLAutoRepository } from '@/infrastructure/repositories/MySQLAutoRepository';
import { getSession } from '@/core/usecases/authService';
import { revalidatePath } from 'next/cache';
import { uploadFileGeneric, deleteFileGeneric } from '@/infrastructure/utils/storageUtils';

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
    if (!session) return { success: false, error: 'No autorizado' };

    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { success: false, error: 'Archivo inválido' };

    const autoRepo = new MySQLAutoRepository();
    const auto = await autoRepo.findById(id);
    if (!auto) return { success: false, error: 'Auto no encontrado' };

    try {
        const prefix = `${field}_${normalizeString(auto.marca)}_${normalizeString(auto.modelo)}`;
        const url = await uploadFileGeneric({
            file,
            subfolder: `autos/${id}`,
            filenamePrefix: prefix
        });

        // Caso especial: Galería de fotos
        if (field === 'fotos_url') {
            let currentFotos: string[] = [];
            if (auto.fotos_url) {
                try {
                    currentFotos = typeof auto.fotos_url === 'string' ? JSON.parse(auto.fotos_url) : auto.fotos_url;
                    if (!Array.isArray(currentFotos)) currentFotos = [];
                } catch (e) {
                    console.error("Error parsing fotos_url, resetting to empty array", e);
                    currentFotos = [];
                }
            }
            currentFotos.push(url);
            console.log(`Updating auto ${id} with new photo gallery:`, currentFotos);
            await autoRepo.update(id, { fotos_url: currentFotos });
        } else {
            // Documentos únicos
            console.log(`Updating auto ${id} field ${field} with URL:`, url);
            await autoRepo.update(id, { [field]: url });
        }

        revalidatePath(`/auto/${id}`);
        return { success: true, url };
    } catch (error) {
        console.error('Error uploading auto document:', error);
        return { success: false, error: 'Error al subir documento' };
    }
}

export async function deleteAutoDocumentAction(id: number, field: string, urlToDelete?: string) {
    const session = await getSession();
    if (!session) return { success: false, error: 'No autorizado' };

    const autoRepo = new MySQLAutoRepository();
    const auto = await autoRepo.findById(id);
    if (!auto) return { success: false, error: 'Auto no encontrado' };

    try {
        const subfolder = `autos/${id}`;
        
        if (field === 'fotos_url' && urlToDelete) {
            // Borrado físico
            await deleteFileGeneric(urlToDelete, subfolder);
            
            // Actualizar BD (remover del array)
            let currentFotos: string[] = [];
            if (auto.fotos_url) {
                try {
                    currentFotos = typeof auto.fotos_url === 'string' ? JSON.parse(auto.fotos_url) : auto.fotos_url;
                    if (!Array.isArray(currentFotos)) currentFotos = [];
                } catch (e) {
                    currentFotos = [];
                }
            }
            // Asegurar un match limpio de strings eliminando posibles escapes o espacios
            const normalizedToDelete = urlToDelete.trim().replace(/\\/g, '/');
            const filteredFotos = currentFotos.filter(u => {
                const normalizedU = u.trim().replace(/\\/g, '/');
                return normalizedU !== normalizedToDelete && !normalizedU.includes(normalizedToDelete) && !normalizedToDelete.includes(normalizedU);
            });
            console.log(`Updating auto ${id} gallery after deletion:`, filteredFotos);
            await autoRepo.update(id, { fotos_url: filteredFotos });
        } else {
            // Documentos únicos
            const currentUrl = (auto as any)[field];
            if (currentUrl) {
                await deleteFileGeneric(currentUrl, subfolder);
            }
            await autoRepo.update(id, { [field]: null });
        }

        revalidatePath(`/auto/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting auto document:', error);
        return { success: false, error: 'Error al eliminar documento' };
    }
}

