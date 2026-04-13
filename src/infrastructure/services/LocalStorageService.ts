import fs from 'fs/promises';
import path from 'path';
import { IStorageService } from '@/core/domain/services/IStorageService';

export class LocalStorageService implements IStorageService {
    private baseDir = path.join(process.cwd(), 'public', 'uploads');
    private currentDir: string;

    constructor(subfolder: string = 'avaluos') {
        this.currentDir = path.join(this.baseDir, subfolder);
    }

    private async ensureDirectory() {
        try {
            await fs.mkdir(this.currentDir, { recursive: true });
        } catch (error) {
            // Ya existe o error de permisos
        }
    }

    async save(buffer: Uint8Array, filename: string): Promise<string> {
        await this.ensureDirectory();
        const filePath = path.join(this.currentDir, filename);
        // fs.writeFile acepta Uint8Array
        await fs.writeFile(filePath, buffer);
        
        // Devolvemos la URL relativa basándonos en la estructura de carpetas
        const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
        return `/${relativePath.replace(/\\/g, '/')}`;
    }
}
