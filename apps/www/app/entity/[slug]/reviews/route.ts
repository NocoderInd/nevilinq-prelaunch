// apps/www/app/api/entity/[slug]/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";

type Review = {
  id: string;
  slug: string;
  rating: number; // 1..5
  text?: string;
  createdAt: string; // ISO
};

const G = globalThis as any;
if (!G.__NEVILINQ_REVIEWS__) G.__NEVILINQ_REVIEWS__ = new Map<string, Review[]>();
const REVIEWS: Map<string, Review[]> = G.__NEVILINQ_REVIEWS__;

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const list = REVIEWS.get(slug) ?? [];
  // newest first
  const sorted = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ ok: true, data: sorted });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const body = await req.json().catch(() => ({}));
  const rating = Number(body?.rating);
  const text = (body?.text ?? "").toString().slice(0, 2000);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const entry: Review = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    slug,
    rating: Math.round(rating),
    text: text?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const list = REVIEWS.get(slug) ?? [];
  list.push(entry);
  REVIEWS.set(slug, list);

  return NextResponse.json({ ok: true, data: entry }, { status: 201 });
}
