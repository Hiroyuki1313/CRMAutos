import { IApartadoRepository } from '../../core/domain/repositories/IApartadoRepository';
import { Apartado } from '../../core/domain/entities/Apartado';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLApartadoRepository implements IApartadoRepository {
  async findById(id: number): Promise<Apartado | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM apartados WHERE id_venta = ?', [id]);
    return rows.length ? (rows[0] as Apartado) : null;
  }

  async getAll(): Promise<Apartado[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM apartados ORDER BY cita_programada ASC');
    return rows as Apartado[];
  }

  async findBySeller(id_vendedor: number): Promise<Apartado[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM apartados WHERE id_vendedor = ? ORDER BY cita_programada ASC', [id_vendedor]);
    return rows as Apartado[];
  }

  async create(apartado: Apartado): Promise<number> {
    // Excluding id_venta as it's auto-increment
    const copy: any = { ...apartado };
    delete copy.id_venta;
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO apartados SET ?', copy);
    return result.insertId;
  }

  async update(id: number, apartado: Partial<Apartado>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];
    for (const [key, value] of Object.entries(apartado)) {
      if (key !== 'id_venta') {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }
    if (updates.length === 0) return true;
    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(`UPDATE apartados SET ${updates.join(', ')} WHERE id_venta = ?`, params);
    return result.affectedRows > 0;
  }
}
