import { IClientRepository, ClientFilterParams } from '../../core/domain/repositories/IClientRepository';
import { Cliente } from '../../core/domain/entities/Cliente';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLClientRepository implements IClientRepository {
  async findById(id: number): Promise<Cliente | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows.length ? (rows[0] as Cliente) : null;
  }

  async findByPhone(telefono: string): Promise<Cliente | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM clientes WHERE telefono = ?', [telefono]);
    return rows.length ? (rows[0] as Cliente) : null;
  }

  async getAll(filter?: ClientFilterParams): Promise<Cliente[]> {
    let query = `
      SELECT c.*, 
      (EXISTS (SELECT 1 FROM apartados a WHERE a.id_cliente = c.id AND a.estatus_proceso = 'proceso')) as tiene_apartado
      FROM clientes c 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filter?.search) {
      query += ' AND (nombre LIKE ? OR telefono LIKE ?)';
      params.push(`%${filter.search}%`, `%${filter.search}%`);
    }

    if (filter?.origen && filter.origen !== 'todos') {
      query += ' AND origen = ?';
      params.push(filter.origen);
    }

    if (filter?.tiene_apartado === 'con') {
      query += " AND EXISTS (SELECT 1 FROM apartados a WHERE a.id_cliente = c.id AND a.estatus_proceso = 'proceso')";
    } else if (filter?.tiene_apartado === 'sin') {
      query += " AND NOT EXISTS (SELECT 1 FROM apartados a WHERE a.id_cliente = c.id AND a.estatus_proceso = 'proceso')";
    }

    if (filter?.probabilidad && filter.probabilidad !== 'todos') {
      query += ' AND c.probabilidad = ?';
      params.push(filter.probabilidad);
    }

    query += ' ORDER BY fecha_registro DESC';
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Cliente[];
  }

  async create(client: Omit<Cliente, 'id' | 'fecha_registro'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO clientes SET ?',
      client
    );
    return result.insertId;
  }

  async update(id: number, client: Partial<Cliente>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];
    
    for (const [key, value] of Object.entries(client)) {
      if (key !== 'id') {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    if (updates.length === 0) return true;
    params.push(id);
    
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE clientes SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows > 0;
  }

  async getProbabilityStats(vendedorId?: number): Promise<{ frio: number, tibio: number, caliente: number }> {
    let query = "";
    const params: any[] = [];

    if (vendedorId) {
      // Si hay vendedorId, contamos clientes que tengan al menos una venta/apartado con ese vendedor
      query = `
        SELECT c.probabilidad, COUNT(DISTINCT c.id) as count 
        FROM clientes c 
        JOIN apartados a ON c.id = a.id_cliente 
        WHERE a.id_vendedor = ?
        GROUP BY c.probabilidad
      `;
      params.push(vendedorId);
    } else {
      query = `
        SELECT probabilidad, COUNT(*) as count 
        FROM clientes 
        GROUP BY probabilidad
      `;
    }
    
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    const stats = { frio: 0, tibio: 0, caliente: 0 };
    rows.forEach(row => {
      const p = row.probabilidad as string;
      if (p in stats) {
        (stats as any)[p] = row.count;
      }
    });
    
    return stats;
  }
}
