const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  const host = '127.0.0.1';
  const pool = mysql.createPool({
    host: host,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autosuz',
    port: 3306,
  });

  try {
    console.log("Describing apartados table...");
    const [rows] = await pool.query("DESCRIBE apartados");
    console.table(rows.map((r) => ({ field: r.Field, type: r.Type })));

    console.log("\nDescribing clientes table...");
    const [rowsC] = await pool.query("DESCRIBE clientes");
    console.table(rowsC.map((r) => ({ field: r.Field, type: r.Type })));
  } catch (err) {
    console.error("FAILED to describe tables:", err.message);
  } finally {
    await pool.end();
  }
}

test();
