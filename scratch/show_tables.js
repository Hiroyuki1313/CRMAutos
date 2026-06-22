const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function showTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables in database:');
        rows.forEach(row => {
            console.log(Object.values(row)[0]);
        });

        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

showTables();
