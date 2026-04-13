export interface IStorageService {
    /**
     * Guarda un archivo en el almacenamiento y devuelve la URL pública.
     */
    save(buffer: Buffer, filename: string): Promise<string>;
}
