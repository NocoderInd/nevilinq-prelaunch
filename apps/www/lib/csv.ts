// apps/www/lib/csv.ts
import type { ListingRow, ParseResult, EntityKind, Platform, BoostPlan } from "./types";

/**
 * Normalize CSV header labels: lower-case, underscores, trim spaces & hyphens.
 */
function normHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, "_").replace(/-+/g, "_");
}

/**
 * Safe get from arbitrary record with flexible headers.
 */
function pick(rec: Record<string, string>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string" && v.trim().length) return v.trim();
  }
  return undefined;
}

/**
 * Parse CSV text → ListingRow[] with typed result + errors.
 * - Accepts headers in any order (case/space insensitive)
 * - Ignores empty lines
 */
export function parseCSV(text: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Very small, dependency-free CSV parsing (handles commas in quotes)
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { rows: [], errors: ["CSV is empty"], warnings };
  }

  const headerRaw = lines[0];
  const headers = smartSplit(headerRaw).map(normHeader);

  const mapHeaderIndex: Record<string, number> = {};
  headers.forEach((h, i) => (mapHeaderIndex[h] = i));

  const required = ["entity_kind", "platform", "name", "invite_or_number"];
  const missing = required.filter((h) => mapHeaderIndex[h] === undefined);
  if (missing.length) {
    errors.push(`Missing required columns: ${missing.join(", ")}`);
    return { rows: [], errors, warnings };
  }

  const rows: ListingRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;
    const cols = smartSplit(raw);

    const rec: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rec[h] = (cols[idx] ?? "").trim();
    });

    // Flexible header aliases
    const row: ListingRow = {
      entity_kind: (pick(rec, ["entity_kind"]) as EntityKind) ?? "group",
      platform: (pick(rec, ["platform"]) as Platform) ?? "whatsapp",
      name: pick(rec, ["name", "title"]) ?? "",
      invite_or_number:
        pick(rec, ["invite_or_number", "invite", "link", "phone", "number"]) ?? "",
      category: pick(rec, ["category", "hashtag"]),
      city: pick(rec, ["city", "location_city"]),
      country: pick(rec, ["country", "iso2"]),
      description: pick(rec, ["description", "about", "desc"]),
      verified: (pick(rec, ["verified"]) as "yes" | "no" | undefined) ?? "no",
      boosted: (pick(rec, ["boosted"]) as BoostPlan) ?? "none",
      __row: i + 1,
    };

    rows.push(row);
  }

  return { rows, errors, warnings };
}

/**
 * Convert ListingRow[] to CSV string with canonical headers.
 */
export function toCSV(rows: ListingRow[]): string {
  const headers = [
    "entity_kind",
    "platform",
    "name",
    "invite_or_number",
    "category",
    "city",
    "country",
    "description",
    "verified",
    "boosted",
  ];
  const out = [headers.join(",")];

  for (const r of rows) {
    const vals = [
      r.entity_kind ?? "",
      r.platform ?? "",
      safeCSV(r.name),
      safeCSV(r.invite_or_number),
      safeCSV(r.category ?? ""),
      safeCSV(r.city ?? ""),
      safeCSV(r.country ?? ""),
      safeCSV(r.description ?? ""),
      r.verified ?? "",
      r.boosted ?? "",
    ];
    out.push(vals.join(","));
  }
  return out.join("\n");
}

/**
 * Provide a ready-to-download CSV template with a few example rows.
 */
export function csvTemplate(): string {
  const sample: ListingRow[] = [
    {
      entity_kind: "group",
      platform: "whatsapp",
      name: "Hyderabad Jobs — Freshers",
      invite_or_number: "https://chat.whatsapp.com/XXXXXXXXXXXXXXX",
      category: "#jobs",
      city: "Hyderabad",
      country: "IN",
      description: "Daily job updates for freshers",
      verified: "no",
      boosted: "none",
    },
    {
      entity_kind: "channel",
      platform: "telegram",
      name: "Crypto Signals HQ",
      invite_or_number: "https://t.me/yourchannelhandle",
      category: "#investing",
      city: "Remote",
      country: "US",
      description: "High-quality signal discussions",
      verified: "yes",
      boosted: "weekly",
    },
    {
      entity_kind: "business",
      platform: "whatsapp",
      name: "Quick Loans — Customer Desk",
      invite_or_number: "+919999888877",
      category: "#finance",
      city: "Mumbai",
      country: "IN",
      description: "Talk to our agent on WhatsApp",
      verified: "no",
      boosted: "daily",
    },
  ];

  return toCSV(sample);
}

/* ----------------- helpers ------------------ */

function safeCSV(s: string): string {
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Parse a CSV line into columns supporting quoted fields.
 */
function smartSplit(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // escaped quote
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}
