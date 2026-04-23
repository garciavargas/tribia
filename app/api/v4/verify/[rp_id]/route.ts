import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { rp_id: string } }
) {
  try {
    const body = await request.json();
    const { rp_id } = params;

    // Reenviar directamente a la API de World
    const response = await fetch(
      `https://developer.world.org/api/v4/verify/${rp_id}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Error verifying World ID:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
