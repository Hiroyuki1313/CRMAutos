'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { MySQLUserRepository } from '@/infrastructure/repositories/MySQLUserRepository';

const secretKey = process.env.JWT_SECRET || 'autosuz-secret-temporal-2026';
const key = new TextEncoder().encode(secretKey);

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Por favor ingresa correo y contraseña.' };
  }

  const repo = new MySQLUserRepository();
  
  try {
    const user = await repo.findByEmail(email);
    
    if (!user) {
      return { error: 'Credenciales inválidas.' };
    }

    if (user.estatus !== 'activo') {
      return { error: 'Usuario inactivo. Contacta al administrador.' };
    }

    // Verify password (supports bcrypt hash or plain text for migration)
    const isBcrypt = user.password_hash.startsWith('$2');
    let isPasswordValid = false;

    if (isBcrypt) {
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    } else {
      // Plain text fallback as requested by user
      isPasswordValid = (password === user.password_hash);
    }
    
    if (!isPasswordValid) {
      return { error: 'Credenciales inválidas.' };
    }

    // Create JWT payload
    const token = await new SignJWT({ 
        userId: user.id, 
        role: user.rol,
        name: user.nombre
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d') // 1 dia de vida
      .sign(key);

    // Guardar en cookie
    const cookieStore = await cookies();
    cookieStore.set('autosuz_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 dia
      path: '/'
    });

    return { redirect: true }; // El frontend hará la redirección
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Error interno del servidor. Por favor intenta más tarde.' };
  }
}

// Para usar luego en layouts/middleware
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('autosuz_session')?.value;
  if (!session) return null;
  
  try {
    const { payload } = await jwtVerify(session, key);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('autosuz_session');
}
