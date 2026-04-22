import { NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit-core/signing";

export async function POST(request: Request): Promise<Response> {
  try {
    const { action } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    const signingKey = process.env.WORLDCOIN_SIGNING_KEY;
    
    if (!signingKey) {
      console.error("WORLDCOIN_SIGNING_KEY not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Remover prefijo 0x si existe
    const cleanKey = signingKey.startsWith('0x') 
      ? signingKey.slice(2) 
      : signingKey;

    const { sig, nonce, createdAt, expiresAt } = signRequest({
      signingKeyHex: cleanKey,
      action,
    });

    return NextResponse.json({
      sig,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt,
    });
  } catch (error) {
    console.error("Error generating RP signature:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
