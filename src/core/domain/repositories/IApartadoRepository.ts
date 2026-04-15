import { Apartado } from '../entities/Apartado';

export interface ApartadoFilterParams {
  search?: string;
  tab?: 'todos' | 'hoy' | 'semana' | 'vencidos' | 'criticos';
  vendedorId?: number;
  vendedorIds?: number[];
  from?: string;
  to?: string;
  probabilidad?: string;
  origen?: string;
  estatus_credito?: string;
}

export interface IApartadoRepository {
  findById(id: number): Promise<Apartado | null>;
  getAll(filter?: ApartadoFilterParams): Promise<Apartado[]>;
  findBySeller(id_vendedor: number): Promise<Apartado[]>;
  create(apartado: Apartado): Promise<number>; // Assuming id is id_venta and is auto-increment though
  update(id: number, apartado: Partial<Apartado>): Promise<boolean>;
}
