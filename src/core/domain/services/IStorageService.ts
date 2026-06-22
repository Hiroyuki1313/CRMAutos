export interface IDocumentoFinanciamiento {
  id: string;
  prospectoId: string;
  tipo: 'INE' | 'COMPROBANTE_DOMICILIO' | 'COMPROBANTE_INGRESOS';
  rutaArchivo: string; // URL o path local
}

export interface IStorageService {
  // SRP: Solo se encarga de subir y recuperar archivos físicos
  guardarDocumento(archivoBuffer: Buffer, nombreArchivo: string): Promise<string>;
  obtenerUrlDocumento(rutaArchivo: string): string;
}
