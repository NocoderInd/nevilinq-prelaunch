// apps/www/app/api/business/route.ts
import { randomUUID } from "crypto";
import type { BusinessListing, BizIntent, Platform, BoostPlan } from "@/lib/types";

/** Module‑level singleton store (dev only). Replace with DB/FastAPI later. */
const g = globalThis as any;
if (!g.__NEVILINQ_BUSINESS_STORE__) g.__NEVILINQ_BUSINESS_STORE__ = [] as BusinessListing[];
const STORE: BusinessListing[] = g.__NEVILINQ_BUSINESS_STORE__;

/** JSON helper (avoids NextResponse 2‑arg typing issues) */
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Basic field checks */
function isPlatform(v: string): v is Platform {
  return v === "whatsapp" || v === "telegram";
}
function isIntent(v: string): v is BizIntent {
  return v === "sell" || v === "buy" || v === "both";
}
function isBoost(v: string): v is BoostPlan {
  return ["none", "daily", "weekly", "15days", "30days"].includes(v);
}
function validWhatsAppNumber(v: string) {
  return /^\+?\d{8,15}$/.test(v);
}
function validTelegramHandle(v: string) {
  return /^@?[A-Za-z0-9_]{4,32}$/.test(v);
}

/** GET /api/business?q=&platform=&intent=&verified=&boosted=&country=&city= */
export async function GET(req: Request) {
  const url = new URL(req.url);

  const q        = (url.searchParams.get("q") || "").toLowerCase();
  const platform = url.searchParams.get("platform");
  const intent   = url.searchParams.get("intent");
  const verified = url.searchParams.get("verified"); // "true" | "false"
  const boosted  = url.searchParams.get("boosted");  // any string means filter boosted != none
  const country  = (url.searchParams.get("country") || "").toUpperCase();
  const city     = (url.searchParams.get("city") || "").toLowerCase();

  let rows = [...STORE];

  if (q) {
    rows = rows.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      (r.category || "").toLowerCase().includes(q) ||
      (r.sub_categories || "").toLowerCase().includes(q) ||
      (r.pitch || "").toLowerCase().includes(q) ||
      (r.description || "").toLowerCase().includes(q) ||
      (r.city || "").toLowerCase().includes(q) ||
      (r.country || "").toLowerCase().includes(q)
    );
  }
  if (platform && isPlatform(platform)) rows = rows.filter((r) => r.platform === platform);
  if (intent && isIntent(intent))       rows = rows.filter((r) => r.intent === intent || r.intent === "both");
  if (verified === "true")              rows = rows.filter((r) => !!r.verified);
  if (boosted)                          rows = rows.filter((r) => r.boosted && r.boosted !== "none");
  if (country)                          rows = rows.filter((r) => (r.country || "").toUpperCase() === country);
  if (city)                             rows = rows.filter((r) => (r.city || "").toLowerCase() === city);

  // Sort: boosted first, then verified, then newest
  rows.sort((a, b) => {
    const boostRank = (x?: BoostPlan) =>
      x === "daily" ? 3 : x === "weekly" ? 2 : x && x !== "none" ? 1 : 0;
    const br = boostRank(b.boosted) - boostRank(a.boosted);
    if (br !== 0) return br;
    if (!!b.verified !== !!a.verified) return Number(!!b.verified) - Number(!!a.verified);
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return json({ ok: true, count: rows.length, rows });
}

/** POST /api/business  (create one listing)
 * Required: platform, name, number_or_handle, intent
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BusinessListing>;

    // Required checks
    if (!body?.platform || !isPlatform(body.platform)) {
      return json({ ok: false, error: "platform must be 'whatsapp' or 'telegram'." }, 400);
    }
    if (!body?.name || body.name.trim().length < 3) {
      return json({ ok: false, error: "name is required (min 3 chars)." }, 400);
    }
    if (!body?.number_or_handle) {
      return json({ ok: false, error: "number_or_handle is required." }, 400);
    }
    if (!body?.intent || !isIntent(body.intent)) {
      return json({ ok: false, error: "intent must be 'sell' | 'buy' | 'both'." }, 400);
    }

    // Platform‑specific validation
    if (body.platform === "whatsapp" && !validWhatsAppNumber(body.number_or_handle)) {
      return json({ ok: false, error: "Invalid WhatsApp number. Use +CCXXXXXXXXXX." }, 400);
    }
    if (body.platform === "telegram" && !validTelegramHandle(body.number_or_handle)) {
      return json({ ok: false, error: "Invalid Telegram handle. Use @handle (4–32 chars)." }, 400);
    }

    // Normalize values
    const now = new Date().toISOString();
    const row: BusinessListing = {
      id: randomUUID(),
      platform: body.platform,
      name: body.name.trim(),
      number_or_handle: body.number_or_handle.trim(),
      intent: body.intent,
      category: body.category?.trim(),
      sub_categories: body.sub_categories?.trim(),
      pitch: body.pitch?.trim(),
      description: body.description?.trim(),
      price_terms: body.price_terms?.trim(),
      city: body.city?.trim(),
      country: body.country?.trim().toUpperCase(),
      serves: body.serves?.trim(),
      website: body.website?.trim(),
      languages: body.languages?.trim(),
      working_hours: body.working_hours?.trim(),
      response_time: body.response_time || "same_day",
      preferred_contact: body.preferred_contact || body.platform, // default to chosen platform
      verified: !!body.verified,
      boosted: body.boosted && isBoost(body.boosted) ? body.boosted : "none",
      trade_assurance: !!body.trade_assurance,
      returns_terms: body.returns_terms?.trim(),
      escrow: !!body.escrow,
      created_at: now,
      updated_at: now,
    };

    // Insert at top
    STORE.unshift(row);

    return json({ ok: true, row }, 201);
  } catch (err: any) {
    return json({ ok: false, error: err?.message ?? "Invalid JSON" }, 400);
  }
}
