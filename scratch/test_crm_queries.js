const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function testQueries() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // 1. Prospectos nuevos (últimos 7 días) por vendedor
        console.log('\n--- PROSPECTOS NUEVOS (7 días) ---');
        const [nuevos] = await connection.execute(`
            SELECT u.nombre as vendedor, COUNT(*) as count
            FROM apartados a
            LEFT JOIN usuarios u ON a.id_vendedor = u.id
            WHERE a.fecha_registro_prospecto >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
              AND a.probabilidad NOT IN ('Venta', 'Rechazo')
            GROUP BY a.id_vendedor, u.nombre
        `);
        console.log(nuevos);

        // 2. Citas de hoy por vendedor
        console.log('\n--- CITAS DE HOY ---');
        const [citas] = await connection.execute(`
            SELECT u.nombre as vendedor, COUNT(*) as count
            FROM apartados a
            LEFT JOIN usuarios u ON a.id_vendedor = u.id
            WHERE DATE(a.fecha_proxima_cita) = CURDATE()
              AND a.probabilidad NOT IN ('Venta', 'Rechazo')
            GROUP BY a.id_vendedor, u.nombre
        `);
        console.log(citas);

        // 3. Seguimientos vencidos por vendedor
        console.log('\n--- SEGUIMIENTOS VENCIDOS ---');
        const [vencidos] = await connection.execute(`
            SELECT u.nombre as vendedor, COUNT(*) as count
            FROM apartados a
            LEFT JOIN usuarios u ON a.id_vendedor = u.id
            WHERE a.fecha_proximo_seguimiento < CURDATE()
              AND a.probabilidad NOT IN ('Venta', 'Rechazo')
            GROUP BY a.id_vendedor, u.nombre
        `);
        console.log(vencidos);

        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testQueries();
