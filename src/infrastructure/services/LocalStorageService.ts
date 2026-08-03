import fs from 'fs/promises';
import path from 'path';
import { IStorageService } from '@/core/domain/services/IStorageService';
import { IStorageContext } from '@/core/domain/services/IStorageContext';

export class LocalStorageService implements IStorageService {
    private baseDir: string;
    private currentDir: string;

    constructor(subfolder: string = '') {
        this.baseDir = process.env.STORAGE_PATH1
            ? path.resolve(process.env.STORAGE_PATH1)
            : path.join(process.cwd(), 'public', 'uploads');
        this.currentDir = path.join(this.baseDir, subfolder);
    }

    private async ensureDir(targetPath: string): Promise<void> {
        await fs.mkdir(targetPath, { recursive: true });
    }

    private resolveTargetPath(context?: IStorageContext): string {
        if (!context) return this.currentDir;
        return path.join(this.baseDir, context.domain, String(context.entityId));
    }

    async save(buffer: Uint8Array, filename: string, context?: IStorageContext): Promise<string> {
        const targetDir = this.resolveTargetPath(context);
        console.log(`[LocalStorageService] Saving ${filename}. STORAGE_PATH1=${process.env.STORAGE_PATH1 || 'undefined'}. Destination: ${targetDir}`);
        await this.ensureDir(targetDir);

        const filePath = path.join(targetDir, filename);
        await fs.writeFile(filePath, buffer);

        if (process.env.STORAGE_PATH1) {
            const relativePath = path.relative(this.baseDir, filePath);
            return `/api/uploads/${relativePath.replace(/\\/g, '/')}`;
        }

        const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
        return `/${relativePath.replace(/\\/g, '/')}`;
    }

    async delete(url: string): Promise<void> {
        try {
            let filePath: string;
            if (url.startsWith('/api/uploads/')) {
                const relativePath = url.replace('/api/uploads/', '');
                filePath = path.join(this.baseDir, relativePath);
            } else {
                const relativePath = url.startsWith('/') ? url.slice(1) : url;
                filePath = path.join(process.cwd(), 'public', relativePath);
            }
            await fs.unlink(filePath);
        } catch (error) {
            console.error(`LocalStorage: Error deleting ${url}:`, error);
        }
    }
}
