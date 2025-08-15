// apps/www/app/api/entity/[slug]/reports/route.ts
import { NextRequest, NextResponse } from "next/server";

type Report = {
  id: string;
  slug: string;
  reason: string;
  details?: string;
  createdAt: string;
};

const G = globalThis as any;
if (!G.__NEVILINQ_REPORTS__) G.__NEVILINQ_REPORTS__ = new Map<string, Report[]>();
const REPORTS: Map<string, Report[]> = G.__NEVILINQ_REPORTS__;

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const body = await req.json().catch(() => ({}));
  const reason = (body?.reason ?? "").toString().slice(0, 100);
  const details = (body?.details ?? "").toString().slice(0, 2000);

  if (!reason) {
    return NextResponse.json({ ok: false, error: "Reason is required." }, { status: 400 });
  }

  const entry: Report = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    slug,
    reason,
    details: details?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const list = REPORTS.get(slug) ?? [];
  list.push(entry);
  REPORTS.set(slug, list);

  return NextResponse.json({ ok: true, data: entry }, { status: 201 });
}
