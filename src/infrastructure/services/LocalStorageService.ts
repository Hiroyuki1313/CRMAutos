import fs from 'fs/promises';
import path from 'path';
import { IStorageService } from '@/core/domain/services/IStorageService';
import { IStorageContext } from '@/core/domain/services/IStorageContext';

export class LocalStorageService implements IStorageService {
    private baseDir: string;
    private fallbackDir: string;
    private currentDir: string;

    constructor(subfolder: string = '') {
        this.fallbackDir = path.join(process.cwd(), 'public', 'uploads');
        this.baseDir = process.env.STORAGE_PATH1
            ? path.resolve(process.env.STORAGE_PATH1)
            : this.fallbackDir;
        this.currentDir = path.join(this.baseDir, subfolder);
    }

    private async ensureDir(targetPath: string): Promise<void> {
        await fs.mkdir(targetPath, { recursive: true });
    }

    private resolveTargetPath(base: string, context?: IStorageContext): string {
        if (context) {
            return path.join(base, context.domain, String(context.entityId));
        }
        return this.currentDir;
    }

    async save(buffer: Uint8Array, filename: string, context?: IStorageContext): Promise<string> {
        let primaryTarget = this.resolveTargetPath(this.baseDir, context);
        
        try {
            console.log(`[LocalStorageService] Guardando ${filename} en: ${primaryTarget}`);
            await this.ensureDir(primaryTarget);
            const filePath = path.join(primaryTarget, filename);
            await fs.writeFile(filePath, buffer);

            if (process.env.STORAGE_PATH1) {
                const relativePath = path.relative(this.baseDir, filePath);
                return `/api/uploads/${relativePath.replace(/\\/g, '/')}`;
            }

            const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
            return `/${relativePath.replace(/\\/g, '/')}`;
        } catch (error) {
            console.error(`[LocalStorageService] Error en ruta principal ${primaryTarget}, usando fallback:`, error);
            
            const fallbackTarget = this.resolveTargetPath(this.fallbackDir, context);
            await this.ensureDir(fallbackTarget);
            const filePath = path.join(fallbackTarget, filename);
            await fs.writeFile(filePath, buffer);

            const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
            return `/${relativePath.replace(/\\/g, '/')}`;
        }
    }

    async delete(url: string): Promise<void> {
        try {
            let relativePath = url;
            if (url.startsWith('/api/uploads/')) {
                relativePath = url.replace('/api/uploads/', '');
            } else if (url.startsWith('/uploads/')) {
                relativePath = url.replace('/uploads/', '');
            } else if (url.startsWith('/')) {
                relativePath = url.slice(1);
            }

            const primaryPath = path.join(this.baseDir, relativePath);
            const fallbackPath = path.join(this.fallbackDir, relativePath);

            try { await fs.unlink(primaryPath); } catch {}
            try { await fs.unlink(fallbackPath); } catch {}
        } catch (error) {
            console.error(`LocalStorage: Error al eliminar ${url}:`, error);
        }
    }
}
