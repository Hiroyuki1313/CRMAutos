"use server";

import { MySQLApartadoRepository } from "@/infrastructure/repositories/MySQLApartadoRepository";
import { MySQLClientRepository } from "@/infrastructure/repositories/MySQLClientRepository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Apartado } from "@/core/domain/entities/Apartado";
import { getSession } from "@/core/usecases/authService";

export async function crearApartadoAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("No autorizado");

  const id_cliente = parseInt(formData.get("id_cliente") as string, 10);
  const id_carro = parseInt(formData.get("id_carro") as string, 10);
  const monto_apartado = formData.get("monto_apartado") ? parseFloat(formData.get("monto_apartado") as string) : 0;
  
  if (isNaN(id_cliente) || isNaN(id_carro)) {
    throw new Error("Datos inválidos para crear el apartado");
  }

  const clientRepo = new MySQLClientRepository();
  const cliente = await clientRepo.findById(id_cliente);
  if (!cliente) throw new Error("Cliente no encontrado");

  const newApartado: Apartado = {
    id_venta: 0, 
    id_vendedor: session.userId as number,
    id_carro,
    nombre_prospecto: cliente.nombre,
    telefono_prospecto: cliente.telefono,
    origen_prospecto: cliente.origen as any,
    probabilidad: cliente.probabilidad as any,
    ine_url: cliente.ine_url,
    comprobante_domicilio_url: cliente.comprobante_domicilio_url,
    estados_cuenta_url: cliente.estados_cuenta_url,
    licencia_contrato_url: cliente.licencia_contrato_url,
    seguro_url: cliente.seguro_url,
    acudio_cita: false,
    hizo_demo: false,
    toma_a_cuenta: false,
    monto_apartado: monto_apartado,
    estatus_credito: 'pendiente respuesta'
  };

  const repo = new MySQLApartadoRepository();
  const newId = await repo.create(newApartado);

  revalidatePath('/cliente/' + id_cliente);
  revalidatePath('/apartados');

  redirect('/apartado/' + newId);
}
