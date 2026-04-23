import { NextResponse } from "next/server";
import type { IDKitResult } from "@worldcoin/idkit-core";

export async function POST(request: Request): Promise<Response> {
  const { rp_id, idkitResponse } = (await request.json()) as {
    rp_id: string;
    idkitResponse: IDKitResult;
  };

  const response = await fetch(
    `https://developer.world.org/api/v4/verify/${rp_id}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(idkitResponse),
    },
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  const data = await response.json();
  
  return NextResponse.json({ 
    success: true,
    nullifier: data.responses?.[0]?.nullifier 
  });
}
