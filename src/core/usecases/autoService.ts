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
  const session = await getSession();
  if (!session || session.role !== 'director') {
    return { error: 'No autorizado. Solo el director puede registrar nuevas unidades.' };
  }

  const marca = formData.get('marca') as string;
  const modelo = formData.get('modelo') as string;
  const anio = parseInt(formData.get('anio') as string, 10);
  const tipo = formData.get('tipo') as TipoAuto;

  if (!marca || !modelo || isNaN(anio) || !tipo) {
    return { error: 'Todos los campos son obligatorios. Revisa Marca, Modelo, Año y Tipo.' };
  }

  const autoRepo = new MySQLAutoRepository();
  const imageProcessor = new SharpImageProcessor();
  const storageService = new LocalStorageService();

  try {
    // Procesar Fotos
    const photoFiles = formData.getAll('fotos') as File[];
    const uploadedUrls: string[] = [];
    const timestamp = Date.now();
    const normalizedMarca = normalizeString(marca);
    const normalizedModelo = normalizeString(modelo);

    for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        if (!file || file.size === 0) continue;

        const buffer = Buffer.from(await file.arrayBuffer());
        const optimizedBuffer = await imageProcessor.optimize(buffer);
        
        const filename = `inv_${normalizedMarca}_${normalizedModelo}_${timestamp}_${i}.webp`;
        const url = await storageService.save(optimizedBuffer, filename);
        uploadedUrls.push(url);
    }

    // Crear Auto en Inventario
    const autoId = await autoRepo.create({
      marca,
      modelo,
      anio,
      tipo,
      fotos_url: uploadedUrls,
      estado_logico: 'inventario',
      fecha_registro_inventario: new Date()
    });

    revalidatePath('/');
    revalidatePath('/avaluos');
    return { redirect: true }; 
  } catch (error) {
    console.error('Error creating auto:', error);
    return { error: 'Error interno procesando el registro. Por favor intenta más tarde.' };
  }
}
