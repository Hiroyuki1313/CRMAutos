import pool from './src/infrastructure/db/connection';

async function test() {
  try {
    console.log("Describing apartados table...");
    const [rows]: any = await pool.query("DESCRIBE apartados");
    console.log("Columns in apartados:");
    console.table(rows.map((r: any) => ({ field: r.Field, type: r.Type })));

    console.log("\nDescribing clientes table...");
    const [rowsC]: any = await pool.query("DESCRIBE clientes");
    console.log("Columns in clientes:");
    console.table(rowsC.map((r: any) => ({ field: r.Field, type: r.Type })));
  } catch (err) {
    console.error("FAILED to describe tables:", err);
  }
  process.exit();
}

test();
