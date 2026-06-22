import { MySQLApartadoRepository } from '../src/infrastructure/repositories/MySQLApartadoRepository';
import * as path from 'path';
import * as dotenv from 'dotenv';

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function runTest() {
    const repo = new MySQLApartadoRepository();
    try {
        console.log('Testing getCRMStats()...');
        const stats = await repo.getCRMStats();
        console.log('CRM Stats Result:');
        console.log(JSON.stringify(stats, null, 2));
    } catch (err: any) {
        console.error('Error during test:', err.message);
    }
    process.exit(0);
}

runTest();
