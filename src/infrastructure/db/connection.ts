import mysql from 'mysql2/promise';

// Configuración del pool de conexiones para la base de datos MySQL en Hostinger
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'autosuz',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Algunas instancias de Hostinger bloquean conexiones remotas sin SSL.
  // Activamos un request de SSL básico que ignora certs locales:
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Singleton Function para obtener la misma instancia del pool en todo el ciclo de vida de la API.
 */
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error connecting to Hostinger MySQL DB:', error);
    throw error;
  }
}

export default pool;
