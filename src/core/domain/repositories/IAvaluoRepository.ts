import { Avaluo } from '../entities/Avaluo';

export interface IAvaluoRepository {
  findById(id: number): Promise<Avaluo | null>;
  getAll(filter?: { 
    status?: string;
    search?: string;
    vendedorId?: number;
    vendedorIds?: number[];
  }): Promise<Avaluo[]>;
  create(avaluo: Omit<Avaluo, 'id' | 'fecha_registro'>): Promise<number>;
  update(id: number, avaluo: Partial<Avaluo>): Promise<boolean>;
}
