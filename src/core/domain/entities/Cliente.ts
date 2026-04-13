export interface Cliente {
  id: number;
  id_vendedor?: number;
  nombre: string;
  telefono: string;
  ine_url?: string;
  comprobante_domicilio_url?: string;
  estados_cuenta_url?: string;
  licencia_contrato_url?: string;
  seguro_url?: string;
  probabilidad: 'frio' | 'tibio' | 'caliente';
  origen: 'ads' | 'piso' | 'redes';
  fecha_proximo_seguimiento?: Date;
  comentarios_vendedor?: string;
  tiene_apartado?: boolean;
  fecha_registro: Date;
}
