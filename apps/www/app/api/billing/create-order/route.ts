// apps/www/app/api/billing/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Creates a provider checkout intent.
 * Body: { tier: "BUNDLE_3"|"BUNDLE_5"|"BUNDLE_12", provider?: "razorpay"|"stripe", country: "IN"|"US"|... }
 * Returns: { ok, checkout_url } (mock for now)
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const tier = body?.tier;
  const provider = (body?.provider ?? "razorpay") as "razorpay" | "stripe";

  if (!tier || !["BUNDLE_3", "BUNDLE_5", "BUNDLE_12"].includes(tier)) {
    return NextResponse.json({ ok: false, error: "Invalid tier" }, { status: 400 });
  }

  // TODO: call your FastAPI to create order; this is a mock URL
  const checkout_url = `/dashboard/billing?createdOrder=${encodeURIComponent(tier)}&provider=${provider}`;
  return NextResponse.json({ ok: true, checkout_url });
}
