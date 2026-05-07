import { IStorageService } from "@/core/domain/services/IStorageService";
import { LocalStorageService } from "./LocalStorageService";
import { SFTPStorageService } from "./SFTPStorageService";

export class StorageProvider {
    static getStorageService(subfolder: string = ''): IStorageService {
        const useSFTP = process.env.SFTP_HOST && process.env.SFTP_USER && process.env.SFTP_PASSWORD;
        
        if (useSFTP) {
            console.log('StorageProvider: Using SFTPStorageService');
            return new SFTPStorageService(subfolder);
        }
        
        console.log('StorageProvider: Using LocalStorageService');
        return new LocalStorageService(subfolder);
    }
}
