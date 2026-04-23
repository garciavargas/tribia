import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Generar nonce aleatorio (mínimo 8 caracteres alfanuméricos)
  const nonce = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  
  // Guardar nonce en cookie para verificación posterior
  cookies().set('siwe', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hora
  });

  return NextResponse.json({ nonce });
}
