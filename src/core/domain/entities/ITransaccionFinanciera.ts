export enum TipoTransaccion {
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO',
}

export interface ITransaccionFinanciera {
  id: string;
  monto: number;
  fecha: Date;
  concepto: string;
  tipo: TipoTransaccion;
}
