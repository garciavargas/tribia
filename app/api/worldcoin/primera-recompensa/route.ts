import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, verified } = await request.json();
    
    if (verified && walletAddress) {
      console.log('Recompensa procesada para:', walletAddress);
      
      return Response.json({ 
        success: true,
        message: 'Recompensa procesada exitosamente'
      });
    }
    
    return Response.json({ 
      success: false, 
      error: 'Verificación fallida' 
    });
  } catch (error) {
    console.error('Error processing reward:', error);
    return Response.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}
