import { IImageProcessor } from '@/core/domain/services/IImageProcessor';

export class SharpImageProcessor implements IImageProcessor {
    async optimize(buffer: Uint8Array): Promise<Uint8Array> {
        // Optimización para Hosting: Si el archivo es demasiado grande (>10MB),
        // evitamos procesarlo para no agotar la memoria del shared hosting.
        if (buffer.length > 10 * 1024 * 1024) {
             console.warn('SharpImageProcessor: Image too large, skipping optimization to save host resources.');
             return buffer;
        }

        try {
            console.log('SharpImageProcessor: Attempting optimization...');
            const sharp = (await import('sharp')).default;
            const result = await sharp(buffer)
                .resize(1024, 1024, { // Resolución reducida de 1280 a 1024 para ligereza
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 70 }) // Calidad reducida de 80 a 70
                .toBuffer();
                
            console.log('SharpImageProcessor: Optimization successful.');
            return new Uint8Array(result);
        } catch (error) {
            console.error('SharpImageProcessor Error (Optimization skipped):', error);
            // Fallback seguro: devolvemos el original si sharp falla
            return buffer;
        }
    }
}
