import { IImageProcessor } from '@/core/domain/services/IImageProcessor';

export class SharpImageProcessor implements IImageProcessor {
    async optimize(buffer: Uint8Array): Promise<Uint8Array> {
        try {
            const sharp = (await import('sharp')).default;
            const result = await sharp(buffer)
                .resize(1280, 1280, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 80 })
                .toBuffer();
                
            return new Uint8Array(result);
        } catch (error) {
            console.error('SharpImageProcessor Error (Image optimization skipped):', error);
            // Si falla sharp por memoria o binarios en Hostinger, devolvemos el original
            return buffer;
        }
    }
}
