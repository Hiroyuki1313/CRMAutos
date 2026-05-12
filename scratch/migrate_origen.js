const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('Migrating apartados table...');
        await connection.execute(`
            ALTER TABLE apartados MODIFY COLUMN origen_prospecto ENUM(
                'digital', 
                'prospecto del asesor', 
                'base de datos', 
                'prospecciones de cartera', 
                'prospectos de piso', 
                'puntos de venta', 
                'recomendados', 
                'redes sociales propias', 
                'ofrecimiento a cliente', 
                'volanteo y cabezeo (seguimineto)'
            ) DEFAULT 'prospectos de piso'
        `);

        console.log('Migrating clientes table...');
        await connection.execute(`
            ALTER TABLE clientes MODIFY COLUMN origen ENUM(
                'digital', 
                'prospecto del asesor', 
                'base de datos', 
                'prospecciones de cartera', 
                'prospectos de piso', 
                'puntos de venta', 
                'recomendados', 
                'redes sociales propias', 
                'ofrecimiento a cliente', 
                'volanteo y cabezeo (seguimineto)'
            ) DEFAULT 'prospectos de piso'
        `);

        console.log('Migration complete!');
        await connection.end();
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
