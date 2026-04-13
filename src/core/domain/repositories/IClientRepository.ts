import { Cliente } from '../entities/Cliente';

export interface ClientFilterParams {
  search?: string;
  origen?: 'todos' | 'ads' | 'piso' | 'redes';
  tiene_apartado?: 'con' | 'sin' | 'todos';
  probabilidad?: 'todos' | 'frio' | 'tibio' | 'caliente';
  vendedorId?: number;
  vendedorIds?: number[];
}

export interface IClientRepository {
  findById(id: number): Promise<Cliente | null>;
  findByPhone(telefono: string): Promise<Cliente | null>;
  getAll(filter?: ClientFilterParams): Promise<Cliente[]>;
  create(client: Omit<Cliente, 'id' | 'fecha_registro'>): Promise<number>;
  update(id: number, client: Partial<Cliente>): Promise<boolean>;
  getProbabilityStats(vendedorId?: number): Promise<{ frio: number, tibio: number, caliente: number }>;
}
