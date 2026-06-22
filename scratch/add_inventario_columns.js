const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function runMigration() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('Checking current columns in "autos" table...');
        const [columns] = await connection.execute('SHOW COLUMNS FROM autos');
        const columnNames = columns.map(c => c.Field.toLowerCase());

        const columnsToAdd = [
            { name: 'folio_interno', definition: 'VARCHAR(50) NULL' },
            { name: 'vin', definition: 'VARCHAR(100) NULL' },
            { name: 'color', definition: 'VARCHAR(50) NULL' },
            { name: 'placas', definition: 'VARCHAR(50) NULL' },
            { name: 'precio_publicacion', definition: 'DECIMAL(12,2) NOT NULL DEFAULT 0.00' },
            { name: 'precio_min_autorizado', definition: 'DECIMAL(12,2) NOT NULL DEFAULT 0.00' },
            { name: 'precio_objetivo', definition: 'DECIMAL(12,2) NOT NULL DEFAULT 0.00' }
        ];

        for (const col of columnsToAdd) {
            if (!columnNames.includes(col.name.toLowerCase())) {
                console.log(`Adding column: ${col.name}...`);
                await connection.execute(`ALTER TABLE autos ADD COLUMN ${col.name} ${col.definition}`);
                console.log(`Column ${col.name} added successfully!`);
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        await connection.end();
        console.log('Migration finished successfully!');
    } catch (err) {
        console.error('Migration failed:', err.message);
    }
}

runMigration();
