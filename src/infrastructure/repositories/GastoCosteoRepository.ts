import { IGastoCosteoRepository } from '../../core/domain/repositories/IGastoCosteoRepository';
import { GastoCosteo } from '../../core/domain/entities/GastoCosteo';
import pool from '../db/connection';
import { RowDataPacket } from 'mysql2';

export class GastoCosteoRepository implements IGastoCosteoRepository {
  // SRP: Persiste exclusivamente las transacciones financieras del Centro de Utilidad
  
  public async obtenerPorVehiculo(vehiculoId: string): Promise<GastoCosteo[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM GastosCosteo WHERE vehiculo_id = ?', [vehiculoId]);
    return rows.map(row => new GastoCosteo(
      row.id, row.vehiculo_id, row.categoria, Number(row.monto), new Date(row.fecha_gasto), row.descripcion
    ));
  }

  public async guardar(gasto: GastoCosteo): Promise<void> {
    const query = `
      INSERT INTO GastosCosteo (id, vehiculo_id, categoria, monto, fecha_gasto, descripcion)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      gasto.id, gasto.vehiculoId, gasto.categoria, gasto.monto, gasto.fecha, gasto.concepto
    ]);
  }
}
