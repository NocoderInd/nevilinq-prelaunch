// apps/www/app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // TODO: verify signature, persist events to DB
  // const body = await req.text(); const sig = req.headers.get("x-razorpay-signature");
  return NextResponse.json({ ok: true });
}
