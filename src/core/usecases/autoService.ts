'use server';

import { MySQLAutoRepository } from '@/infrastructure/repositories/MySQLAutoRepository';
import { TipoAuto } from '@/core/domain/entities/Auto';

export async function createAutoAction(prevState: any, formData: FormData) {
  const marca = formData.get('marca') as string;
  const modelo = formData.get('modelo') as string;
  const anio = parseInt(formData.get('anio') as string, 10);
  const tipo = formData.get('tipo') as TipoAuto;

  if (!marca || !modelo || isNaN(anio) || !tipo) {
    return { error: 'Todos los campos son obligatorios. Revisa Marca, Modelo, Año y Tipo.' };
  }

  const repo = new MySQLAutoRepository();
  
  try {
    const newId = await repo.create({
      marca,
      modelo,
      anio,
      tipo,
      fotos_url: [], // Mocked as empty JSON array for now since no S3 uploads
      estado_logico: 'frio',
      fecha_registro_inventario: new Date()
    });

    return { redirect: true }; 
  } catch (error) {
    console.error('Error creating auto:', error);
    return { error: 'Error interno conectando a Hostinger. Por favor intenta más tarde.' };
  }
}
