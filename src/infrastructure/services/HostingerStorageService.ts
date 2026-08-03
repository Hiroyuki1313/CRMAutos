import { IStorageService } from '../../core/domain/services/IStorageService';
import { IStorageContext } from '../../core/domain/services/IStorageContext';
import fs from 'fs/promises';
import path from 'path';

export class HostingerStorageService implements IStorageService {
  private readonly storagePath: string;

  constructor() {
    this.storagePath = process.env.STORAGE_PATH1 || path.resolve(process.cwd(), '../autosuz_archivos_seguros');
    this.initStorage();
  }

  private async initStorage() {
    try {
      await fs.access(this.storagePath);
    } catch {
      await fs.mkdir(this.storagePath, { recursive: true });
    }
  }

  async save(buffer: Uint8Array, filename: string, context?: IStorageContext): Promise<string> {
    const targetDir = context ? path.join(this.storagePath, context.domain, String(context.entityId)) : this.storagePath;
    await fs.mkdir(targetDir, { recursive: true });
    const fullPath = path.join(targetDir, filename);
    await fs.writeFile(fullPath, buffer);
    return filename;
  }

  async delete(url: string): Promise<void> {
    try {
      const filePath = path.join(this.storagePath, url);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('HostingerStorageService delete error:', error);
    }
  }

  public async guardarDocumento(archivoBuffer: Buffer, nombreArchivo: string): Promise<string> {
    return this.save(archivoBuffer, nombreArchivo);
  }

  public obtenerUrlDocumento(nombreArchivo: string): string {
    return `/api/documentos?file=${nombreArchivo}`;
  }
}
