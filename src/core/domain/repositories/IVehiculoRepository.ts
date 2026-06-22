import { Vehiculo } from '../entities/Vehiculo';

export interface IVehiculoRepository {
  obtenerTodos(): Promise<Vehiculo[]>;
  obtenerPorId(id: string): Promise<Vehiculo | null>;
  guardar(vehiculo: Vehiculo): Promise<void>;
  actualizar(vehiculo: Vehiculo): Promise<void>;
}
