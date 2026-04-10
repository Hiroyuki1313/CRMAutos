import { Auto, EstadoLogicoAuto } from '../entities/Auto';

export interface IAutoRepository {
  findById(id: number): Promise<Auto | null>;
  getAll(filter?: { estado_logico?: EstadoLogicoAuto }): Promise<Auto[]>;
  create(auto: Omit<Auto, 'id' | 'fecha_creacion'>): Promise<number>;
  updateStatus(id: number, nuevoEstado: EstadoLogicoAuto): Promise<boolean>;
  update(id: number, auto: Partial<Auto>): Promise<boolean>;
}
