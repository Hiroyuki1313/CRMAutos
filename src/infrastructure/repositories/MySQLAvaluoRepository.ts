import { IAvaluoRepository } from '../../core/domain/repositories/IAvaluoRepository';
import { Avaluo } from '../../core/domain/entities/Avaluo';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLAvaluoRepository implements IAvaluoRepository {
  async findById(id: number): Promise<Avaluo | null> {
    const query = `
      SELECT a.*, 
             COALESCE(NULLIF(a.fotos_url, ''), NULLIF(a.fotos_url, '[]'), au.fotos_url) as fotos_url,
             au.marca, au.modelo, au.anio
      FROM avaluos a
      LEFT JOIN autos au ON a.id_auto = au.id
      WHERE a.id = ?
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    return rows.length ? (rows[0] as Avaluo) : null;
  }

  async getAll(filter?: { sub_estado_avaluo?: string }): Promise<Avaluo[]> {
    let query = `
      SELECT a.*, 
             COALESCE(NULLIF(a.fotos_url, ''), NULLIF(a.fotos_url, '[]'), au.fotos_url) as fotos_url,
             au.marca, au.modelo, au.anio
      FROM avaluos a
      LEFT JOIN autos au ON a.id_auto = au.id
    `;
    const params: any[] = [];
    if (filter?.sub_estado_avaluo) {
      query += ' WHERE a.sub_estado_avaluo = ?';
      params.push(filter.sub_estado_avaluo);
    }
    query += ' ORDER BY a.fecha_registro DESC';
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Avaluo[];
  }

  async create(avaluo: Omit<Avaluo, 'id' | 'fecha_registro'>): Promise<number> {
    // Extraemos campos de UI que no pertenecen a la tabla 'avaluos'
    const { marca, modelo, anio, ...data } = avaluo as any;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO avaluos SET ?', {
        ...data,
        fotos_url: JSON.stringify(data.fotos_url || []),
        comentarios_historial: JSON.stringify(data.comentarios_historial || [])
      }
    );
    return result.insertId;
  }

  async update(id: number, avaluo: Partial<Avaluo>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];
    // Limpiamos campos que vienen de JOINs
    const { marca, modelo, anio, ...data } = avaluo as any;
    
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id') {
        updates.push(`${key} = ?`);
        if (key === 'comentarios_historial' || key === 'fotos_url') {
          params.push(typeof value === 'string' ? value : JSON.stringify(value || []));
        } else {
          params.push(value);
        }
      }
    }
    if (updates.length === 0) return true;
    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE avaluos SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows > 0;
  }
}
