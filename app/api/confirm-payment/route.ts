import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { payload } = await req.json();

  // TODO: Implementar verificación real cuando se integre MiniKit
  // const response = await fetch(
  //   `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transactionId}?app_id=${process.env.APP_ID}&type=payment`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
  //     },
  //   },
  // );

  // const transaction = await response.json();
  // return NextResponse.json(transaction);

  // Por ahora retornamos éxito
  return NextResponse.json({ success: true, payload });
}
