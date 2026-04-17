const mysql = require('mysql2/promise');

async function migrate() {
  console.log('--- Database Migration: Adding fecha_proxima_cita to apartados ---');
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
      ADD COLUMN IF NOT EXISTS fecha_proxima_cita DATE AFTER fecha_primera_cita;
    `);
    console.log('Migration successful:', result);
  } catch (err) {
    if (err.code === 'ER_DUP_COLUMN_NAME' || err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('Column already exists or migration not needed.');
    } else {
        console.error('Migration failed:', err);
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
