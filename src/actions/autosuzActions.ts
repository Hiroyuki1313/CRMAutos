'use server';

import { revalidatePath } from 'next/cache';
import { GastoCosteo } from '../core/domain/entities/GastoCosteo';
import { GastoCosteoRepository } from '../infrastructure/repositories/GastoCosteoRepository';
import { v4 as uuidv4 } from 'uuid'; // Asume que instalarán uuid si no lo tienen

// Repositorios instanciados
const gastoRepo = new GastoCosteoRepository();

/**
 * Server Action: Agregar un nuevo gasto al Centro de Utilidad de un vehículo.
 * Cumple con SRP al delegar al repositorio la persistencia.
 */
export async function registrarGastoVehiculoAction(formData: FormData) {
  const vehiculoId = formData.get('vehiculoId') as string;
  const categoria = formData.get('categoria') as string;
  const monto = Number(formData.get('monto'));
  const concepto = formData.get('concepto') as string;

  if (!vehiculoId || !monto || !categoria) {
    throw new Error('Faltan datos requeridos para el gasto.');
  }

  const nuevoGasto = new GastoCosteo(
    uuidv4(),
    vehiculoId,
    categoria,
    monto,
    new Date(),
    concepto
  );

  // Guardar usando Arquitectura Hexagonal
  await gastoRepo.guardar(nuevoGasto);

  // Revalidar la pantalla del Centro de Utilidad para que Next.js actualice la UI al instante
  revalidatePath(`/gerencia/vehiculo/${vehiculoId}`);
  
  return { success: true };
}

/**
 * Server Action: Aprobar Financiamiento y actualizar embudo
 */
export async function actualizarEmbudoAction(prospectoId: string, nuevaEtapa: string) {
  // Aquí llamamos al ProspectoRepository (una vez implementado) para actualizar la etapa
  
  revalidatePath('/seguimientos');
  return { success: true };
}
