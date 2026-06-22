export class Seguimiento {
  constructor(
    public readonly id: string,
    public readonly prospectoId: string,
    public readonly fechaActividad: Date,
    public readonly fechaProximaAccion: Date,
    public readonly tipoAccion: string, // Llamada, Mensaje, Cita
    public readonly notas: string,
    public completado: boolean = false
  ) {}

  public marcarComoCompletado(): void {
    this.completado = true;
  }

  public estaVencido(fechaActual: Date): boolean {
    return !this.completado && this.fechaProximaAccion < fechaActual;
  }
}
