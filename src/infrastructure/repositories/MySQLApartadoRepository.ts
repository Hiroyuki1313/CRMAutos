import { IApartadoRepository, ApartadoFilterParams } from '../../core/domain/repositories/IApartadoRepository';
import { Apartado } from '../../core/domain/entities/Apartado';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLApartadoRepository implements IApartadoRepository {
  async findById(id: number): Promise<Apartado | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT a.*, u.nombre as nombre_vendedor FROM apartados a LEFT JOIN usuarios u ON a.id_vendedor = u.id WHERE a.id_venta = ?', [id]);
    return rows.length ? (rows[0] as Apartado) : null;
  }

  async getAll(filter?: ApartadoFilterParams): Promise<Apartado[]> {
    let query = `
      SELECT a.*, au.marca, au.modelo, au.anio, u.nombre as nombre_vendedor FROM apartados a
      LEFT JOIN clientes c ON a.id_cliente = c.id
      LEFT JOIN autos au ON a.id_carro = au.id
      LEFT JOIN usuarios u ON a.id_vendedor = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filter?.search) {
      query += ` AND (c.nombre LIKE ? OR au.marca LIKE ? OR au.modelo LIKE ?)`;
      const term = `%${filter.search}%`;
      params.push(term, term, term);
    }

    if (filter?.tab === 'hoy') {
      query += ` AND a.fecha_proximo_seguimiento = CURDATE()`;
    } else if (filter?.tab === 'semana') {
      query += ` AND YEARWEEK(a.fecha_proximo_seguimiento, 1) = YEARWEEK(CURDATE(), 1)`;
    } else if (filter?.tab === 'vencidos') {
      query += ` AND a.fecha_proximo_seguimiento < CURDATE()`;
    } else if (filter?.tab === 'criticos') {
      // Ventas sin seguimiento los últimos 2 días (+48h)
      query += ` AND a.fecha_actualizacion < DATE_SUB(NOW(), INTERVAL 2 DAY) AND a.estatus_proceso = 'proceso'`;
    }

    if (filter?.tab === 'criticos') {
      query += ' ORDER BY a.fecha_actualizacion ASC';
    } else {
      query += ' ORDER BY a.fecha_proximo_seguimiento ASC';
    }
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
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
