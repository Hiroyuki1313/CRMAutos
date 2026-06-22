const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envFiles = ['.env.local', '.env'];
envFiles.forEach(file => {
    dotenv.config({ path: path.join(process.cwd(), file) });
});

async function check() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('--- PROBABILIDAD DISTRIBUTION IN APARTADOS ---');
        const [probRows] = await connection.execute(
            'SELECT probabilidad, COUNT(*) as count FROM apartados GROUP BY probabilidad'
        );
        console.log(probRows);

        console.log('\n--- LEADS WITH PROBABILIDAD = Venta ---');
        const [ventaLeads] = await connection.execute(
            'SELECT id_venta, id_vendedor, id_carro, nombre_prospecto, origen_prospecto, probabilidad FROM apartados WHERE probabilidad = "Venta"'
        );
        console.log(ventaLeads);

        console.log('\n--- CURRENT SALES ---');
        const [sales] = await connection.execute(
            'SELECT id, id_auto, id_cliente, id_vendedor, precio_venta, fecha_venta FROM ventas'
        );
        console.log(sales);

        console.log('\n--- MATCHING SALES TO LEADS BY VEHICLE & SELLER OR PHONE ---');
        // Let's see if we can match them
        for (const sale of sales) {
            const [matches] = await connection.execute(
                `SELECT a.id_venta, a.nombre_prospecto, a.origen_prospecto, a.probabilidad 
                 FROM apartados a 
                 WHERE a.id_carro = ? AND a.id_vendedor = ?`,
                [sale.id_auto, sale.id_vendedor]
            );
            console.log(`Sale ID ${sale.id} (Auto ${sale.id_auto}, Vendedor ${sale.id_vendedor}):`, matches);
        }

        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

check();
