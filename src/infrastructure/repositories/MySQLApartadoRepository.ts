import { IApartadoRepository, ApartadoFilterParams, CRMStats, SellerMetricCount } from '../../core/domain/repositories/IApartadoRepository';
import { Apartado } from '../../core/domain/entities/Apartado';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLApartadoRepository implements IApartadoRepository {
  async findById(id: number): Promise<Apartado | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT a.*, u.nombre as nombre_vendedor FROM apartados a LEFT JOIN usuarios u ON a.id_vendedor = u.id WHERE a.id_venta = ?', [id]);
    return rows.length ? (rows[0] as Apartado) : null;
  }

  async getAll(filter?: ApartadoFilterParams): Promise<Apartado[]> {
    const { query, params } = this.buildQueryAndParams(filter);
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows.map(r => this.mapRowToApartado(r));
  }

  private buildQueryAndParams(filter?: ApartadoFilterParams) {
    let query = this.getBaseQuery();
    const params: any[] = [];
    if (filter) {
      query = this.applySellerFilter(query, params, filter);
      query = this.applySearchFilter(query, params, filter);
      query = this.applyTabFilter(query, params, filter);
      query = this.applyDateFilters(query, params, filter);
      query = this.applyOtherFilters(query, params, filter);
      query += filter.tab === 'criticos' ? ' ORDER BY a.fecha_actualizacion ASC' : ' ORDER BY a.id_venta DESC';
    } else {
      query += ` AND a.probabilidad != 'Rechazo' AND a.probabilidad != 'Venta' ORDER BY a.id_venta DESC`;
    }
    return { query, params };
  }

  private getBaseQuery(): string {
    return `
      SELECT 
        a.*, 
        au.marca as aux_marca, au.modelo as aux_modelo, au.anio as aux_anio,
        au.version as aux_version, au.kilometraje as aux_km, au.numero_duenos as aux_duenos,
        au.fotos_url as aux_fotos, au.url_factura as aux_factura,
        au.url_tarjeta_circulacion as aux_tarjeta, au.url_poliza_seguro as aux_seguro,
        au.es_toma_avaluo as aux_avaluo,
        u.nombre as nombre_vendedor,
        av.oferta as avaluo_monto_oferta
      FROM apartados a
      LEFT JOIN autos au ON a.id_carro = au.id
      LEFT JOIN usuarios u ON a.id_vendedor = u.id
      LEFT JOIN avaluos av ON a.id_avaluo = av.id
      WHERE 1=1
    `;
  }

  private applySellerFilter(query: string, params: any[], filter: ApartadoFilterParams): string {
    if (filter.vendedorId) {
      params.push(filter.vendedorId);
      return query + ` AND a.id_vendedor = ?`;
    }
    if (filter.vendedorIds && filter.vendedorIds.length > 0) {
      const placeholders = filter.vendedorIds.map(() => '?').join(',');
      params.push(...filter.vendedorIds);
      return query + ` AND a.id_vendedor IN (${placeholders})`;
    }
    return query;
  }

  private applySearchFilter(query: string, params: any[], filter: ApartadoFilterParams): string {
    if (!filter.search) return query;
    const term = `%${filter.search}%`;
    params.push(term, term, term, term);
    return query + ` AND (a.nombre_prospecto LIKE ? OR a.telefono_prospecto LIKE ? OR au.marca LIKE ? OR au.modelo LIKE ?)`;
  }

  private applyTabFilter(query: string, params: any[], filter: ApartadoFilterParams): string {
    if (filter.tab === 'hoy') return query + ` AND a.fecha_proximo_seguimiento = CURDATE()`;
    if (filter.tab === 'semana') return query + ` AND YEARWEEK(a.fecha_proximo_seguimiento, 1) = YEARWEEK(CURDATE(), 1)`;
    if (filter.tab === 'vencidos') return query + ` AND a.fecha_proximo_seguimiento < CURDATE()`;
    if (filter.tab === 'criticos') return query + ` AND a.fecha_actualizacion < DATE_SUB(NOW(), INTERVAL 2 DAY) AND a.probabilidad NOT IN ('Venta', 'Rechazo')`;
    return query;
  }

  private applyDateFilters(query: string, params: any[], filter: ApartadoFilterParams): string {
    if (filter.from && filter.to) {
      query += ` AND DATE(a.fecha_proxima_cita) BETWEEN ? AND ?`;
      params.push(filter.from, filter.to);
    }
    if (filter.fromAdded && filter.toAdded) {
      query += ` AND DATE(a.fecha_registro_prospecto) BETWEEN ? AND ?`;
      params.push(filter.fromAdded, filter.toAdded);
    }
    if (filter.fromFollowUp && filter.toFollowUp) {
      query += ` AND DATE(a.fecha_proximo_seguimiento) BETWEEN ? AND ?`;
      params.push(filter.fromFollowUp, filter.toFollowUp);
    }
    return query;
  }

  private applyOtherFilters(query: string, params: any[], filter: ApartadoFilterParams): string {
    if (filter.probabilidad === 'todos') {
      // No filter by probability, returns all
    } else if (filter.probabilidad) {
      const probs = filter.probabilidad.split(',').filter(x => x && x !== 'todos');
      if (probs.length > 0) {
        const placeholders = probs.map(() => '?').join(',');
        query += ` AND a.probabilidad IN (${placeholders})`;
        params.push(...probs);
      }
    } else {
      query += ` AND a.probabilidad != 'Rechazo' AND a.probabilidad != 'Venta'`;
    }

    if (filter.origen && filter.origen !== 'todos') {
      const origs = filter.origen.split(',').filter(x => x && x !== 'todos');
      if (origs.length > 0) {
        const placeholders = origs.map(() => '?').join(',');
        query += ` AND a.origen_prospecto IN (${placeholders})`;
        params.push(...origs);
      }
    }

    if (filter.estatus_credito && filter.estatus_credito !== 'todos') {
      const creds = filter.estatus_credito.split(',').filter(x => x && x !== 'todos');
      if (creds.length > 0) {
        const placeholders = creds.map(() => '?').join(',');
        query += ` AND a.estatus_credito IN (${placeholders})`;
        params.push(...creds);
      }
    }
    return query;
  }

  private mapRowToApartado(r: RowDataPacket): Apartado {
    const auto = r.id_carro ? this.mapRowToAuto(r) : null;
    return {
      ...r,
      marca: r.aux_marca,
      modelo: r.aux_modelo,
      anio: r.aux_anio,
      auto,
      cliente: {
        nombre: r.nombre_prospecto,
        telefono: r.telefono_prospecto,
        probabilidad: r.probabilidad,
        origen: r.origen_prospecto
      }
    } as unknown as Apartado;
  }

  private mapRowToAuto(r: RowDataPacket) {
    return {
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
    };
  }

  async findBySeller(id_vendedor: number): Promise<Apartado[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM apartados WHERE id_vendedor = ? ORDER BY id_venta DESC', [id_vendedor]);
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

  async findByPhone(telefono: string): Promise<Apartado | null> {
    const query = `
      SELECT a.*, u.nombre as nombre_vendedor 
      FROM apartados a 
      LEFT JOIN usuarios u ON a.id_vendedor = u.id 
      WHERE a.telefono_prospecto = ?
      ORDER BY a.id_venta DESC
      LIMIT 1
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [telefono]);
    return rows.length ? (rows[0] as Apartado) : null;
  }

  async getCRMStats(): Promise<CRMStats> {
    const nuevos = await this.getNewProspects();
    const citas = await this.getTodayAppointments();
    const vencidos = await this.getExpiredFollowUps();
    return {
      prospectosNuevos: { total: nuevos.reduce((sum, x) => sum + x.count, 0), asesores: nuevos },
      citasDeHoy: { total: citas.reduce((sum, x) => sum + x.count, 0), asesores: citas },
      seguimientosVencidos: { total: vencidos.reduce((sum, x) => sum + x.count, 0), asesores: vencidos }
    };
  }

  private async getNewProspects(): Promise<SellerMetricCount[]> {
    const query = `
      SELECT a.id_vendedor, COALESCE(u.nombre, 'Sin Asignar') as vendedor, COUNT(*) as count
      FROM apartados a LEFT JOIN usuarios u ON a.id_vendedor = u.id
      WHERE a.fecha_registro_prospecto >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND a.probabilidad NOT IN ('Venta', 'Rechazo')
      GROUP BY a.id_vendedor, u.nombre
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows.map(r => ({ vendedor: r.vendedor, count: Number(r.count), id_vendedor: r.id_vendedor ? Number(r.id_vendedor) : null }));
  }

  private async getTodayAppointments(): Promise<SellerMetricCount[]> {
    const query = `
      SELECT a.id_vendedor, COALESCE(u.nombre, 'Sin Asignar') as vendedor, COUNT(*) as count
      FROM apartados a LEFT JOIN usuarios u ON a.id_vendedor = u.id
      WHERE DATE(a.fecha_proxima_cita) = CURDATE()
        AND a.probabilidad NOT IN ('Venta', 'Rechazo')
      GROUP BY a.id_vendedor, u.nombre
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows.map(r => ({ vendedor: r.vendedor, count: Number(r.count), id_vendedor: r.id_vendedor ? Number(r.id_vendedor) : null }));
  }

  private async getExpiredFollowUps(): Promise<SellerMetricCount[]> {
    const query = `
      SELECT a.id_vendedor, COALESCE(u.nombre, 'Sin Asignar') as vendedor, COUNT(*) as count
      FROM apartados a LEFT JOIN usuarios u ON a.id_vendedor = u.id
      WHERE a.fecha_proximo_seguimiento < CURDATE()
        AND a.probabilidad NOT IN ('Venta', 'Rechazo')
      GROUP BY a.id_vendedor, u.nombre
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows.map(r => ({ vendedor: r.vendedor, count: Number(r.count), id_vendedor: r.id_vendedor ? Number(r.id_vendedor) : null }));
  }
}

