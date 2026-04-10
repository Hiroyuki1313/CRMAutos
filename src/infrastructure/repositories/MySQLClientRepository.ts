import { IClientRepository } from '../../core/domain/repositories/IClientRepository';
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

  async getAll(): Promise<Cliente[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM clientes ORDER BY fecha_registro DESC');
    return rows as Cliente[];
  }

  async create(client: Omit<Cliente, 'id' | 'fecha_registro'>): Promise<number> {
    const { nombre, telefono, ine_url, comprobante_domicilio_url, estados_cuenta_url, licencia_contrato_url, seguro_url } = client;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO clientes (nombre, telefono, ine_url, comprobante_domicilio_url, estados_cuenta_url, licencia_contrato_url, seguro_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, telefono, ine_url, comprobante_domicilio_url, estados_cuenta_url, licencia_contrato_url, seguro_url]
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
}
