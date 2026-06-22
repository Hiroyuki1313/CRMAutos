import { IVehiculoRepository } from '../../core/domain/repositories/IVehiculoRepository';
import { Vehiculo, EstadoVehiculo } from '../../core/domain/entities/Vehiculo';
import pool from '../db/connection';
import { RowDataPacket } from 'mysql2';

export class VehiculoRepository implements IVehiculoRepository {
  // SRP: Solo inserta, actualiza y lee la entidad Vehiculo en MySQL Hostinger
  
  public async obtenerTodos(): Promise<Vehiculo[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Vehiculos');
    return rows.map(this.mapRowToEntity);
  }

  public async obtenerPorId(id: string): Promise<Vehiculo | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Vehiculos WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapRowToEntity(rows[0]);
  }

  public async guardar(vehiculo: Vehiculo): Promise<void> {
    const query = `
      INSERT INTO Vehiculos (id, vin, folio_interno, marca, modelo, anio, version, kilometraje, estado, precio_compra, precio_min_autorizado, precio_objetivo, fecha_ingreso)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      vehiculo.id, vehiculo.vin, vehiculo.folioInterno, vehiculo.marca, vehiculo.modelo,
      vehiculo.anio, vehiculo.version, vehiculo.kilometraje, vehiculo.estado,
      vehiculo.precioCompra, vehiculo.precioMinAutorizado, vehiculo.precioObjetivo, vehiculo.fechaIngreso
    ]);
  }

  public async actualizar(vehiculo: Vehiculo): Promise<void> {
    const query = `
      UPDATE Vehiculos 
      SET estado = ?, precio_compra = ?, precio_min_autorizado = ?, precio_objetivo = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      vehiculo.estado, vehiculo.precioCompra, vehiculo.precioMinAutorizado, vehiculo.precioObjetivo, vehiculo.id
    ]);
  }

  private mapRowToEntity(row: any): Vehiculo {
    return new Vehiculo(
      row.id, row.vin, row.folio_interno, row.marca, row.modelo, row.anio, row.version,
      Number(row.kilometraje), row.estado as EstadoVehiculo, Number(row.precio_compra),
      Number(row.precio_min_autorizado), Number(row.precio_objetivo), new Date(row.fecha_ingreso)
    );
  }
}
