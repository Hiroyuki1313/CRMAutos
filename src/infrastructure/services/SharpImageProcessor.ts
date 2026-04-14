import { IImageProcessor } from '@/core/domain/services/IImageProcessor';

export class SharpImageProcessor implements IImageProcessor {
    async optimize(buffer: Uint8Array): Promise<Uint8Array> {
        // MOCK: Devolvemos el original inmediatamente para depurar
        console.log('SharpImageProcessor: Skipping optimization (MOCK)');
        return buffer;
    }
}
