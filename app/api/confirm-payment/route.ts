import { NextRequest, NextResponse } from "next/server";
import type { PayResult } from "@worldcoin/minikit-js/commands";

type RequestBody = {
  payload: PayResult;
};

export async function POST(req: NextRequest) {
  const { payload } = (await req.json()) as RequestBody;

  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transactionId}?app_id=${process.env.APP_ID}&type=payment`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
      },
    },
  );

  const transaction = await response.json();
  return NextResponse.json(transaction);
}
