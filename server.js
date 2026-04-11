const path = require('path');
const dotenv = require('dotenv');
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

console.log('--- INICIO DE SISTEMA AUTOSUZ ---');
if (result.error) {
    console.error('ERROR: No se encontró el archivo .env en:', envPath);
} else {
    console.log('EXITO: Archivo .env cargado correctamente desde:', envPath);
}

console.log('DEBUG ENV:', {
    host: process.env.DB_HOST || 'no definido (usando localhost)',
    user: process.env.DB_USER ? 'DEFINIDO' : 'FALTANTE',
    db: process.env.DB_NAME ? 'DEFINIDO' : 'FALTANTE'
});

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
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
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
