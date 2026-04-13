export interface IImageProcessor {
    /**
     * Optimiza una imagen: redimensiona a un máximo de 1280px y comprime (WebP).
     * @param buffer La imagen original en formato binario.
     * @returns Una promesa que resuelve a la imagen optimizada.
     */
    optimize(buffer: Uint8Array): Promise<Uint8Array>;
}
