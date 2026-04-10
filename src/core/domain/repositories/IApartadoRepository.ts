import { Apartado } from '../entities/Apartado';

export interface IApartadoRepository {
  findById(id: number): Promise<Apartado | null>;
  getAll(): Promise<Apartado[]>;
  findBySeller(id_vendedor: number): Promise<Apartado[]>;
  create(apartado: Apartado): Promise<number>; // Assuming id is id_venta and is auto-increment though
  update(id: number, apartado: Partial<Apartado>): Promise<boolean>;
}
