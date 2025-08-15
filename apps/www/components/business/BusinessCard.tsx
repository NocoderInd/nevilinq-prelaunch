// apps/www/components/business/BusinessCard.tsx
"use client";

import { Phone, MessageSquare, BadgeCheck } from "lucide-react";

export type BusinessListing = {
  id: string;
  name: string;
  category: string;
  city?: string;
  description?: string;
  whatsapp?: string;      // E.164 or local; we'll sanitize in UI
  telegram?: string;      // @handle or phone
  verified?: boolean;     // future: toggle after KYC
  boosted?: "daily" | "weekly" | "15days" | "30days" | null;
};

const BRAND = {
  primary: "#030027", // Oxford Blue
  accent: "#C16E70", // Old Rose
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

function normPhone(raw?: string) {
  if (!raw) return undefined;
  const only = raw.replace(/[^\d+]/g, "");
  // If no country code, assume India (+91). You can switch to geo-IP later.
  if (only.startsWith("+")) return only;
  if (only.length === 10) return `+91${only}`;
  return only;
}

function waLink(whatsapp?: string) {
  const n = normPhone(whatsapp);
  return n ? `https://wa.me/${encodeURIComponent(n.replace("+", ""))}` : undefined;
}

function tgLink(telegram?: string) {
  if (!telegram) return undefined;
  const trimmed = telegram.trim();
  if (trimmed.startsWith("@")) return `https://t.me/${trimmed.slice(1)}`;
  // If it looks like a phone, t.me/+<phone> works in many clients
  if (/^[\d+][\d\- ]+$/.test(trimmed)) {
    const p = trimmed.replace(/[^\d+]/g, "");
    return `https://t.me/+${p.replace("+", "")}`;
  }
  return `https://t.me/${trimmed}`;
}

export default function BusinessCard({ data }: { data: BusinessListing }) {
  const wUrl = waLink(data.whatsapp);
  const tUrl = tgLink(data.telegram);

  return (
    <div
      className="rounded-2xl p-4 shadow-sm border flex flex-col"
      style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
    >
      {/* Top row: name + verified + boosted */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold" style={{ color: BRAND.text }}>
              {data.name}
            </h3>
            {data.verified && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#EEF5FF", color: BRAND.primary, border: `1px solid ${BRAND.border}` }}>
                <BadgeCheck className="w-3 h-3" />
                Verified
              </span>
            )}
            {data.boosted && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: BRAND.surface, color: BRAND.text, border: `1px dashed ${BRAND.border}` }}>
                Boosted • {data.boosted}
              </span>
            )}
          </div>
          <p className="text-sm mt-0.5" style={{ color: "#556070" }}>
            {data.category}{data.city ? ` • ${data.city}` : ""}
          </p>
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-sm mt-3 leading-6" style={{ color: "#2C3240" }}>
          {data.description.length > 180 ? data.description.slice(0, 177) + "..." : data.description}
        </p>
      )}

      {/* Buttons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a
          href={wUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center h-10 rounded-xl font-medium border
          ${wUrl ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
          style={{
            backgroundColor: BRAND.primary,   // 👈 matches “second dot” color
            color: "#fff",
            borderColor: BRAND.primary,
          }}
          onClick={(e) => { if (!wUrl) e.preventDefault(); }}
        >
          <Phone className="w-4 h-4 mr-2" />
          Contact on WhatsApp
        </a>

        <a
          href={tUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center h-10 rounded-xl font-medium border
          ${tUrl ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
          style={{
            backgroundColor: BRAND.primary,   // 👈 same size & color as WhatsApp button
            color: "#fff",
            borderColor: BRAND.primary,
          }}
          onClick={(e) => { if (!tUrl) e.preventDefault(); }}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact on Telegram
        </a>
      </div>
    </div>
  );
}
