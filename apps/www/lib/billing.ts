// apps/www/lib/billing.ts
import { getCurrencyForCountry, inrToLocal, formatMoney } from "@/lib/currency";

export type BundleTier = "BUNDLE_3" | "BUNDLE_5" | "BUNDLE_12";

export const BUNDLE_META: Record<BundleTier, { label: string; groups: number }> = {
  BUNDLE_3: { label: "3 Groups/Channels", groups: 3 },
  BUNDLE_5: { label: "5 Groups/Channels", groups: 5 },
  BUNDLE_12: { label: "12 Groups/Channels", groups: 12 },
};

export type PaymentProvider = "razorpay" | "stripe";

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  default: boolean;
  provider: PaymentProvider;
};

export type Invoice = {
  id: string;
  number: string;
  amount_inr: number; // Store truth in INR (after PPP). UI converts.
  created_at: string; // ISO
  status: "paid" | "open" | "void";
  pdf_url?: string;
  provider: PaymentProvider;
};

export type Subscription = {
  tier: BundleTier;
  renews_on: string; // ISO date
  status: "active" | "past_due" | "canceled";
};

/* Brand (LOCKED) */
export const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

/** Format an INR amount to the viewer's local currency using your currency.ts helpers. */
export function formatConvertedAmount(inrAmount: number, countryCode?: string) {
  const currency = getCurrencyForCountry((countryCode ?? "US").toUpperCase());
  const local = inrToLocal(inrAmount, currency);
  return formatMoney(local, currency);
}
