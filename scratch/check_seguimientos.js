const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function checkSeguimientos() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('--- COLUMNS IN SEGUIMIENTOS ---');
        const [columns] = await connection.execute('SHOW COLUMNS FROM seguimientos');
        columns.forEach(row => {
            console.log(`- ${row.Field} (${row.Type})`);
        });

        console.log('\n--- ROWS IN SEGUIMIENTOS ---');
        const [rows] = await connection.execute('SELECT * FROM seguimientos LIMIT 5');
        console.log(rows);

        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkSeguimientos();
