import { IAutoRepository } from '../../core/domain/repositories/IAutoRepository';
import { Auto, EstadoLogicoAuto } from '../../core/domain/entities/Auto';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLAutoRepository implements IAutoRepository {
  async findById(id: number): Promise<Auto | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM autos WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0] as Auto;
  }

  async getAll(filter?: { estado_logico?: EstadoLogicoAuto }): Promise<Auto[]> {
    let query = 'SELECT * FROM autos';
    const params: any[] = [];
    
    if (filter?.estado_logico) {
      query += ' WHERE estado_logico = ?';
      params.push(filter.estado_logico);
    }
    
    query += ' ORDER BY fecha_creacion DESC';
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Auto[];
  }

  async create(auto: Omit<Auto, 'id' | 'fecha_creacion'>): Promise<number> {
    const { marca, modelo, anio, tipo, fotos_url, estado_logico, fecha_registro_inventario } = auto;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO autos (marca, modelo, anio, tipo, fotos_url, estado_logico, fecha_registro_inventario) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [marca, modelo, anio, tipo, JSON.stringify(fotos_url), estado_logico, fecha_registro_inventario]
    );
    return result.insertId;
  }

  async updateStatus(id: number, nuevoEstado: EstadoLogicoAuto): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE autos SET estado_logico = ? WHERE id = ?',
      [nuevoEstado, id]
    );
    return result.affectedRows > 0;
  }

  async update(id: number, auto: Partial<Auto>): Promise<boolean> {
    // Basic implementation for dynamic updates
    const updates: string[] = [];
    const params: any[] = [];
    
    for (const [key, value] of Object.entries(auto)) {
      if (key !== 'id') {
        updates.push(`${key} = ?`);
        params.push(key === 'fotos_url' ? JSON.stringify(value) : value);
      }
    }
    
    if (updates.length === 0) return true;
    params.push(id);
    
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE autos SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows > 0;
  }
}
