const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function checkClientes() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('--- COLUMNS IN CLIENTES ---');
        const [columns] = await connection.execute('SHOW COLUMNS FROM clientes');
        columns.forEach(row => {
            console.log(`- ${row.Field} (${row.Type})`);
        });

        console.log('\n--- ROWS IN CLIENTES (LIMIT 2) ---');
        const [rows] = await connection.execute('SELECT * FROM clientes LIMIT 2');
        console.log(rows);

        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkClientes();
