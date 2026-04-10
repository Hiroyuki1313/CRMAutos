import { Cliente } from '../entities/Cliente';

export interface IClientRepository {
  findById(id: number): Promise<Cliente | null>;
  findByPhone(telefono: string): Promise<Cliente | null>;
  getAll(): Promise<Cliente[]>;
  create(client: Omit<Cliente, 'id' | 'fecha_registro'>): Promise<number>;
  update(id: number, client: Partial<Cliente>): Promise<boolean>;
}
