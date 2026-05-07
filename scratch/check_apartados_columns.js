const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables
const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function checkColumns() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [rows] = await connection.execute('SHOW COLUMNS FROM apartados');
        console.log('Columns in apartados table:');
        rows.forEach(row => {
            console.log(`- ${row.Field} (${row.Type})`);
        });

        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkColumns();
