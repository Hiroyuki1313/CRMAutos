import mysql from 'mysql2/promise';

const host = process.env.DB_HOST || 'localhost';
const isLocal = host === 'localhost' || host === '127.0.0.1';

// Configuración del pool de conexiones para la base de datos MySQL en Hostinger
const pool = mysql.createPool({
  host: host,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'autosuz',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Solo aplicamos SSL si la conexión no es local (ej: desde tu PC al servidor)
  // Hostinger a veces rechaza SSL en conexiones internas (localhost)
  ssl: isLocal ? undefined : {
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
