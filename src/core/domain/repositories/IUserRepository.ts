import { Usuario } from '../entities/Usuario';

export interface IUserRepository {
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(user: Omit<Usuario, 'id' | 'fecha_creacion'>): Promise<number>;
  update(id: number, user: Partial<Usuario>): Promise<boolean>;
}
