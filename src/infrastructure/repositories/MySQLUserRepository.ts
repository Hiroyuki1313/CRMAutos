import { IUserRepository } from '../../core/domain/repositories/IUserRepository';
import { Usuario } from '../../core/domain/entities/Usuario';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLUserRepository implements IUserRepository {
  async findById(id: number): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows.length ? (rows[0] as Usuario) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM usuarios WHERE LOWER(email) = LOWER(?)', [email]);
    return rows.length ? (rows[0] as Usuario) : null;
  }

  async create(user: Omit<Usuario, 'id' | 'fecha_creacion'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO usuarios SET ?', user);
    return result.insertId;
  }

  async update(id: number, user: Partial<Usuario>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];
    for (const [key, value] of Object.entries(user)) {
      if (key !== 'id') {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }
    if (updates.length === 0) return true;
    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`, params);
    return result.affectedRows > 0;
  }

  async findAllByRole(role: string): Promise<Usuario[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, nombre, email, rol as role FROM usuarios WHERE rol = ? ORDER BY nombre ASC', [role]);
    return rows as Usuario[];
  }

  async findAllEligibleForSales(): Promise<Usuario[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, nombre, email, rol as role FROM usuarios WHERE rol NOT IN ('redes', 'ti') ORDER BY nombre ASC"
    );
    return rows as Usuario[];
  }
}
