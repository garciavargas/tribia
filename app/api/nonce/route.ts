import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET() {
  try {
    // Generar nonce único de 32 bytes
    const nonce = randomBytes(32).toString('hex');
    
    return NextResponse.json({ 
      nonce,
      expirationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error generando nonce:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
