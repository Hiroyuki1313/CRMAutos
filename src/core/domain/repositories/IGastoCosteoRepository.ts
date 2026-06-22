import { GastoCosteo } from '../entities/GastoCosteo';

export interface IGastoCosteoRepository {
  obtenerPorVehiculo(vehiculoId: string): Promise<GastoCosteo[]>;
  guardar(gasto: GastoCosteo): Promise<void>;
}
