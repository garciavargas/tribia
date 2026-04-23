import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validar la firma del wallet
    if (payload.status === 'success' && payload.address) {
      // Aquí puedes agregar validaciones adicionales
      console.log('Wallet conectado:', payload.address);
      
      return Response.json({ 
        success: true, 
        address: payload.address 
      });
    }
    
    return Response.json({ 
      success: false, 
      error: 'Validación fallida' 
    });
  } catch (error) {
    console.error('Error validating wallet:', error);
    return Response.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}
