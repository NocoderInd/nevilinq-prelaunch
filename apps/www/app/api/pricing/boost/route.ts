// apps/www/app/api/pricing/boost/route.ts
import { NextRequest, NextResponse } from "next/server";
import { detectCountryFromHeaders } from "@/lib/geo";
import { getBoostPricing } from "@/lib/boostPricing";

/**
 * GET /api/pricing/boost
 * Optional: ?country=US (ISO‑3166 alpha‑2)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fromQuery = searchParams.get("country");
  const cc = fromQuery || detectCountryFromHeaders();
  const data = getBoostPricing(cc);
  return NextResponse.json(data, { status: 200 });
}
