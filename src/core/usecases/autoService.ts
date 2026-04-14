'use server';

import { MySQLAutoRepository } from '@/infrastructure/repositories/MySQLAutoRepository';
import { SharpImageProcessor } from '@/infrastructure/services/SharpImageProcessor';
import { LocalStorageService } from '@/infrastructure/services/LocalStorageService';
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
  const storageService = new LocalStorageService();

  const processFile = async (file: File | null, prefix: string) => {
    if (!file || file.size === 0) return null;
    const buffer = Buffer.from(await file.arrayBuffer());
    const optimizedBuffer = await imageProcessor.optimize(buffer);
    const filename = `${prefix}_${normalizeString(marca)}_${normalizeString(modelo)}_${Date.now()}.webp`;
    return await storageService.save(optimizedBuffer, filename);
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
