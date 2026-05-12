const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function check() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [apartados] = await connection.execute('SHOW COLUMNS FROM apartados');
        console.log('--- apartados ---');
        apartados.forEach(row => console.log(`- ${row.Field} (${row.Type})`));

        const [clientes] = await connection.execute('SHOW COLUMNS FROM clientes');
        console.log('\n--- clientes ---');
        clientes.forEach(row => console.log(`- ${row.Field} (${row.Type})`));

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}

check();
