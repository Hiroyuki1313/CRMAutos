import { IAvaluoRepository } from '../../core/domain/repositories/IAvaluoRepository';
import { Avaluo } from '../../core/domain/entities/Avaluo';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLAvaluoRepository implements IAvaluoRepository {
  async findById(id: number): Promise<Avaluo | null> {
    const query = `
      SELECT a.*, 
             COALESCE(NULLIF(a.foto_principal_url, ''), NULLIF(a.foto_principal_url, '[]'), au.fotos_url) as fotos_url,
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
             COALESCE(NULLIF(a.foto_principal_url, ''), NULLIF(a.foto_principal_url, '[]'), au.fotos_url) as fotos_url,
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

  async create(avaluo: Omit<Avaluo, 'id'>): Promise<number> {
    const { 
        id_auto, ubicacion, origen_prospeccion, oferta, compra, venta, 
        sub_estado_avaluo, comentarios_historial, fotos_url, hoja_avaluo_url 
    } = avaluo as any;
    
    const dbData = {
      id_auto,
      ubicacion,
      origen_prospeccion,
      oferta,
      compra,
      venta,
      sub_estado_avaluo,
      hoja_avaluo_url,
      foto_principal_url: Array.isArray(fotos_url) ? JSON.stringify(fotos_url) : (fotos_url ? JSON.stringify([fotos_url]) : '[]'),
      comentarios_historial: JSON.stringify(comentarios_historial || [])
    };

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO avaluos SET ?', dbData
    );
    return result.insertId;
  }

  async update(id: number, avaluo: Partial<Avaluo>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];
    // Limpiamos campos que vienen de JOINs
    const { marca, modelo, anio, ...data } = avaluo as any;
    
    const allowedFields = [
      'id_auto', 'ubicacion', 'origen_prospeccion', 'oferta', 'compra', 
      'venta', 'sub_estado_avaluo', 'hoja_avaluo_url', 'foto_principal_url',
      'comentarios_historial'
    ];

    for (const [key, value] of Object.entries(data)) {
      if (key === 'id') continue;
      
      let actualKey = key;
      let actualValue = value;

      if (key === 'fotos_url') {
        actualKey = 'foto_principal_url';
      }

      if (allowedFields.includes(actualKey)) {
        updates.push(`${actualKey} = ?`);
        if (actualKey === 'foto_principal_url' || actualKey === 'comentarios_historial') {
          // Asegurar que siempre sea JSON válido
          if (actualKey === 'foto_principal_url') {
            params.push(Array.isArray(actualValue) ? JSON.stringify(actualValue) : (actualValue ? JSON.stringify([actualValue]) : '[]'));
          } else {
            params.push(Array.isArray(actualValue) ? JSON.stringify(actualValue) : JSON.stringify([actualValue]));
          }
        } else {
          params.push(actualValue);
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
