// apps/www/lib/geo.ts
import { headers } from "next/headers";

/**
 * Best‑effort country detection from CDN headers.
 * Falls back to 'IN' to keep pricing deterministic.
 */
export function detectCountryFromHeaders(): string {
  const h = headers();
  const vercel = h.get("x-vercel-ip-country");
  const cf = h.get("cf-ipcountry");
  const fly = h.get("fly-client-ip-country");

  const cand = (vercel || cf || fly || "IN").toUpperCase();
  // Sanity: keep to two chars if a bad header appears.
  return cand.length === 2 ? cand : "IN";
}
