// apps/www/lib/boostPricing.ts
/**
 * NEVILINQ — Boost Pricing Engine
 * Rule (LOCKED): price_per_country = (PPP_MULTIPLIER[country] * BASE_INR) then convert to local currency
 * Durations: daily, weekly, 15days, 30days
 *
 * Tweak ONLY the "EDIT HERE" blocks for business inputs.
 */

import { getCurrencyForCountry, inrToLocal, formatMoney } from "./currency";

export type BoostDuration = "daily" | "weekly" | "15days" | "30days";

type BoostPlan = {
  id: BoostDuration;
  label: string;
  baseInr: number; // India base price in INR (before PPP multiplier)
};

type BoostPrice = {
  id: BoostDuration;
  label: string;
  priceINR: number;
  localCurrency: string;
  priceLocal: number;
  displayLocal: string;
  displayINR: string;
};

export type BoostPricingResponse = {
  countryCode: string;
  currency: string;
  plans: BoostPrice[];
  notes: string[];
};

/* ----------------------------
 * EDIT HERE — INDIA BASE PRICES (INR)
 * ---------------------------- */
const INDIA_BASE_BOOST: BoostPlan[] = [
  { id: "daily",  label: "Daily Boost (24h)",   baseInr: 199 },
  { id: "weekly", label: "Weekly Boost (7d)",   baseInr: 999 },
  { id: "15days", label: "15‑Day Boost",        baseInr: 1799 },
  { id: "30days", label: "30‑Day Boost",        baseInr: 2999 },
];

/* ----------------------------
 * EDIT HERE — PPP MULTIPLIERS
 * Relative to India (IN = 1.0).
 * Keep values > 0. Example: US=2.0 means ~2× India purchasing power.
 * ---------------------------- */
export const PPP_MULTIPLIER: Record<string, number> = {
  IN: 1.0,
  US: 2.0,
  CA: 1.8,
  GB: 1.8,
  EU: 1.7, // generic for eurozone fallback when country not mapped
  AU: 1.9,
  SG: 2.2,
  AE: 1.6,
  SA: 1.4,
  JP: 1.6,
  KR: 1.5,
  // Emerging / lower PPP vs India (examples)
  BD: 0.5,
  PK: 0.6,
  NP: 0.55,
  LK: 0.8,
  VN: 0.7,
  PH: 0.8,
  ID: 0.8,
  TH: 1.1,
  MY: 1.0,
  NG: 0.7,
  ZA: 0.9,
  BR: 0.9,
  MX: 0.9,
  TR: 0.9,
};

/** Safely get PPP multiplier; default 1.0 (India baseline). */
export function getPPP(countryCode: string): number {
  const cc = (countryCode || "IN").toUpperCase();
  return PPP_MULTIPLIER[cc] ?? 1.0;
}

/** Core: compute priced plans for a given 2‑letter country code (ISO‑3166 alpha‑2). */
export function getBoostPricing(countryCode: string): BoostPricingResponse {
  const cc = (countryCode || "IN").toUpperCase();
  const ppp = getPPP(cc);
  const currency = getCurrencyForCountry(cc);

  const plans: BoostPrice[] = INDIA_BASE_BOOST.map((plan) => {
    const pInr = Math.round(ppp * plan.baseInr); // PPP applied on INR
    const priceLocal = inrToLocal(pInr, currency);
    return {
      id: plan.id,
      label: plan.label,
      priceINR: pInr,
      localCurrency: currency,
      priceLocal,
      displayLocal: formatMoney(priceLocal, currency),
      displayINR: formatMoney(pInr, "INR"),
    };
  });

  const notes = [
    "Rule: PPP × India base price → convert to local currency.",
    "India base prices are fixed; adjust multipliers & FX to tune local affordability.",
  ];

  return { countryCode: cc, currency, plans, notes };
}
