import { StorageProvider } from "@/infrastructure/services/StorageProvider";
import { SharpImageProcessor } from "@/infrastructure/services/SharpImageProcessor";

export async function uploadFileGeneric({
    file,
    subfolder,
    filenamePrefix,
    optimizeImage = true
}: {
    file: File,
    subfolder: string,
    filenamePrefix: string,
    optimizeImage?: boolean
}) {
    if (!file || file.size === 0) throw new Error("Archivo inválido");

    const storageService = StorageProvider.getStorageService(subfolder);
    const imageProcessor = new SharpImageProcessor();

    const arrayBuffer = await file.arrayBuffer();
    let finalBuffer: Uint8Array = new Uint8Array(arrayBuffer);
    let extension = file.name.split('.').pop()?.toLowerCase();
    
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '');
    let finalFilename = `${filenamePrefix}_${Date.now()}.${extension}`;

    if (isImage && optimizeImage) {
        finalBuffer = await imageProcessor.optimize(finalBuffer);
        finalFilename = `${filenamePrefix}_${Date.now()}.webp`;
    }

    const url = await storageService.save(finalBuffer, finalFilename);
    return url;
}

export async function deleteFileGeneric(url: string, subfolder: string) {
    if (!url) return;
    const storageService = StorageProvider.getStorageService(subfolder);
    await storageService.delete(url);
}
