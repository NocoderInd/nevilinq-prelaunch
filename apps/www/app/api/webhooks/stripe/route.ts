// apps/www/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // TODO: verify Stripe signature with webhook secret
  return NextResponse.json({ ok: true });
}
