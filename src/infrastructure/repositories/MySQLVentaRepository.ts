import { IVentaRepository, VentaFilterParams, SalesReportSummary } from '../../core/domain/repositories/IVentaRepository';
import { Venta } from '../../core/domain/entities/Venta';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLVentaRepository implements IVentaRepository {
  async create(venta: Omit<Venta, 'id' | 'fecha_creacion'>): Promise<number> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert sales transaction record
      const [result] = await conn.query<ResultSetHeader>(
        'INSERT INTO ventas (id_auto, id_cliente, id_vendedor, fecha_venta, costo_acondicionamiento, precio_venta) VALUES (?, ?, ?, ?, ?, ?)',
        [
          venta.id_auto,
          venta.id_cliente,
          venta.id_vendedor,
          venta.fecha_venta,
          venta.costo_acondicionamiento || 0.00,
          venta.precio_venta || 0.00
        ]
      );
      
      const insertId = result.insertId;

      // 2. Mark the vehicle as sold ('venta')
      await conn.query(
        "UPDATE autos SET estado_logico = 'venta' WHERE id = ?",
        [venta.id_auto]
      );

      // 3. Update the client's probability status to 'venta'
      await conn.query(
        "UPDATE clientes SET probabilidad = 'venta' WHERE id = ?",
        [venta.id_cliente]
      );

      await conn.commit();
      return insertId;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  async getReport(filter?: VentaFilterParams): Promise<SalesReportSummary> {
    let query = `
      SELECT 
        v.*, 
        a.marca, a.modelo, a.anio, a.tipo as tipo_auto, a.es_toma_avaluo,
        c.nombre as nombre_cliente, c.origen as origen_cliente,
        u.nombre as nombre_vendedor
      FROM ventas v
      LEFT JOIN autos a ON v.id_auto = a.id
      LEFT JOIN clientes c ON v.id_cliente = c.id
      LEFT JOIN usuarios u ON v.id_vendedor = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filter?.fecha_inicio) {
      query += ' AND v.fecha_venta >= ?';
      params.push(filter.fecha_inicio);
    }
    if (filter?.fecha_fin) {
      query += ' AND v.fecha_venta <= ?';
      params.push(filter.fecha_fin);
    }
    if (filter?.id_vendedores) {
      if (filter.id_vendedores.length > 0) {
        const placeholders = filter.id_vendedores.map(() => '?').join(',');
        query += ` AND v.id_vendedor IN (${placeholders})`;
        params.push(...filter.id_vendedores);
      } else {
        query += ' AND 1=0'; // Si desmarca todo, no muestra nada
      }
    }
    if (filter?.tipos_auto) {
      if (filter.tipos_auto.length > 0) {
        const placeholders = filter.tipos_auto.map(() => '?').join(',');
        query += ` AND a.tipo IN (${placeholders})`;
        params.push(...filter.tipos_auto);
      } else {
        query += ' AND 1=0';
      }
    }
    if (filter?.origenes_auto) {
      if (filter.origenes_auto.length > 0) {
        const conds: string[] = [];
        if (filter.origenes_auto.includes('toma')) conds.push('a.es_toma_avaluo = 1');
        if (filter.origenes_auto.includes('directo')) conds.push('a.es_toma_avaluo = 0');
        if (conds.length > 0) {
          query += ` AND (${conds.join(' OR ')})`;
        }
      } else {
        query += ' AND 1=0';
      }
    }
    if (filter?.origenes_cliente) {
      if (filter.origenes_cliente.length > 0) {
        const placeholders = filter.origenes_cliente.map(() => '?').join(',');
        query += ` AND c.origen IN (${placeholders})`;
        params.push(...filter.origenes_cliente);
      } else {
        query += ' AND 1=0';
      }
    }

    query += ' ORDER BY v.fecha_venta DESC, v.id DESC';
    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    let total_ventas = rows.length;
    let total_ingresos = 0;
    let total_acondicionamiento = 0;

    const vendedorMap = new Map<string, { cantidad: number, total: number }>();
    const origenMap = new Map<string, number>();
    const tipoMap = new Map<string, number>();

    const ventasList: Venta[] = rows.map(r => {
      total_ingresos += Number(r.precio_venta || 0);
      total_acondicionamiento += Number(r.costo_acondicionamiento || 0);

      // Group Vendedor
      const seller = r.nombre_vendedor || 'Desconocido';
      const sData = vendedorMap.get(seller) || { cantidad: 0, total: 0 };
      sData.cantidad++;
      sData.total += Number(r.precio_venta || 0);
      vendedorMap.set(seller, sData);

      // Group Origen Cliente
      const source = r.origen_cliente || 'Desconocido';
      origenMap.set(source, (origenMap.get(source) || 0) + 1);

      // Group Tipo Auto
      const type = r.tipo_auto || 'otro';
      tipoMap.set(type, (tipoMap.get(type) || 0) + 1);

      return {
        id: r.id,
        id_auto: r.id_auto,
        id_cliente: r.id_cliente,
        id_vendedor: r.id_vendedor,
        fecha_venta: new Date(r.fecha_venta),
        costo_acondicionamiento: Number(r.costo_acondicionamiento || 0),
        precio_venta: Number(r.precio_venta || 0),
        fecha_creacion: r.fecha_creacion,
        marca: r.marca || 'Desconocida',
        modelo: r.modelo || 'Desconocido',
        anio: r.anio || 0,
        tipo_auto: r.tipo_auto || 'otro',
        nombre_cliente: r.nombre_cliente || 'Desconocido',
        nombre_vendedor: r.nombre_vendedor || 'Desconocido',
        origen_cliente: r.origen_cliente || 'piso'
      };
    });

    const ventas_por_vendedor = Array.from(vendedorMap.entries()).map(([vendedor, data]) => ({
      vendedor,
      cantidad: data.cantidad,
      total: data.total
    }));

    const ventas_por_origen = Array.from(origenMap.entries()).map(([origen, cantidad]) => ({
      origen,
      cantidad
    }));

    const ventas_por_tipo = Array.from(tipoMap.entries()).map(([tipo, cantidad]) => ({
      tipo,
      cantidad
    }));

    return {
      total_ventas,
      total_ingresos,
      total_acondicionamiento,
      margen_neto: total_ingresos - total_acondicionamiento,
      ventas_por_vendedor,
      ventas_por_origen,
      ventas_por_tipo,
      ventas: ventasList
    };
  }
}
