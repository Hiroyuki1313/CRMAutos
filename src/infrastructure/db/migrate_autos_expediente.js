require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autosuz',
  });

  try {
    console.log('Migrating autos table...');
    
    const queries = [
      'ALTER TABLE autos ADD COLUMN version VARCHAR(255) AFTER tipo',
      'ALTER TABLE autos ADD COLUMN kilometraje INT DEFAULT 0 AFTER version',
      'ALTER TABLE autos ADD COLUMN numero_duenos INT DEFAULT 1 AFTER kilometraje',
      'ALTER TABLE autos ADD COLUMN es_toma_avaluo TINYINT(1) DEFAULT 0 AFTER numero_duenos',
      'ALTER TABLE autos ADD COLUMN url_factura TEXT AFTER es_toma_avaluo',
      'ALTER TABLE autos ADD COLUMN url_tarjeta_circulacion TEXT AFTER url_factura',
      'ALTER TABLE autos ADD COLUMN url_poliza_seguro TEXT AFTER url_tarjeta_circulacion',
      'ALTER TABLE autos ADD COLUMN url_ine_propietario TEXT AFTER url_poliza_seguro',
      'ALTER TABLE autos ADD COLUMN url_contrato_compraventa TEXT AFTER url_ine_propietario'
    ];

    for (const query of queries) {
      try {
        await pool.query(query);
        console.log(`Executed: ${query.substring(0, 50)}...`);
      } catch (e) {
        if (e.code === 'ER_DUP_COLUMN_NAME') {
          console.log(`Column already exists: ${query.split(' ')[5]}`);
        } else {
          throw e;
        }
      }
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
