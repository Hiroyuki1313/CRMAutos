import pool from '../connection';

async function migrate() {
  console.log('--- Database Migration: Adding fecha_proxima_cita to apartados ---');
  try {
    const [result] = await pool.query(`
      ALTER TABLE apartados 
      ADD COLUMN IF NOT EXISTS fecha_proxima_cita DATE AFTER fecha_primera_cita;
    `);
    console.log('Migration successful:', result);
  } catch (err) {
    // If IF NOT EXISTS is not supported, catch the error if column already exists
    if ((err as any).code === 'ER_DUP_COLUMN_NAME') {
        console.log('Column already exists, skipping.');
    } else {
        console.error('Migration failed:', err);
    }
  } finally {
    process.exit(0);
  }
}

migrate();
