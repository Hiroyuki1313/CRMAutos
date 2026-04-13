const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function main() {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    function getEnv(key) {
        const regex = new RegExp(`^${key}=\"([^\"]+)\"`, 'm');
        const match = envContent.match(regex);
        return match ? match[1] : null;
    }

    const config = {
        host: getEnv('DB_HOST'),
        user: getEnv('DB_USER'),
        password: getEnv('DB_PASSWORD'),
        database: getEnv('DB_NAME'),
        ssl: { rejectUnauthorized: false }
    };

    console.log('--- Configuración Detectada ---');
    console.log('Host:', config.host);
    console.log('Database:', config.database);
    console.log('-------------------------------');

    const connection = await mysql.createConnection(config);
    try {
        console.log('Ejecutando migración...');
        await connection.query('ALTER TABLE clientes ADD COLUMN id_vendedor INT NULL AFTER id');
        console.log('✅ Columna id_vendedor añadida exitosamente');
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('⚠️ La columna id_vendedor ya existe');
        } else {
            console.error('❌ Error:', err.message);
        }
    } finally {
        await connection.end();
    }
}

main().catch(console.error);
