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
    console.log('Starting Sales Module database migration...');

    // 1. Modificar columna estado_logico de autos para incluir 'venta'
    console.log('Modifying estado_logico column in autos...');
    await pool.query(`
      ALTER TABLE autos 
      MODIFY COLUMN estado_logico ENUM('inventario', 'frio', 'avaluo', 'venta') DEFAULT 'frio'
    `);
    console.log('✅ Column estado_logico in autos modified successfully');

    // 2. Crear tabla ventas
    console.log('Creating ventas table if it does not exist...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        id_auto INT(11) UNIQUE, -- Un auto solo se vende una vez
        id_cliente INT(11),
        id_vendedor INT(11),
        fecha_venta DATE NOT NULL,
        costo_acondicionamiento DECIMAL(12,2) DEFAULT 0.00,
        precio_venta DECIMAL(12,2) DEFAULT 0.00,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_auto) REFERENCES autos(id) ON DELETE SET NULL,
        FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE SET NULL,
        FOREIGN KEY (id_vendedor) REFERENCES usuarios(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table ventas created successfully');

    console.log('🎉 Sales Database migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
