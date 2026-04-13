const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

console.log('--- INICIO DE SISTEMA AUTOSUZ ---');

// Función para cargar variables de entorno de forma robusta
function loadEnv() {
    const envFiles = ['.env.local', '.env', '.env.production'];
    let loaded = false;
    
    for (const file of envFiles) {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            const result = dotenv.config({ path: fullPath });
            if (!result.error) {
                console.log(`EXITO: Archivo de entorno cargado: ${file}`);
                loaded = true;
            }
        }
    }
    
    if (!loaded) {
        console.warn('ADVERTENCIA: No se encontró ningún archivo .env (.env, .env.local). Usando variables de entorno del sistema (o de Hostinger).');
    }
}

loadEnv();

console.log('DEBUG ENV:', {
    host: process.env.DB_HOST || 'no definido (usando localhost)',
    user: process.env.DB_USER ? 'DEFINIDO' : 'FALTANTE',
    db: process.env.DB_NAME ? 'DEFINIDO' : 'FALTANTE',
    node_env: process.env.NODE_ENV || 'development'
});

// Validación de la base de datos antes de arrancar Next.js
async function checkDatabaseConnection() {
    const mysql = require('mysql2/promise');
    console.log('Probando conexión a la base de datos...');
    
    const host = process.env.DB_HOST || 'localhost';
    const connectionConfig = {
        host: host,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'autosuz',
        connectTimeout: 10000 // 10 segundos
    };

    try {
        const connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Conexión a la base de datos EXITOSA');
        await connection.end();
        return true;
    } catch (err) {
        console.error('❌ ERROR CRÍTICO: No se pudo conectar a la base de datos:', err.message);
        console.error('Configuración intentada:', { 
            host: connectionConfig.host, 
            user: connectionConfig.user, 
            db: connectionConfig.database 
        });
        return false;
    }
}

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Función principal de arranque
async function startServer() {
  // 1. Validar base de datos
  await checkDatabaseConnection();

  // 2. Preparar Next.js
  await app.prepare();

  // 3. Crear Servidor HTTP
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port} [MODO: ${dev ? 'DEV' : 'PROD'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fallo al iniciar el servidor:', err);
  process.exit(1);
});
