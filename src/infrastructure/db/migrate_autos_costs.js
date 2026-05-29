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
    console.log('Migrating autos table with financial cost columns...');
    
    const queries = [
      'ALTER TABLE autos ADD COLUMN costo_adquisicion DECIMAL(12,2) DEFAULT 0.00 AFTER es_toma_avaluo',
      'ALTER TABLE autos ADD COLUMN precio_costo DECIMAL(12,2) DEFAULT 0.00 AFTER costo_adquisicion',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_llantas DECIMAL(12,2) DEFAULT 0.00 AFTER precio_costo',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_pintura DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_llantas',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_mecanica DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_pintura',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_refacciones DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_mecanica',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_accesorios DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_refacciones',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_limpieza DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_accesorios',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_tapiceria DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_limpieza',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_odometros DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_tapiceria',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_pulido DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_odometros',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_mecanica_servicios DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_pulido',
      'ALTER TABLE autos ADD COLUMN acondicionamiento_mecanica_reparaciones DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_mecanica_servicios',
      'ALTER TABLE autos ADD COLUMN publicidad DECIMAL(12,2) DEFAULT 0.00 AFTER acondicionamiento_mecanica_reparaciones',
      'ALTER TABLE autos ADD COLUMN gestion_administrativa DECIMAL(12,2) DEFAULT 0.00 AFTER publicidad',
      'ALTER TABLE autos ADD COLUMN comision DECIMAL(12,2) DEFAULT 0.00 AFTER gestion_administrativa'
    ];

    for (const query of queries) {
      try {
        await pool.query(query);
        console.log(`Executed: ${query.substring(0, 75)}...`);
      } catch (e) {
        if (e.code === 'ER_DUP_COLUMN_NAME') {
          console.log(`Column already exists in table: ${query.split(' ')[5]}`);
        } else {
          throw e;
        }
      }
    }

    console.log('✅ Financial cost migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
