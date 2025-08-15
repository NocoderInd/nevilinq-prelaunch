"use client";

import Link from "next/link";
import { CheckCircle2, Rocket, ExternalLink, PhoneCall } from "lucide-react";

/** Brand (LOCKED) */
const BRAND = {
  primary: "#030027", // Oxford Blue
  accent: "#C16E70", // Old Rose (2nd dot)
  surface: "#F2F3D9", // Beige
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

/** Public type used by the page */
export type BoostPlan = "daily" | "weekly" | "15d" | "30d";
export type BusinessListing = {
  id: string;
  name: string;
  category: string;
  city?: string;
  description?: string;
  whatsapp?: string;  // number with/without +cc
  telegram?: string;  // @handle or handle or phone
  verified?: boolean;
  boosted?: BoostPlan | null;
};

/** Helpers */
function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function sanitizePhone(s?: string) {
  return (s ?? "").replace(/[^\d]/g, "");
}
function cleanHandle(s?: string) {
  return (s ?? "").trim().replace(/^@/, "");
}
function buildWhatsAppURL(num?: string) {
  if (!num) return "";
  const digits = sanitizePhone(num);
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}
function buildTelegramURL(h?: string) {
  if (!h) return "";
  const handle = cleanHandle(h);
  if (!handle) return "";
  return `https://t.me/${handle}`;
}

/** Prefer WhatsApp if available, else Telegram. If neither, returns '' */
function getPrimaryContact(listing: BusinessListing) {
  const wa = buildWhatsAppURL(listing.whatsapp);
  if (wa) return { label: "Contact", url: wa, kind: "whatsapp" as const };
  const tg = buildTelegramURL(listing.telegram);
  if (tg) return { label: "Contact", url: tg, kind: "telegram" as const };
  return { label: "Contact", url: "", kind: "none" as const };
}

export default function BusinessCard({ data }: { data: BusinessListing }) {
  const href = `/business/${slugify(data.name)}`;
  const contact = getPrimaryContact(data);

  return (
    <div
      className="flex h-full flex-col rounded-2xl border p-4 shadow-sm"
      style={{ borderColor: BRAND.border, backgroundColor: "#fff", color: BRAND.text }}
    >
      {/* Title + badges */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-base font-semibold">{data.name}</span>
            {data.verified ? (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                style={{ backgroundColor: BRAND.surface, color: BRAND.primary, border: `1px solid ${BRAND.border}` }}
              >
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            ) : null}
            {data.boosted ? (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                style={{ backgroundColor: "#FFF7E6", color: "#7A4A00", border: `1px solid ${BRAND.border}` }}
                title={`Boosted: ${data.boosted}`}
              >
                <Rocket className="h-3 w-3" />
                Boosted
              </span>
            ) : null}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs" style={{ color: "#394056" }}>
            <span className="inline-flex items-center rounded-full bg-[#F2F3D9] px-2 py-0.5">
              {data.category}
            </span>
            {data.city ? (
              <span className="inline-flex items-center rounded-full bg-[#F2F3D9] px-2 py-0.5">
                {data.city}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Description */}
      {data.description ? (
        <p className="mb-4 line-clamp-2 text-sm" style={{ color: "#4B5162" }}>
          {data.description}
        </p>
      ) : (
        <div className="mb-4" />
      )}

      {/* Actions */}
      <div className="mt-auto grid grid-cols-2 gap-2">
        {/* View (internal) — same height as Contact */}
        <Link
          href={href}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium hover:opacity-90 transition"
          style={{ borderColor: BRAND.border, backgroundColor: "#fff", color: BRAND.text }}
        >
          <ExternalLink className="h-4 w-4" />
          View
        </Link>

        {/* Contact (external) — accent color, same size as View */}
        {contact.url ? (
          <a
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: BRAND.accent, color: "#fff" }}
          >
            <PhoneCall className="h-4 w-4" />
            {contact.label}
          </a>
        ) : (
          <button
            disabled
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold opacity-60 cursor-not-allowed"
            style={{ backgroundColor: BRAND.accent, color: "#fff" }}
            title="No WhatsApp/Telegram provided"
          >
            <PhoneCall className="h-4 w-4" />
            Contact
          </button>
        )}
      </div>
    </div>
  );
}
