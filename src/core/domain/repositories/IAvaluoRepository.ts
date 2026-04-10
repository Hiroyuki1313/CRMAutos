import { Avaluo } from '../entities/Avaluo';

export interface IAvaluoRepository {
  findById(id: number): Promise<Avaluo | null>;
  getAll(filter?: { sub_estado_avaluo?: string }): Promise<Avaluo[]>;
  create(avaluo: Omit<Avaluo, 'id' | 'fecha_registro'>): Promise<number>;
  update(id: number, avaluo: Partial<Avaluo>): Promise<boolean>;
}
