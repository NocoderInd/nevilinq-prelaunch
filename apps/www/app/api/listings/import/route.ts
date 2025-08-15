// apps/www/app/api/listings/import/route.ts
import { NextResponse } from "next/server";
import type { ListingRow } from "@/lib/types";
import { validateRow } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as unknown;

    if (!Array.isArray(payload)) {
      return NextResponse.json(
        { ok: false, error: "Expected an array of ListingRow" },
        { status: 400 }
      );
    }

    const valid: ListingRow[] = [];
    const invalid: { index: number; errors: string[] }[] = [];
    const warnings: { index: number; warnings: string[] }[] = [];

    payload.forEach((row: any, idx: number) => {
      const r = row as ListingRow;
      const v = validateRow(r);
      if (!v.valid) {
        invalid.push({ index: idx, errors: v.errors });
      } else {
        valid.push(r);
        if (v.warnings.length) warnings.push({ index: idx, warnings: v.warnings });
      }
    });

    // TODO: Persist `valid` to your DB
    // Example: await prisma.listing.createMany({ data: valid })

    return NextResponse.json({
      ok: true,
      received: payload.length,
      accepted: valid.length,
      rejected: invalid.length,
      invalid,
      warnings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
