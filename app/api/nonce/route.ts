import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Generar nonce alfanumérico de al menos 8 caracteres
  const nonce = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  return NextResponse.json({ nonce });
}
