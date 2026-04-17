const mysql = require('mysql2/promise');

async function migrate() {
  console.log('--- Database Migration: Changing fecha_proxima_cita to DATETIME ---');
  const pool = mysql.createPool({
    host: "srv1987.hstgr.io",
    user: "u984618457_autosuzdb1",
    password: "|PKIJAov5",
    database: "u984618457_AutosuzDB",
    port: 3306,
  });

  try {
    const [result] = await pool.query(`
      ALTER TABLE apartados 
      MODIFY COLUMN fecha_proxima_cita DATETIME;
    `);
    console.log('Migration successful:', result);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
