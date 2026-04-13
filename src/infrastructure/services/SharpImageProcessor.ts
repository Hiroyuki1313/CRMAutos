import { IImageProcessor } from '@/core/domain/services/IImageProcessor';

export class SharpImageProcessor implements IImageProcessor {
    async optimize(buffer: Uint8Array): Promise<Uint8Array> {
        const sharp = (await import('sharp')).default;
        // Redimensionar a un máximo de 1280px (manteniendo ratio) y convertir a WebP 80%
        // Convertimos a Buffer internamente porque sharp lo prefiere, pero devolvemos Uint8Array
        const result = await sharp(buffer)
            .resize(1280, 1280, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer();
            
        return new Uint8Array(result);
    }
}
