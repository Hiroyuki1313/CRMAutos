export interface IImageProcessor {
    /**
     * Optimiza una imagen: redimensiona a un máximo de 1280px y comprime (WebP).
     */
    optimize(buffer: Buffer): Promise<Buffer>;
}
