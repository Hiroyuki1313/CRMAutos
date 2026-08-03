export type EntityDomain = 'inventario' | 'clientes' | 'seguimientos' | 'avaluos' | 'apartados';

export interface IStorageContext {
  domain: EntityDomain;
  entityId: string | number;
}
