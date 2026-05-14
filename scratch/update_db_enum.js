const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function run() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await pool.query("ALTER TABLE apartados MODIFY COLUMN estatus_credito ENUM('pendiente respuesta','autorizado','rechazado','condicionado','vendido','cancelado','preautorizado') DEFAULT 'pendiente respuesta'");
        console.log('Database updated successfully');
    } catch (error) {
        console.error('Error updating database:', error);
    } finally {
        await pool.end();
    }
}

run();
