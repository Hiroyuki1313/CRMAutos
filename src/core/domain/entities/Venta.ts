export interface Venta {
  id: number;
  id_auto: number;
  id_cliente: number;
  id_vendedor: number;
  fecha_venta: Date;
  costo_acondicionamiento: number; // Suma consolidada de los acondicionamientos
  precio_venta: number; // Precio pactado final de venta
  fecha_creacion?: Date;
  
  // Opcionales para Joins/Reportes consolidados
  marca?: string;
  modelo?: string;
  anio?: number;
  tipo_auto?: string;
  nombre_cliente?: string;
  nombre_vendedor?: string;
  origen_cliente?: string;
}
