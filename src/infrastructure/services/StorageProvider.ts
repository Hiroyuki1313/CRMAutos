import { IStorageService } from "@/core/domain/services/IStorageService";
import { IStorageContext } from "@/core/domain/services/IStorageContext";
import { LocalStorageService } from "./LocalStorageService";
import { SFTPStorageService } from "./SFTPStorageService";

export class StorageProvider {
    private static resolveSubfolder(target?: string | IStorageContext): string {
        if (!target) return '';
        if (typeof target === 'string') return target;
        const cat = target.category ? `/${target.category}` : '';
        return `${target.domain}/${target.entityId}${cat}`;
    }

    static getStorageService(target?: string | IStorageContext): IStorageService {
        const subfolder = this.resolveSubfolder(target);
        const useSFTP = Boolean(process.env.SFTP_HOST && process.env.SFTP_USER && process.env.SFTP_PASSWORD);
        
        if (useSFTP) {
            return new SFTPStorageService(subfolder);
        }
        return new LocalStorageService(subfolder);
    }
}
