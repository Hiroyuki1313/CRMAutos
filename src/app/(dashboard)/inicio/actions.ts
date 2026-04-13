'use server';

import bcrypt from 'bcryptjs';
import { MySQLUserRepository } from '@/infrastructure/repositories/MySQLUserRepository';
import { getSession } from '@/core/usecases/authService';
import { revalidatePath } from 'next/cache';

export async function registerUserAction(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'director') {
        return { error: 'No tienes permisos para realizar esta acción.' };
    }

    const nombre = formData.get('nombre') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;
    const rol = formData.get('rol') as string;

    if (!nombre || !email || !rol) {
        return { error: 'Faltan campos obligatorios.' };
    }

    const repo = new MySQLUserRepository();

    try {
        // Verificar si el correo ya existe
        const existing = await repo.findByEmail(email);
        if (existing) {
            return { error: 'Este correo electrónico ya está registrado.' };
        }

        // Generar contraseña: Primer nombre + 4 dígitos aleatorios
        const firstName = nombre.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
        const plainPassword = `${firstName}${randomDigits}`;

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(plainPassword, 10);

        // Crear usuario
        await repo.create({
            nombre,
            email,
            password_hash: passwordHash,
            telefono,
            rol,
            estatus: 'activo'
        });

        revalidatePath('/inicio');
        return { success: true, password: plainPassword };
    } catch (err: any) {
        console.error('Registration error:', err);
        return { error: 'Error al registrar el usuario en la base de datos.' };
    }
}
