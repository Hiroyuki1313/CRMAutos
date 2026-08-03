import { IStorageContext } from './IStorageContext';

export interface IDocumentoFinanciamiento {
  id: string;
  prospectoId: string;
  tipo: 'INE' | 'COMPROBANTE_DOMICILIO' | 'COMPROBANTE_INGRESOS';
  rutaArchivo: string;
}

export interface IStorageService {
  save(buffer: Uint8Array, filename: string, context?: IStorageContext): Promise<string>;
  delete(url: string): Promise<void>;
  guardarDocumento?(archivoBuffer: Buffer, nombreArchivo: string): Promise<string>;
  obtenerUrlDocumento?(rutaArchivo: string): string;
}
