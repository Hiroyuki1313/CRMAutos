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

  // Nuevos campos
  const folio_interno = formData.get('folio_interno') as string;
  const vin = formData.get('vin') as string;
  const color = formData.get('color') as string;
  const placas = formData.get('placas') as string;

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
      fecha_registro_inventario: new Date(),
      folio_interno: folio_interno || null,
      vin: vin || null,
      color: color || null,
      placas: placas || null
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
    // 1. Obtener datos básicos de forma segura
    const parseIntSafe = (key: string, fallback: number = 0) => {
      const val = formData.get(key);
      if (val === null) return undefined;
      const parsed = parseInt(val as string, 10);
      return isNaN(parsed) ? fallback : parsed;
    };

    const data: any = {};
    
    const marca = formData.get('marca') as string;
    if (marca !== null) data.marca = marca || null;

    const modelo = formData.get('modelo') as string;
    if (modelo !== null) data.modelo = modelo || null;

    const anio = parseIntSafe('anio', new Date().getFullYear());
    if (anio !== undefined) data.anio = anio;

    const tipo = formData.get('tipo');
    if (tipo !== null) data.tipo = tipo || null;

    const version = formData.get('version');
    if (version !== null) data.version = version || null;

    const kilometraje = parseIntSafe('kilometraje', 0);
    if (kilometraje !== undefined) data.kilometraje = kilometraje;

    const numero_duenos = parseIntSafe('numero_duenos', 1);
    if (numero_duenos !== undefined) data.numero_duenos = numero_duenos;

    const es_toma_avaluo = formData.get('es_toma_avaluo');
    if (es_toma_avaluo !== null) data.es_toma_avaluo = es_toma_avaluo === 'true';

    const folio_interno = formData.get('folio_interno');
    if (folio_interno !== null) data.folio_interno = folio_interno || null;

    const vin = formData.get('vin');
    if (vin !== null) data.vin = vin || null;

    const color = formData.get('color');
    if (color !== null) data.color = color || null;

    const placas = formData.get('placas');
    if (placas !== null) data.placas = placas || null;


    // 2. Procesar fotos (detectar eliminadas y añadir nuevas)
    const existingAuto = await autoRepo.findById(id);
    if (!existingAuto) return { error: 'Vehículo no encontrado.' };

    const oldPhotos = Array.isArray(existingAuto.fotos_url) 
        ? existingAuto.fotos_url 
        : JSON.parse(existingAuto.fotos_url as any || '[]');

    const newPhotos = formData.getAll('fotos') as File[];
    const currentPhotosJson = formData.get('current_fotos_url') as string;
    const fotosOrderJson = formData.get('fotos_order') as string;
    let fotos_url = currentPhotosJson ? JSON.parse(currentPhotosJson) : [];

    // Eliminar del servidor las fotos que ya no están
    const deletedPhotos = oldPhotos.filter((p: string) => !fotos_url.includes(p));
    for (const photoUrl of deletedPhotos) {
      await storageService.delete(photoUrl);
    }

    const savedUrls: string[] = [];
    if (newPhotos.length > 0 && newPhotos[0].size > 0) {
      console.log(`Action: Processing ${newPhotos.length} new photos`);
      for (let i = 0; i < newPhotos.length; i++) {
        const file = newPhotos[i];
        if (!file || file.size === 0) continue;
        const buffer = Buffer.from(await file.arrayBuffer());
        const optimizedBuffer = await imageProcessor.optimize(buffer);
        const filename = `inv_${normalizeString(data.marca || marca || 'auto')}_${normalizeString(data.modelo || modelo || 'auto')}_${Date.now()}_${i}.webp`;
        const url = await storageService.save(new Uint8Array(optimizedBuffer), filename);
        savedUrls.push(url);
      }
    }

    if (fotosOrderJson) {
      const orderList = JSON.parse(fotosOrderJson) as string[];
      let newIdx = 0;
      data.fotos_url = orderList.map(item => {
        if (item.startsWith('new_')) {
          const url = savedUrls[newIdx];
          newIdx++;
          return url;
        }
        return item;
      }).filter(Boolean);
    } else {
      data.fotos_url = [...fotos_url, ...savedUrls];
    }

    // 3. Procesar documentos nuevos
    const processDoc = async (key: string, prefix: string) => {
      const file = formData.get(key) as File;
      if (file && file.size > 0) {
        const isImage = file.type.startsWith('image/');
        let buffer = Buffer.from(await file.arrayBuffer());
        let filename = `${prefix}_${normalizeString(data.marca || marca || 'auto')}_${normalizeString(data.modelo || modelo || 'auto')}_${Date.now()}`;
        
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

export async function updateAutoCostsAction(id: number, formData: FormData) {
  console.log(`Action: updateAutoCostsAction started for ID: ${id}`);
  const session = await getSession();
  if (!session || (session.role !== 'director' && session.role !== 'gerente')) {
    return { error: 'No autorizado. Solo personal de dirección o gerencia puede editar los costos.' };
  }

  const autoRepo = new MySQLAutoRepository();
  try {
    const parseFloatSafe = (key: string, fallback: number = 0) => {
      const val = formData.get(key);
      if (val === null) return undefined;
      const parsed = parseFloat(val as string);
      return isNaN(parsed) ? fallback : parsed;
    };

    const data: any = {};

    // Costos Financieros principales
    const costo_adquisicion = parseFloatSafe('costo_adquisicion');
    if (costo_adquisicion !== undefined) data.costo_adquisicion = costo_adquisicion;

    const precio_costo = parseFloatSafe('precio_costo');
    if (precio_costo !== undefined) data.precio_costo = precio_costo;

    const publicidad = parseFloatSafe('publicidad');
    if (publicidad !== undefined) data.publicidad = publicidad;

    const precio_publicacion = parseFloatSafe('precio_publicacion');
    if (precio_publicacion !== undefined) data.precio_publicacion = precio_publicacion;

    const precio_min_autorizado = parseFloatSafe('precio_min_autorizado');
    if (precio_min_autorizado !== undefined) data.precio_min_autorizado = precio_min_autorizado;

    const precio_objetivo = parseFloatSafe('precio_objetivo');
    if (precio_objetivo !== undefined) data.precio_objetivo = precio_objetivo;


    const gestion_administrativa = parseFloatSafe('gestion_administrativa');
    if (gestion_administrativa !== undefined) data.gestion_administrativa = gestion_administrativa;

    const comision = parseFloatSafe('comision');
    if (comision !== undefined) data.comision = comision;

    // Acondicionamientos
    const acondicionamientos = [
      'acondicionamiento_llantas',
      'acondicionamiento_pintura',
      'acondicionamiento_mecanica',
      'acondicionamiento_refacciones',
      'acondicionamiento_accesorios',
      'acondicionamiento_limpieza',
      'acondicionamiento_tapiceria',
      'acondicionamiento_odometros',
      'acondicionamiento_pulido',
      'acondicionamiento_mecanica_servicios',
      'acondicionamiento_mecanica_reparaciones'
    ];

    acondicionamientos.forEach(field => {
      const val = parseFloatSafe(field);
      if (val !== undefined) data[field] = val;
    });

    if (Object.keys(data).length === 0) {
      return { error: 'No se recibieron datos válidos para actualizar.' };
    }

    const success = await autoRepo.update(id, data);
    if (success) {
      revalidatePath(`/auto/${id}`);
      revalidatePath('/');
      revalidatePath('/ventas');
      return { success: true };
    }
    return { error: 'No se realizaron cambios o el vehículo no existe.' };
  } catch (error) {
    console.error('Error updating auto costs:', error);
    return { error: 'Error interno al actualizar los costos financieros.' };
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
    const auto = await autoRepo.findById(id);
    if (auto && (auto as any)[field]) {
        const storageService = StorageProvider.getStorageService('inventario');
        await storageService.delete((auto as any)[field]);
    }
    
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
