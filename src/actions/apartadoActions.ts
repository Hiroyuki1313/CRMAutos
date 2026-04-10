"use server";

import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Apartado } from "@/core/domain/entities/Apartado";

export async function crearApartadoAction(formData: FormData) {
  const id_cliente = parseInt(formData.get("id_cliente") as string, 10);
  const id_carro = parseInt(formData.get("id_carro") as string, 10);
  const monto_apartado = formData.get("monto_apartado") ? parseFloat(formData.get("monto_apartado") as string) : 0;
  
  if (isNaN(id_cliente) || isNaN(id_carro)) {
    throw new Error("Datos inválidos para crear el apartado");
  }

  const newApartado: Apartado = {
    id_venta: 0, // se ignora en el insert
    id_cliente,
    id_carro,
    acudio_cita: false,
    hizo_demo: false,
    toma_a_cuenta: false,
    monto_apartado: monto_apartado,
    estatus_proceso: 'proceso'
  };

  const repo = new MySQLApartadoRepository();
  const newId = await repo.create(newApartado);

  revalidatePath('/cliente/' + id_cliente);
  revalidatePath('/apartado/' + newId);
  revalidatePath('/apartados');

  redirect('/apartado/' + newId);
}
