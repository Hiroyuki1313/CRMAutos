const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function countRecords() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const tables = ['apartados', 'autos', 'avaluos', 'clientes', 'seguimientos', 'usuarios', 'ventas'];
        for (const table of tables) {
            const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`${table}: ${rows[0].count} records`);
        }

        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

countRecords();
