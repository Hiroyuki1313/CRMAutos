export type RolUsuario = 'director' | 'gerente' | 'vendedor' | 'redes' | 'TI';
export type EstatusUsuario = 'activo' | 'inactivo';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
  telefono?: string;
  rol: RolUsuario;
  estatus: EstatusUsuario;
  fecha_creacion: Date;
}
