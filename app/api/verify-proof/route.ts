import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const { idkitResponse } = await request.json();

    if (!idkitResponse) {
      return NextResponse.json(
        { error: "IDKit response is required" },
        { status: 400 }
      );
    }

    const rpId = process.env.NEXT_PUBLIC_RP_ID;
    
    if (!rpId) {
      console.error("NEXT_PUBLIC_RP_ID not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verificar proof con Developer Portal
    const verifyResponse = await fetch(
      `https://developer.world.org/api/v4/verify/${rpId}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(idkitResponse),
      }
    );

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      console.error("Verification failed:", errorData);
      return NextResponse.json(
        { error: "Verification failed", details: errorData },
        { status: 400 }
      );
    }

    const verificationData = await verifyResponse.json();

    // Extraer nullifier
    const nullifier = verificationData.nullifier || 
                     verificationData.results?.[0]?.nullifier;

    if (!nullifier) {
      return NextResponse.json(
        { error: "No nullifier in response" },
        { status: 400 }
      );
    }

    // Verificar si el nullifier ya fue usado
    const { saveNullifier, checkNullifier } = await import("@/lib/database/nullifiers");
    const exists = await checkNullifier(nullifier, idkitResponse.action);
    
    if (exists) {
      return NextResponse.json(
        { error: "This World ID has already been used for this action" },
        { status: 409 }
      );
    }
    
    // Guardar nullifier
    await saveNullifier(nullifier, idkitResponse.action);

    return NextResponse.json({
      success: true,
      nullifier,
      verification: verificationData,
    });
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      { error: "Failed to verify proof" },
      { status: 500 }
    );
  }
}
