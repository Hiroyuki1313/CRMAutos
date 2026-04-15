import { MySQLApartadoRepository } from './src/infrastructure/repositories/MySQLApartadoRepository';

async function test() {
  const repo = new MySQLApartadoRepository();
  try {
    console.log("Testing repo.getAll()...");
    const results = await repo.getAll({ tab: 'todos' });
    console.log(`Success! Found ${results.length} results.`);
  } catch (err) {
    console.error("FAILED to run repo.getAll():", err);
  }
  process.exit();
}

test();
