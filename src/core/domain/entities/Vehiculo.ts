export enum EstadoVehiculo {
  DISPONIBLE = 'DISPONIBLE',
  APARTADO = 'APARTADO',
  VENDIDO = 'VENDIDO',
  ACONDICIONAMIENTO = 'ACONDICIONAMIENTO',
}

export class Vehiculo {
  constructor(
    public readonly id: string,
    public readonly vin: string,
    public readonly folioInterno: string,
    public readonly marca: string,
    public readonly modelo: string,
    public readonly anio: number,
    public readonly version: string,
    public readonly kilometraje: number,
    public estado: EstadoVehiculo,
    public precioCompra: number,
    public precioMinAutorizado: number,
    public precioObjetivo: number,
    public readonly fechaIngreso: Date
  ) {}

  // SRP: Vehiculo no calcula sus propios gastos, solo cambia su estado o propiedades básicas.
  public cambiarEstado(nuevoEstado: EstadoVehiculo): void {
    this.estado = nuevoEstado;
  }
}
