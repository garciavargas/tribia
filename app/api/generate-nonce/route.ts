import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST() {
  const id = randomBytes(16).toString("hex");
  
  return NextResponse.json({ id });
}
