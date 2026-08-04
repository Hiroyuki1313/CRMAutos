export type EntityDomain = 'inventario' | 'clientes' | 'seguimientos' | 'avaluos' | 'apartados';
export type ResourceCategory = 'fotos' | 'documentos';

export interface IStorageContext {
  domain: EntityDomain;
  entityId: string | number;
  category?: ResourceCategory;
}
