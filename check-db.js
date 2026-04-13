const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables
const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(__dirname, file) });
});

async function test() {
    console.log('--- DIAGNÓSTICO DE CONEXIÓN AUTOSUZ ---');
    console.log('Configuración detectada:');
    console.log('- Host:', process.env.DB_HOST);
    console.log('- Usuario:', process.env.DB_USER);
    console.log('- DB:', process.env.DB_NAME);
    console.log('---------------------------------------');

    try {
        console.log('Intentando conectar...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectTimeout: 10000
        });

        console.log('✅ ÉXITO: Conexión establecida correctamente.');
        
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM usuarios');
        console.log(`✅ CONSULTA: La tabla "usuarios" tiene ${rows[0].count} registros.`);
        
        await connection.end();
        console.log('Proceso terminado con éxito.');
    } catch (err) {
        console.error('❌ ERROR: No se pudo conectar.');
        console.error('Mensaje:', err.message);
        console.error('Código:', err.code);
        console.error('\nSugerencias:');
        console.error('1. Verifica que la IP de este servidor esté permitida en Hostinger (Remote MySQL).');
        console.error('2. Asegúrate de que DB_HOST sea "srv1987.hstgr.io" o "localhost" según corresponda.');
        console.error('3. Confirma que el usuario y contraseña sean correctos.');
    }
}

test();
