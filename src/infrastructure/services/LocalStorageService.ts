import fs from 'fs/promises';
import path from 'path';
import { IStorageService } from '@/core/domain/services/IStorageService';
import { IStorageContext } from '@/core/domain/services/IStorageContext';

export class LocalStorageService implements IStorageService {
    private primaryBaseDir: string;
    private fallbackBaseDir: string;
    private currentSubfolder: string;

    constructor(subfolder: string = '') {
        this.currentSubfolder = subfolder;
        this.primaryBaseDir = process.env.STORAGE_PATH1
            ? path.resolve(process.env.STORAGE_PATH1)
            : path.join(process.cwd(), 'public', 'uploads');
        this.fallbackBaseDir = path.join(process.cwd(), 'public', 'uploads');
    }

    private resolveRelativePath(context?: IStorageContext): string {
        if (!context) return this.currentSubfolder;
        const categoryPart = context.category ? `/${context.category}` : '';
        return `${context.domain}/${context.entityId}${categoryPart}`;
    }

    async save(buffer: Uint8Array, filename: string, context?: IStorageContext): Promise<string> {
        const subPath = this.resolveRelativePath(context);
        const primaryTargetDir = path.join(this.primaryBaseDir, subPath);
        
        try {
            await fs.mkdir(primaryTargetDir, { recursive: true });
            const filePath = path.join(primaryTargetDir, filename);
            await fs.writeFile(filePath, buffer);

            if (process.env.STORAGE_PATH1) {
                return `/api/uploads/${subPath}/${filename}`.replace(/\/+/g, '/');
            }
            return `/uploads/${subPath}/${filename}`.replace(/\/+/g, '/');
        } catch (primaryError) {
            console.warn(`[LocalStorageService] Primary storage failed (${primaryTargetDir}). Falling back to public/uploads:`, primaryError);
            
            const fallbackTargetDir = path.join(this.fallbackBaseDir, subPath);
            await fs.mkdir(fallbackTargetDir, { recursive: true });
            const fallbackFilePath = path.join(fallbackTargetDir, filename);
            await fs.writeFile(fallbackFilePath, buffer);

            return `/uploads/${subPath}/${filename}`.replace(/\/+/g, '/');
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

            const primaryFile = path.join(this.primaryBaseDir, relativePath);
            const fallbackFile = path.join(this.fallbackBaseDir, relativePath);

            await fs.unlink(primaryFile).catch(() => {});
            await fs.unlink(fallbackFile).catch(() => {});
        } catch (error) {
            console.error(`LocalStorageService delete error for ${url}:`, error);
        }
    }
}
