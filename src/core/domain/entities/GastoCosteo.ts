import { ITransaccionFinanciera, TipoTransaccion } from './ITransaccionFinanciera';

export class GastoCosteo implements ITransaccionFinanciera {
  constructor(
    public readonly id: string,
    public readonly vehiculoId: string,
    public readonly categoria: string, // e.g., Mecánico, Pintura, Llantas, Marketing
    public readonly monto: number,
    public readonly fecha: Date,
    public readonly concepto: string,
  ) {}

  get tipo(): TipoTransaccion {
    return TipoTransaccion.EGRESO;
  }
}
