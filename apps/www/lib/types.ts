// apps/www/lib/types.ts

/* ---------------------------------------------
 * NEVILINQ — Shared Types & Brand (LOCKED PALETTE)
 * --------------------------------------------- */

export const BRAND = {
  primary: "#030027", // Oxford Blue
  accent:  "#C16E70", // Old Rose
  surface: "#F2F3D9", // Beige
  text:    "#0E1324",
  bg:      "#F7F8FA",
  border:  "#E6E9F1",
} as const;

/* ---------------------------------------------
 * Marketplace / Listings
 * --------------------------------------------- */

export type EntityKind = "group" | "channel" | "business";
export type Platform   = "whatsapp" | "telegram";
export type BoostPlan  = "none" | "daily" | "weekly" | "15days" | "30days";

export interface ListingRow {
  // CORE — required
  entity_kind: EntityKind;        // group | channel | business
  platform: Platform;             // whatsapp | telegram
  name: string;                   // display name
  invite_or_number: string;       // group/channel invite URL OR business phone (+CCXXXXXXXXXX)

  // META — optional but recommended
  category?: string;              // e.g., #investing, #jobs, #dating
  city?: string;                  // e.g., Hyderabad
  country?: string;               // ISO-2 preferred (IN, US, ...)
  description?: string;           // short description
  verified?: "yes" | "no";        // is listing verified on platform
  boosted?: BoostPlan;            // boost tier

  // INTERNAL (client-only helpers)
  __row?: number;                 // row number from CSV (for error messages)
}

export interface ParseResult {
  rows: ListingRow[];
  errors: string[];
  warnings: string[];
}

export interface ValidateResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/* ---------------------------------------------
 * Support / Tickets
 * --------------------------------------------- */

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_on_user"
  | "resolved"
  | "closed";

export interface Ticket {
  id: string;
  createdAt: string;     // ISO
  updatedAt: string;     // ISO
  title: string;
  description: string;
  category?: string;     // e.g., Billing, Bug, Feature, Verification
  priority: TicketPriority;
  status: TicketStatus;

  // Optional requester metadata (integrate with auth later)
  requesterId?: string;
  requesterName?: string;
  requesterEmail?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  createdAt: string;     // ISO
  author: "admin" | "user";
  authorName?: string;
  message: string;
}

/* ---------------------------------------------
 * Business Listings (Imports & Exports marketplace)
 * --------------------------------------------- */

export type BizIntent = "sell" | "buy" | "both";

/**
 * Public-facing business listing for the international marketplace.
 * Sellers/Buyers list a WhatsApp number or Telegram handle so users can contact instantly.
 */
export interface BusinessListing {
  id: string;
  platform: Platform;            // "whatsapp" | "telegram"
  name: string;                  // Business or contact name
  number_or_handle: string;      // +CCXXXXXXXXXX (WA) or @handle / handle (TG)
  intent: BizIntent;             // sell | buy | both
  category?: string;             // e.g., #electronics
  sub_categories?: string;       // comma list (optional)
  pitch?: string;                // one‑liner (90–140 chars recommended)
  description?: string;          // long text
  price_terms?: string;          // e.g., "MOQ 50, NET 7"
  city?: string;
  country?: string;              // ISO‑2 (IN, US, AE, ...)
  serves?: string;               // regions served
  website?: string;              // optional URL
  languages?: string;            // comma list ("English,Hindi")
  working_hours?: string;        // e.g., "Mon–Sat 10:00–18:00"
  response_time?: "instant" | "1h" | "same_day" | "next_day";
  preferred_contact?: "whatsapp" | "telegram" | "call";
  verified?: boolean;            // NEVILINQ-verified
  boosted?: BoostPlan;           // "none" | "daily" | "weekly" | "15days" | "30days"
  trade_assurance?: boolean;
  returns_terms?: string;
  escrow?: boolean;

  created_at: string;            // ISO datetime
  updated_at: string;            // ISO datetime
}

/**
 * Build a direct contact link based on platform + value.
 * - WhatsApp: expects a phone with country code; we strip non-digits for wa.me/<digits>
 * - Telegram: prefer @handle → https://t.me/<handle>, else phone → tg://resolve?phone=<digits>
 */
export function buildContactLink(
  platform: Platform,
  value: string,
  presetMessage?: string
): string {
  const msg = presetMessage ? encodeURIComponent(presetMessage) : undefined;

  if (platform === "whatsapp") {
    const digits = value.replace(/[^\d]/g, ""); // keep digits only
    const base = `https://wa.me/${digits}`;
    return msg ? `${base}?text=${msg}` : base;
  }

  // Telegram
  const handle = value.trim().replace(/^@/, "");
  if (/^[A-Za-z0-9_]{4,32}$/.test(handle)) {
    return `https://t.me/${handle}`;
  }
  const digits = value.replace(/[^\d]/g, "");
  return `tg://resolve?phone=${digits}`;
}
