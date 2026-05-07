'use server';

import { MySQLAutoRepository } from '@/infrastructure/repositories/MySQLAutoRepository';
import { SharpImageProcessor } from '@/infrastructure/services/SharpImageProcessor';
import { StorageProvider } from '@/infrastructure/services/StorageProvider';
import { getSession } from '@/core/usecases/authService';
import { TipoAuto } from '@/core/domain/entities/Auto';
import { revalidatePath } from 'next/cache';

function normalizeString(str: string): string {
    return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export async function createAutoAction(prevState: any, formData: FormData) {
  console.log('Action: createAutoAction started');
  const session = await getSession();
  console.log('Action: Session role:', session?.role);
  if (!session || (session.role !== 'director' && session.role !== 'gerente')) {
    console.warn('Action: Unauthorized access');
    return { error: 'No autorizado. Solo personal de dirección o gerencia puede registrar nuevas unidades.' };
  }

  const marca = formData.get('marca') as string;
  const modelo = formData.get('modelo') as string;
  const anio = parseInt(formData.get('anio') as string, 10);
  const tipo = formData.get('tipo') as TipoAuto;
  const version = formData.get('version') as string;
  const kilometraje = parseInt(formData.get('kilometraje') as string, 10) || 0;
  const numero_duenos = parseInt(formData.get('numero_duenos') as string, 10) || 1;
  const es_toma_avaluo = formData.get('es_toma_avaluo') === 'true';

  if (!marca || !modelo || isNaN(anio) || !tipo) {
    return { error: 'Todos los campos son obligatorios. Revisa Marca, Modelo, Año y Tipo.' };
  }

  const autoRepo = new MySQLAutoRepository();
  const imageProcessor = new SharpImageProcessor();
  const storageService = StorageProvider.getStorageService('inventario');

  const processFile = async (file: File | null, prefix: string) => {
    if (!file || file.size === 0) return null;
    
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    let buffer = Buffer.from(await file.arrayBuffer());
    let filename = `${prefix}_${normalizeString(marca)}_${normalizeString(modelo)}_${Date.now()}`;
    
    if (isImage) {
        buffer = Buffer.from(await imageProcessor.optimize(buffer));
        filename += '.webp';
    } else if (isPDF) {
        filename += '.pdf';
    } else {
        // Por si acaso suben otra cosa, mantenemos la extensión original
        const ext = file.name.split('.').pop();
        filename += `.${ext}`;
    }

    return await storageService.save(new Uint8Array(buffer), filename);
  };

  try {
    // 1. Procesar Fotos Galería
    const photoFiles = formData.getAll('fotos') as File[];
    const uploadedUrls: string[] = [];
    
    console.log(`Action: Processing ${photoFiles.length} photos`);
    for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        if (!file || file.size === 0) continue;
        console.log(`Action: Optimizing photo ${i+1}`);
        const buffer = Buffer.from(await file.arrayBuffer());
        const optimizedBuffer = await imageProcessor.optimize(buffer);
        const filename = `inv_${normalizeString(marca)}_${normalizeString(modelo)}_${Date.now()}_${i}.webp`;
        const url = await storageService.save(optimizedBuffer, filename);
        uploadedUrls.push(url);
    }

    console.log('Action: Processing documentation');
    // 2. Procesar Documentación Individual
    const url_factura = await processFile(formData.get('factura') as File, 'doc_factura');
    const url_tarjeta_circulacion = await processFile(formData.get('tarjeta_circulacion') as File, 'doc_tarjeta');
    const url_poliza_seguro = await processFile(formData.get('poliza_seguro') as File, 'doc_poliza');
    const url_ine_propietario = await processFile(formData.get('ine_propietario') as File, 'doc_ine');
    const url_contrato_compraventa = await processFile(formData.get('contrato_compraventa') as File, 'doc_contrato');

    console.log('Action: Saving to repository');
    // 3. Crear Auto en Inventario
    await autoRepo.create({
      marca,
      modelo,
      anio,
      tipo,
      version,
      kilometraje,
      numero_duenos,
      es_toma_avaluo,
      url_factura,
      url_tarjeta_circulacion,
      url_poliza_seguro,
      url_ine_propietario,
      url_contrato_compraventa,
      fotos_url: uploadedUrls,
      estado_logico: 'inventario',
      fecha_registro_inventario: new Date()
    });

    console.log('Action: Creation successful, revalidating paths');
    try {
        revalidatePath('/');
        revalidatePath('/avaluos');
        console.log('Action: Revalidation done');
    } catch (revalidateError) {
        console.error('Action: Revalidation error (non-fatal):', revalidateError);
    }
    
    return { redirect: true }; 
  } catch (error) {
    console.error('Error creating auto:', error);
    return { error: 'Error interno procesando el registro. Por favor intenta más tarde.' };
  }
}

export async function updateAutoAction(id: number, formData: FormData) {
  console.log(`Action: updateAutoAction started for ID: ${id}`);
  const session = await getSession();
  if (!session || (session.role !== 'director' && session.role !== 'gerente')) {
    return { error: 'No autorizado.' };
  }

  const autoRepo = new MySQLAutoRepository();
  const imageProcessor = new SharpImageProcessor();
  const storageService = StorageProvider.getStorageService('inventario');

  try {
    // 1. Obtener datos básicos
    const marca = formData.get('marca') as string;
    const modelo = formData.get('modelo') as string;
    
    const data: any = {
      marca,
      modelo,
      anio: parseInt(formData.get('anio') as string, 10),
      tipo: formData.get('tipo') as any,
      version: formData.get('version') as string,
      kilometraje: parseInt(formData.get('kilometraje') as string, 10),
      numero_duenos: parseInt(formData.get('numero_duenos') as string, 10),
      es_toma_avaluo: formData.get('es_toma_avaluo') === 'true'
    };

    // 2. Procesar nuevas fotos si las hay
    const newPhotos = formData.getAll('fotos') as File[];
    const currentPhotosJson = formData.get('current_fotos_url') as string;
    let fotos_url = currentPhotosJson ? JSON.parse(currentPhotosJson) : [];

    if (newPhotos.length > 0 && newPhotos[0].size > 0) {
      console.log(`Action: Processing ${newPhotos.length} new photos`);
      for (let i = 0; i < newPhotos.length; i++) {
        const file = newPhotos[i];
        if (!file || file.size === 0) continue;
        const buffer = Buffer.from(await file.arrayBuffer());
        const optimizedBuffer = await imageProcessor.optimize(buffer);
        const filename = `inv_${normalizeString(marca)}_${normalizeString(modelo)}_${Date.now()}_${i}.webp`;
        const url = await storageService.save(new Uint8Array(optimizedBuffer), filename);
        fotos_url.push(url);
      }
      data.fotos_url = fotos_url;
    }

    // 3. Procesar documentos nuevos
    const processDoc = async (key: string, prefix: string) => {
      const file = formData.get(key) as File;
      if (file && file.size > 0) {
        const isImage = file.type.startsWith('image/');
        let buffer = Buffer.from(await file.arrayBuffer());
        let filename = `${prefix}_${normalizeString(marca)}_${normalizeString(modelo)}_${Date.now()}`;
        
        if (isImage) {
          buffer = Buffer.from(await imageProcessor.optimize(buffer));
          filename += '.webp';
        } else {
          filename += `.${file.name.split('.').pop()}`;
        }
        return await storageService.save(new Uint8Array(buffer), filename);
      }
      return null;
    };

    const url_factura = await processDoc('factura', 'doc_factura');
    const url_tarjeta = await processDoc('tarjeta_circulacion', 'doc_tarjeta');
    const url_poliza = await processDoc('poliza_seguro', 'doc_poliza');
    const url_ine = await processDoc('ine_propietario', 'doc_ine');
    const url_contrato = await processDoc('contrato_compraventa', 'doc_contrato');

    if (url_factura) data.url_factura = url_factura;
    if (url_tarjeta) data.url_tarjeta_circulacion = url_tarjeta;
    if (url_poliza) data.url_poliza_seguro = url_poliza;
    if (url_ine) data.url_ine_propietario = url_ine;
    if (url_contrato) data.url_contrato_compraventa = url_contrato;

    const success = await autoRepo.update(id, data);
    if (success) {
      revalidatePath(`/auto/${id}`);
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'No se realizaron cambios o el vehículo no existe.' };
  } catch (error) {
    console.error('Error updating auto:', error);
    return { error: 'Error interno al actualizar el vehículo.' };
  }
}

export async function uploadAutoDocumentAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== 'director' && session.role !== 'gerente')) {
    return { success: false, error: 'No autorizado' };
  }

  const id = parseInt(formData.get('id') as string);
  const field = formData.get('field') as string;
  const file = formData.get('file') as File;

  if (!id || !field || !file) return { success: false, error: 'Datos incompletos' };

  try {
    const storageService = StorageProvider.getStorageService('inventario');
    const imageProcessor = new SharpImageProcessor();
    
    let buffer = Buffer.from(await file.arrayBuffer());
    const isImage = file.type.startsWith('image/');
    let filename = `${field}_${id}_${Date.now()}`;
    
    if (isImage) {
      buffer = Buffer.from(await imageProcessor.optimize(buffer));
      filename += '.webp';
    } else {
      const ext = file.name.split('.').pop();
      filename += `.${ext}`;
    }

    const url = await storageService.save(new Uint8Array(buffer), filename);

    // Actualizar base de datos
    const autoRepo = new MySQLAutoRepository();
    await autoRepo.update(id, { [field]: url });

    revalidatePath(`/auto/${id}`);
    revalidatePath('/');
    
    return { success: true, url };
  } catch (error: any) {
    console.error('Error en uploadAutoDocumentAction:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteAutoDocumentAction(id: number, field: string) {
  const session = await getSession();
  if (!session || (session.role !== 'director' && session.role !== 'gerente')) {
    return { success: false, error: 'No autorizado' };
  }

  try {
    const autoRepo = new MySQLAutoRepository();
    await autoRepo.update(id, { [field]: null });
    
    revalidatePath(`/auto/${id}`);
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error en deleteAutoDocumentAction:', error);
    return { success: false, error: 'Error al eliminar documento' };
  }
}

export async function getAutoByIdAction(id: number) {
  try {
    const autoRepo = new MySQLAutoRepository();
    const auto = await autoRepo.findById(id);
    return { success: true, auto };
  } catch (error) {
    console.error('Error fetching auto by id:', error);
    return { success: false, error: 'Error al obtener detalles del vehículo' };
  }
}
