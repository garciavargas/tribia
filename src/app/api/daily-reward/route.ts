import { NextRequest, NextResponse } from 'next/server';
import { canClaimDailyReward, recordDailyClaim } from '@/lib/daily-reward';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.address) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const address = session.user.address;
    const { canClaim, nextClaimTime } = await canClaimDailyReward(address);

    if (!canClaim) {
      const waitTime = Math.ceil((nextClaimTime! - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: `Debes esperar ${waitTime} minutos para reclamar de nuevo` },
        { status: 429 }
      );
    }

    // TODO: Aquí iría la lógica de envío de 1 WGoal
    await recordDailyClaim(address);

    return NextResponse.json({
      success: true,
      amount: 1,
      nextClaimTime: Date.now() + (5 * 60 * 1000),
    });
  } catch (error) {
    console.error('Error en claim diario:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.address) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { canClaim, nextClaimTime } = await canClaimDailyReward(session.user.address);

    return NextResponse.json({ canClaim, nextClaimTime });
  } catch (error) {
    console.error('Error verificando claim:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
