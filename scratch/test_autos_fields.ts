import * as path from 'path';
import * as dotenv from 'dotenv';

console.log('Current Cwd:', process.cwd());
const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    const p = path.join(process.cwd(), file);
    const result = dotenv.config({ path: p });
    console.log(`Loading env from ${p}:`, result.error ? 'FAILED' : 'SUCCESS');
});

console.log('DB_HOST loaded:', process.env.DB_HOST);
console.log('DB_USER loaded:', process.env.DB_USER);

async function runTest() {
    // Dynamic import to prevent ESM hoisting
    const { MySQLAutoRepository } = await import('../src/infrastructure/repositories/MySQLAutoRepository');
    const repo = new MySQLAutoRepository();
    
    try {
        console.log('Testing create auto with new fields...');
        const autoId = await repo.create({
            marca: 'TestMarca',
            modelo: 'TestModelo',
            anio: 2024,
            tipo: 'sedan',
            fotos_url: [],
            estado_logico: 'inventario',
            fecha_registro_inventario: new Date(),
            folio_interno: 'FOL-999',
            vin: 'VIN-999999999',
            color: 'Rojo',
            placas: 'PLA-999',
            precio_publicacion: 350000,
            precio_min_autorizado: 330000,
            precio_objetivo: 340000
        });
        console.log(`Auto created with ID: ${autoId}`);

        console.log('Fetching auto detail...');
        const auto = await repo.findById(autoId);
        console.log('Retrieved Auto Details:');
        console.log(`- Folio: ${auto?.folio_interno}`);
        console.log(`- VIN: ${auto?.vin}`);
        console.log(`- Color: ${auto?.color}`);
        console.log(`- Placas: ${auto?.placas}`);
        console.log(`- Precio Pub: ${auto?.precio_publicacion}`);
        console.log(`- Precio Min: ${auto?.precio_min_autorizado}`);
        console.log(`- Precio Obj: ${auto?.precio_objetivo}`);

        console.log('Testing update on new fields...');
        const success = await repo.update(autoId, {
            color: 'Azul Metálico',
            precio_objetivo: 345000
        });
        console.log(`Update success: ${success}`);

        const updatedAuto = await repo.findById(autoId);
        console.log('Updated Auto Details:');
        console.log(`- Color: ${updatedAuto?.color} (Expected: Azul Metálico)`);
        console.log(`- Precio Obj: ${updatedAuto?.precio_objetivo} (Expected: 345000)`);

        // Clean up test auto
        console.log('Cleaning up test auto...');
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        await connection.execute('DELETE FROM autos WHERE id = ?', [autoId]);
        await connection.end();
        console.log('Cleanup finished!');

    } catch (err: any) {
        console.error('Error during test:', err.message);
    }
    process.exit(0);
}

runTest();
