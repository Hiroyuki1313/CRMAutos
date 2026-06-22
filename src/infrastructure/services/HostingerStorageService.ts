import { IStorageService } from '../../core/domain/services/IStorageService';
import fs from 'fs/promises';
import path from 'path';

export class HostingerStorageService implements IStorageService {
  // SRP: Guarda los documentos en una RUTA ABSOLUTA de Hostinger (Fuera del código fuente)
  private readonly storagePath: string;

  constructor() {
    // Leemos la ruta desde el archivo .env.local
    // En producción (Hostinger), debes configurar STORAGE_PATH=/home/uXXXXX/domains/autosuz.com/archivos_seguros
    // Si no existe (ej. en local), usará una carpeta genérica fuera del proyecto en disco C: o /tmp/
    this.storagePath = process.env.STORAGE_PATH || path.resolve(process.cwd(), '../autosuz_archivos_seguros');
    
    this.initStorage();
  }

  private async initStorage() {
    try {
      await fs.access(this.storagePath);
    } catch {
      await fs.mkdir(this.storagePath, { recursive: true });
      console.log(`[Storage] Carpeta persistente creada/verificada en: ${this.storagePath}`);
    }
  }

  public async guardarDocumento(archivoBuffer: Buffer, nombreArchivo: string): Promise<string> {
    const fileName = `${Date.now()}_${nombreArchivo}`;
    const fullPath = path.join(this.storagePath, fileName);
    
    await fs.writeFile(fullPath, archivoBuffer);
    
    // Retornamos el nombre del archivo. 
    // Para servirlo, crearemos un Endpoint en Next.js (ej. /api/docs?file=123_ine.pdf)
    // que lea este archivo desde la ruta absoluta segura.
    return fileName; 
  }

  public obtenerUrlDocumento(nombreArchivo: string): string {
    // La URL pública que accederá a nuestro endpoint seguro de Next.js
    return `/api/documentos?file=${nombreArchivo}`;
  }
}
