const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

function formatMexicanPhone(value) {
    if (!value) return value;
    // Remove all non-digits
    const clean = value.replace(/\D/g, '').slice(0, 10);
    
    // Apply segments: 3 3-2-2
    if (clean.length <= 3) return clean;
    
    const part1 = clean.slice(0, 3);
    const part2 = clean.slice(3, 6);
    const part3 = clean.slice(6, 8);
    const part4 = clean.slice(8, 10);
    
    let result = part1;
    if (clean.length > 3) result += " " + part2;
    if (clean.length > 6) result += "-" + part3;
    if (clean.length > 8) result += "-" + part4;
    
    return result;
}

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('Conectado a la base de datos.');

    try {
        // 1. Migrar teléfonos de prospectos en tabla 'apartados'
        const [prospectRows] = await connection.execute('SELECT id_venta, telefono_prospecto FROM apartados WHERE telefono_prospecto IS NOT NULL AND telefono_prospecto != ""');
        console.log(`Encontrados ${prospectRows.length} prospectos para procesar.`);

        for (const row of prospectRows) {
            const original = row.telefono_prospecto;
            const formatted = formatMexicanPhone(original);
            
            if (original !== formatted) {
                console.log(`Actualizando Prospecto ID ${row.id_venta}: ${original} -> ${formatted}`);
                await connection.execute('UPDATE apartados SET telefono_prospecto = ? WHERE id_venta = ?', [formatted, row.id_venta]);
            }
        }

        // 2. Migrar teléfonos de clientes en tabla 'clientes'
        const [clientRows] = await connection.execute('SELECT id, telefono FROM clientes WHERE telefono IS NOT NULL AND telefono != ""');
        console.log(`Encontrados ${clientRows.length} clientes para procesar.`);

        for (const row of clientRows) {
            const original = row.telefono;
            const formatted = formatMexicanPhone(original);
            
            if (original !== formatted) {
                console.log(`Actualizando Cliente ID ${row.id}: ${original} -> ${formatted}`);
                try {
                    await connection.execute('UPDATE clientes SET telefono = ? WHERE id = ?', [formatted, row.id]);
                } catch (err) {
                    console.error(`Error actualizando cliente ${row.id}:`, err.message);
                }
            }
        }

        console.log('Migración completa.');
        
    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        await connection.end();
    }
}

migrate();
