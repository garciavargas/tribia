import { NextResponse } from "next/server";
import { sendWGoal } from "@/lib/rewards";
import { markWelcomeReceived, getUser } from "@/lib/database/users";

export async function POST(request: Request): Promise<Response> {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await getUser(walletAddress);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verificar que no haya recibido la bienvenida antes
    if (user.welcomeReceived) {
      return NextResponse.json(
        { error: "Welcome reward already claimed" },
        { status: 409 }
      );
    }

    // Enviar 1 WGoal al usuario
    const result = await sendWGoal(walletAddress, 1);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send WGoal" },
        { status: 500 }
      );
    }

    // Marcar bienvenida como recibida
    await markWelcomeReceived(walletAddress);

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
      amount: 1
    });
  } catch (error) {
    console.error("Error sending welcome reward:", error);
    return NextResponse.json(
      { error: "Failed to send welcome reward" },
      { status: 500 }
    );
  }
}
