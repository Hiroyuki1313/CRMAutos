export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  ine_url?: string;
  comprobante_domicilio_url?: string;
  estados_cuenta_url?: string;
  licencia_contrato_url?: string;
  seguro_url?: string;
  fecha_registro: Date;
}
