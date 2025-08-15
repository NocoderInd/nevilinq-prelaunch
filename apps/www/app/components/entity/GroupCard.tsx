"use client";

import Link from "next/link";
import { CheckCircle2, Rocket } from "lucide-react";

/** Matches your existing union */
export type GroupType =
  | "whatsapp_group"
  | "whatsapp_channel"
  | "telegram_group"
  | "telegram_channel"
  | "whatsapp_business";

/** NEW: optional `role` for Import/Export listings */
export interface GroupCardData {
  id: string;
  title: string;
  type: GroupType;
  href: string;

  city?: string;
  category?: string;
  members?: number;

  verified?: boolean;
  boosted?: boolean;

  hashtags?: string[];
  description?: string;

  /** Buyer/Seller tag (optional, used for Import & Export) */
  role?: "buyer" | "seller";
}

/* Locked palette */
const BRAND = {
  primary: "#030027",
  border: "#E6E9F1",
  surface: "#FFFFFF",
  text: "#0E1324",
};

function platformTagLabel(type: GroupType) {
  switch (type) {
    case "whatsapp_group":
      return "WhatsApp Group";
    case "whatsapp_channel":
      return "WhatsApp Channel";
    case "telegram_group":
      return "Telegram Group";
    case "telegram_channel":
      return "Telegram Channel";
    case "whatsapp_business":
      return "WhatsApp Business";
    default:
      return "Listing";
  }
}

export default function GroupCard({ data }: { data: GroupCardData }) {
  return (
    <div
      className="flex h-full flex-col rounded-2xl border p-4 shadow-sm"
      style={{ borderColor: BRAND.border, background: BRAND.surface }}
    >
      {/* Top: platform tag + city */}
      <div className="mb-2 flex items-center justify-between">
        <span
          className="max-w-[65%] truncate whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium"
          title={platformTagLabel(data.type)}
          style={{ background: "#FFF3CD", color: "#7A5E00" }}
        >
          {platformTagLabel(data.type)}
        </span>

        <span className="truncate text-xs text-gray-500" title={data.city}>
          {data.city}
        </span>
      </div>

      {/* Title */}
      <h3 className="line-clamp-1 text-sm font-semibold" style={{ color: BRAND.text }}>
        {data.title}
      </h3>

      {/* Meta row (category + members if present) */}
      {(data.category || data.members) && (
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
          {data.category && <span className="truncate">{data.category}</span>}
          {data.category && data.members ? <span aria-hidden>•</span> : null}
          {typeof data.members === "number" && (
            <span>{data.members.toLocaleString()} members</span>
          )}
        </div>
      )}

      {/* Short description */}
      {data.description && (
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">{data.description}</p>
      )}

      {/* Hashtags */}
      {data.hashtags && data.hashtags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {data.hashtags.map((h) => (
            <span
              key={h}
              className="max-w-full truncate rounded-md border px-2 py-0.5 text-xs"
              style={{ borderColor: BRAND.border, color: BRAND.primary, background: "#F7F8FA" }}
              title={`#${h}`}
            >
              #{h}
            </span>
          ))}
        </div>
      )}

      {/* Badges row: Verified / Boosted / NEW: Buyer|Seller */}
      <div className="mt-auto pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {data.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified
            </span>
          )}
          {data.boosted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              <Rocket className="h-3.5 w-3.5" /> Boosted
            </span>
          )}

          {/* ✅ Buyer/Seller tag placed BESIDE Verified/Boosted and ABOVE the View button */}
          {data.role && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
              {data.role === "buyer" ? "Buyer" : "Seller"}
            </span>
          )}
        </div>

        {/* View button pinned at bottom, unchanged size/style */}
        <Link
          href={data.href}
          className="block w-full rounded-xl px-4 py-2 text-center text-sm font-semibold text-white"
          style={{ background: BRAND.primary }}
        >
          View
        </Link>
      </div>
    </div>
  );
}

export type { GroupCardData as _GroupCardData };
