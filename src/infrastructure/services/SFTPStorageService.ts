import Client from 'ssh2-sftp-client';
import { IStorageService } from '@/core/domain/services/IStorageService';

export class SFTPStorageService implements IStorageService {
    private client: Client;
    private config: any;
    private remotePath: string;
    private baseUrl: string;
    private subfolder: string;

    constructor(subfolder: string = '') {
        this.client = new Client();
        this.subfolder = subfolder;
        this.config = {
            host: process.env.SFTP_HOST,
            port: parseInt(process.env.SFTP_PORT || '65002', 10),
            username: process.env.SFTP_USER,
            password: process.env.SFTP_PASSWORD,
            readyTimeout: 30000,
            tryKeyboard: true, // Mejor compatibilidad con algunos servidores
        };
        const basePath = process.env.SFTP_REMOTE_PATH || 'public_html/uploads';
        this.remotePath = subfolder ? `${basePath}/${subfolder}` : basePath;
        this.baseUrl = process.env.SFTP_BASE_URL || '';
    }

    private async ensureDirectory(path: string) {
        const exists = await this.client.exists(path);
        if (!exists) {
            await this.client.mkdir(path, true);
        }
    }

    async save(buffer: Uint8Array, filename: string): Promise<string> {
        try {
            console.log('SFTP: Connecting to host...');
            await this.client.connect(this.config);
            
            // Diagnóstico profundo
            const currentPath = await this.client.realPath('.');
            const rootList = await this.client.list('.');
            console.log(`SFTP: Raíz: ${currentPath}`);
            console.log(`SFTP: Carpetas Raíz: ${rootList.map(f => f.name).join(', ')}`);
            
            try {
                const domainsList = await this.client.list('./domains');
                console.log(`SFTP: En /domains: ${domainsList.map(f => f.name).join(', ')}`);
            } catch(e) {}

            try {
                const pubList = await this.client.list('./public_html');
                console.log(`SFTP: En /public_html: ${pubList.map(f => f.name).join(', ')}`);
            } catch(e) {}

            // Asegurar que la carpeta base existe
            console.log(`SFTP: Verificando/Creando carpeta remota: ${this.remotePath}`);
            await this.ensureDirectory(this.remotePath);
            
            const fullRemotePath = `${this.remotePath}/${filename}`;
            console.log(`SFTP: Subiendo buffer (${buffer.length} bytes) a: ${fullRemotePath}`);
            
            // ssh2-sftp-client acepta Buffer
            await this.client.put(Buffer.from(buffer), fullRemotePath);
            
            console.log('SFTP: Upload successful');
            await this.client.end();
            
            // Devolvemos la URL pública incluyendo la subcarpeta
            const publicUrl = this.subfolder ? `${this.baseUrl}/${this.subfolder}/${filename}` : `${this.baseUrl}/${filename}`;
            return publicUrl;
        } catch (error: any) {
            console.error('SFTP Error:', error.message);
            if (this.client) await this.client.end();
        }
    }

    async delete(url: string): Promise<void> {
        try {
            // Derivar ruta remota desde la URL pública
            let relativePart = url;
            if (this.baseUrl && url.startsWith(this.baseUrl)) {
                relativePart = url.replace(this.baseUrl, '');
            } else if (url.startsWith('/uploads')) {
                // Manejar URLs locales antiguas / relativas
                relativePart = url.replace('/uploads', '');
            }
            
            // Limpiar slashes extra
            if (relativePart.startsWith('/')) relativePart = relativePart.slice(1);
            
            const basePath = process.env.SFTP_REMOTE_PATH || 'public_html/uploads';
            const fullRemotePath = `${basePath}/${relativePart}`;
            
            console.log(`SFTP: Deleting file at: ${fullRemotePath}`);
            await this.client.connect(this.config);
            const exists = await this.client.exists(fullRemotePath);
            if (exists) {
                await this.client.delete(fullRemotePath);
                console.log('SFTP: Delete successful');
            } else {
                console.warn(`SFTP: File not found for deletion: ${fullRemotePath}`);
            }
            await this.client.end();
        } catch (error: any) {
            console.error('SFTP Delete Error:', error.message);
            if (this.client) await this.client.end();
        }
    }
}
