import { IAutoRepository, AutoFilterParams } from '../../core/domain/repositories/IAutoRepository';
import { Auto, EstadoLogicoAuto } from '../../core/domain/entities/Auto';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLAutoRepository implements IAutoRepository {
  async findById(id: number): Promise<Auto | null> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT *, 
      (SELECT COUNT(*) FROM apartados WHERE id_carro = autos.id AND estatus_proceso = 'proceso') as apartados_count
      FROM autos 
      WHERE id = ?
    `, [id]);
    if (rows.length === 0) return null;
    return rows[0] as Auto;
  }

  async getAll(filter?: AutoFilterParams): Promise<Auto[]> {
    let query = `
      SELECT *, 
      (SELECT COUNT(*) FROM apartados WHERE id_carro = autos.id AND estatus_proceso = 'proceso') as apartados_count
      FROM autos 
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (filter?.estado_logico) {
      query += ' AND estado_logico = ?';
      params.push(filter.estado_logico);
    }

    if (filter?.tab === 'frio') {
      query += " AND estado_logico = 'frio'";
    } else if (filter?.tab === 'apartado') {
      query += " AND id IN (SELECT id_carro FROM apartados WHERE estatus_proceso != 'cancelado' AND estatus_proceso != 'liquidado')"; 
    }

    if (filter?.search) {
      query += ' AND (marca LIKE ? OR modelo LIKE ? OR anio LIKE ?)';
      const term = `%${filter.search}%`;
      params.push(term, term, term);
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
