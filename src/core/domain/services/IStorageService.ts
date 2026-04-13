export interface IStorageService {
    /**
     * Guarda un archivo en el almacenamiento.
     * @param buffer El contenido del archivo en formato binario.
     * @param filename El nombre del archivo con su extensión.
     * @returns Una promesa que resuelve a la URL pública del archivo.
     */
    save(buffer: Uint8Array, filename: string): Promise<string>;
}
