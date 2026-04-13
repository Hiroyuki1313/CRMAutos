import { IImageProcessor } from '@/core/domain/services/IImageProcessor';

export class SharpImageProcessor implements IImageProcessor {
    async optimize(buffer: Buffer): Promise<Buffer> {
        const sharp = (await import('sharp')).default;
        // Redimensionar a un máximo de 1280px (manteniendo ratio) y convertir a WebP 80%
        return await sharp(buffer)
            .resize(1280, 1280, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer();
    }
}
