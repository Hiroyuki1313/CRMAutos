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
      SELECT 
        a.*, 
        au.marca as aux_marca, au.modelo as aux_modelo, au.anio as aux_anio,
        au.version as aux_version, au.kilometraje as aux_km, au.numero_duenos as aux_duenos,
        au.fotos_url as aux_fotos, au.url_factura as aux_factura,
        au.url_tarjeta_circulacion as aux_tarjeta, au.url_poliza_seguro as aux_seguro,
        au.es_toma_avaluo as aux_avaluo,
        u.nombre as nombre_vendedor,
        c.nombre as cli_nombre, c.telefono as cli_telefono, c.probabilidad as cli_prob, c.origen as cli_origen,
        av.oferta as avaluo_monto_oferta
      FROM apartados a
      LEFT JOIN clientes c ON a.id_cliente = c.id
      LEFT JOIN autos au ON a.id_carro = au.id
      LEFT JOIN usuarios u ON a.id_vendedor = u.id
      LEFT JOIN avaluos av ON a.id_avaluo = av.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filter?.vendedorId) {
      query += ` AND a.id_vendedor = ?`;
      params.push(filter.vendedorId);
    } else if (filter?.vendedorIds && filter.vendedorIds.length > 0) {
      const placeholders = filter.vendedorIds.map(() => '?').join(',');
      query += ` AND a.id_vendedor IN (${placeholders})`;
      params.push(...filter.vendedorIds);
    }

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
      query += ` AND a.fecha_actualizacion < DATE_SUB(NOW(), INTERVAL 2 DAY) AND a.estatus_proceso = 'proceso'`;
    }

    if (filter?.from && filter?.to) {
      query += ` AND a.fecha_proximo_seguimiento BETWEEN ? AND ?`;
      params.push(filter.from, filter.to);
    }
    if (filter?.probabilidad && filter.probabilidad !== 'todos') {
      query += ` AND c.probabilidad = ?`;
      params.push(filter.probabilidad);
    }
    if (filter?.origen && filter.origen !== 'todos') {
      query += ` AND c.origen = ?`;
      params.push(filter.origen);
    }
    if (filter?.estatus_credito && filter.estatus_credito !== 'todos') {
      query += ` AND a.estatus_credito = ?`;
      params.push(filter.estatus_credito);
    }

    if (filter?.tab === 'criticos') {
      query += ' ORDER BY a.fecha_actualizacion ASC';
    } else {
      query += ' ORDER BY a.fecha_proximo_seguimiento ASC';
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    return rows.map(r => ({
      ...r,
      marca: r.aux_marca,
      modelo: r.aux_modelo,
      anio: r.aux_anio,
      auto: r.id_carro ? {
        id: r.id_carro,
        marca: r.aux_marca,
        modelo: r.aux_modelo,
        anio: r.aux_anio,
        version: r.aux_version,
        kilometraje: r.aux_km,
        numero_duenos: r.aux_duenos,
        fotos_url: r.aux_fotos,
        url_factura: r.aux_factura,
        url_tarjeta_circulacion: r.aux_tarjeta,
        url_poliza_seguro: r.aux_seguro,
        es_toma_avaluo: r.aux_avaluo
      } : null,
      cliente: r.id_cliente ? {
        id: r.id_cliente,
        nombre: r.cli_nombre,
        telefono: r.cli_telefono,
        probabilidad: r.cli_prob,
        origen: r.cli_origen
      } : null
    })) as Apartado[];
  }

  async findBySeller(id_vendedor: number): Promise<Apartado[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM apartados WHERE id_vendedor = ? ORDER BY fecha_proximo_seguimiento ASC', [id_vendedor]);
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
