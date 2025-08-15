// apps/www/app/api/business/[id]/route.ts
import type { BusinessListing, Platform, BizIntent, BoostPlan } from "@/lib/types";

/** Use same global store reference as /api/business (dev only) */
const g = globalThis as any;
if (!g.__NEVILINQ_BUSINESS_STORE__) g.__NEVILINQ_BUSINESS_STORE__ = [] as BusinessListing[];
const STORE: BusinessListing[] = g.__NEVILINQ_BUSINESS_STORE__;

/** JSON helper */
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isPlatform(v: string): v is Platform {
  return v === "whatsapp" || v === "telegram";
}
function isIntent(v: string): v is BizIntent {
  return v === "sell" || v === "buy" || v === "both";
}
function isBoost(v: string): v is BoostPlan {
  return ["none", "daily", "weekly", "15days", "30days"].includes(v);
}

/** PATCH /api/business/[id] — update one listing */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const idx = STORE.findIndex((r) => r.id === params.id);
    if (idx === -1) return json({ ok: false, error: "Not found" }, 404);

    const body = (await req.json()) as Partial<BusinessListing>;
    const prev = STORE[idx];

    // Minimal validation on updates
    if (body.platform && !isPlatform(body.platform)) {
      return json({ ok: false, error: "Invalid platform" }, 400);
    }
    if (body.intent && !isIntent(body.intent)) {
      return json({ ok: false, error: "Invalid intent" }, 400);
    }
    if (body.boosted && !isBoost(body.boosted)) {
      return json({ ok: false, error: "Invalid boost plan" }, 400);
    }

    const updated: BusinessListing = {
      ...prev,
      ...body,
      updated_at: new Date().toISOString(),
    };
    STORE[idx] = updated;

    return json({ ok: true, row: updated });
  } catch (err: any) {
    return json({ ok: false, error: err?.message ?? "Invalid JSON" }, 400);
  }
}

/** DELETE /api/business/[id] — remove one listing */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const idx = STORE.findIndex((r) => r.id === params.id);
  if (idx === -1) return json({ ok: false, error: "Not found" }, 404);

  const [removed] = STORE.splice(idx, 1);
  return json({ ok: true, row: removed });
}
