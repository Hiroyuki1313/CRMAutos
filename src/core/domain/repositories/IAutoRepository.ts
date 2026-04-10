import { Auto, EstadoLogicoAuto } from '../entities/Auto';

export interface AutoFilterParams {
  estado_logico?: EstadoLogicoAuto;
  search?: string;
  tab?: 'todos' | 'frio' | 'apartado';
}

export interface IAutoRepository {
  findById(id: number): Promise<Auto | null>;
  getAll(filter?: AutoFilterParams): Promise<Auto[]>;
  create(auto: Omit<Auto, 'id' | 'fecha_creacion'>): Promise<number>;
  updateStatus(id: number, nuevoEstado: EstadoLogicoAuto): Promise<boolean>;
  update(id: number, auto: Partial<Auto>): Promise<boolean>;
}
