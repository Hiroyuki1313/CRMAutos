const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('Starting migration...');
    
    // Add columns to clientes
    const [columns] = await connection.query('SHOW COLUMNS FROM clientes');
    const existingColumns = columns.map(c => c.Field);

    if (!existingColumns.includes('probabilidad')) {
      await connection.query("ALTER TABLE clientes ADD COLUMN probabilidad ENUM('frio', 'tibio', 'caliente') DEFAULT 'frio'");
      console.log('Added probabilidad');
    }
    if (!existingColumns.includes('origen')) {
      await connection.query("ALTER TABLE clientes ADD COLUMN origen ENUM('ads', 'piso', 'redes') DEFAULT 'piso'");
      console.log('Added origen');
    }
    if (!existingColumns.includes('fecha_proximo_seguimiento')) {
      await connection.query("ALTER TABLE clientes ADD COLUMN fecha_proximo_seguimiento DATETIME");
      console.log('Added fecha_proximo_seguimiento');
    }
    if (!existingColumns.includes('comentarios_vendedor')) {
      await connection.query("ALTER TABLE clientes ADD COLUMN comentarios_vendedor TEXT");
      console.log('Added comentarios_vendedor');
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
