import Client from 'ssh2-sftp-client';
import { IStorageService } from '@/core/domain/services/IStorageService';

export class SFTPStorageService implements IStorageService {
    private client: Client;
    private config: any;
    private remotePath: string;
    private baseUrl: string;
    private subfolder: string;

    constructor(subfolder: string = '') {
        this.subfolder = subfolder;
        this.config = {
            host: process.env.SFTP_HOST,
            port: parseInt(process.env.SFTP_PORT || '65002', 10),
            username: process.env.SFTP_USER,
            password: process.env.SFTP_PASSWORD,
            readyTimeout: 30000,
            tryKeyboard: true,
        };
        const basePath = process.env.SFTP_REMOTE_PATH || 'nodejs/public/uploads';
        this.remotePath = subfolder ? `${basePath}/${subfolder}` : basePath;
        this.baseUrl = process.env.SFTP_BASE_URL || '';
    }

    private async ensureDirectory(client: Client, path: string) {
        const exists = await client.exists(path);
        if (!exists) {
            await client.mkdir(path, true);
        }
    }

    async save(buffer: Uint8Array, filename: string): Promise<string> {
        const client = new Client();
        try {
            console.log(`SFTP: Connecting to ${this.config.host}:${this.config.port}...`);
            await client.connect(this.config);
            
            // DIAGNÓSTICO: Ver en qué carpeta estamos al conectar
            const workingDir = await client.realPath('.');
            console.log(`SFTP: Directorio de conexión: ${workingDir}`);
            const list = await client.list('.');
            console.log(`SFTP: Archivos en raíz: ${list.map(f => f.name).join(', ')}`);

            // Asegurar que la carpeta base existe
            await this.ensureDirectory(client, this.remotePath);
            
            const fullRemotePath = `${this.remotePath}/${filename}`;
            console.log(`SFTP: Uploading to: ${fullRemotePath}`);
            
            await client.put(Buffer.from(buffer), fullRemotePath);
            
            await client.end();
            
            return this.subfolder ? `${this.baseUrl}/${this.subfolder}/${filename}` : `${this.baseUrl}/${filename}`;
        } catch (error: any) {
            console.error('SFTP Save Error:', error.message);
            await client.end();
            throw error; // Rethrow to let the action handle it
        }
    }

    async delete(url: string): Promise<void> {
        const client = new Client();
        try {
            let relativePart = url;
            if (this.baseUrl && url.startsWith(this.baseUrl)) {
                relativePart = url.replace(this.baseUrl, '');
            } else if (url.startsWith('/uploads')) {
                relativePart = url.replace('/uploads', '');
            }
            
            if (relativePart.startsWith('/')) relativePart = relativePart.slice(1);
            
            const basePath = process.env.SFTP_REMOTE_PATH || 'nodejs/public/uploads';
            const fullRemotePath = `${basePath}/${relativePart}`;
            
            console.log(`SFTP: Connecting for deletion...`);
            await client.connect(this.config);
            
            const exists = await client.exists(fullRemotePath);
            if (exists) {
                await client.delete(fullRemotePath);
                console.log('SFTP: Delete successful');
            }
            await client.end();
        } catch (error: any) {
            console.error('SFTP Delete Error:', error.message);
            await client.end();
        }
    }
}
