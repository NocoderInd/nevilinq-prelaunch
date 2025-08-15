// apps/www/lib/currency.ts
/**
 * Currency helpers + FX table (INR → local).
 * We convert AFTER PPP is applied on INR (as per Mike's rule).
 *
 * Keep rates moderately fresh. Override any entry quickly.
 * If a country is unmapped, we default to USD.
 */

type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "SGD" | "AED" | "SAR" | "JPY" | "KRW" | "BRL" | "MXN" | "ZAR" | "NGN" | "THB" | "MYR" | "IDR" | "PHP" | "VND" | "TRY";

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: "INR",
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  AU: "AUD",
  SG: "SGD",
  AE: "AED",
  SA: "SAR",
  JP: "JPY",
  KR: "KRW",
  BR: "BRL",
  MX: "MXN",
  ZA: "ZAR",
  NG: "NGN",
  TH: "THB",
  MY: "MYR",
  ID: "IDR",
  PH: "PHP",
  VN: "VND",
  TR: "TRY",
  // Fallbacks
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", IE: "EUR", AT: "EUR", PT: "EUR", FI: "EUR", GR: "EUR",
};

// If country code is not mapped, we fall back to USD.
export function getCurrencyForCountry(countryCode: string): CurrencyCode {
  const cc = (countryCode || "IN").toUpperCase();
  return COUNTRY_TO_CURRENCY[cc] ?? (cc === "EU" ? "EUR" : "USD");
}

/* ----------------------------
 * EDIT HERE — INR→LOCAL FX RATES
 * fx: how many local currency units = 1 INR
 * Example: if 1 USD ≈ 85 INR, then 1 INR ≈ 0.01176 USD → fx["USD"] = 0.01176
 * ---------------------------- */
const FX_INR_TO_LOCAL: Record<CurrencyCode, number> = {
  INR: 1,
  // Use rounded, defensible figures; adjust anytime.
  USD: 1 / 87.4,  // ≈ 0.01144 — aligns with your 7200 INR → ~$82.33 example
  EUR: 1 / 93.0,
  GBP: 1 / 110.0,
  CAD: 1 / 64.0,
  AUD: 1 / 58.0,
  SGD: 1 / 64.0,
  AED: 1 / 23.8,
  SAR: 1 / 23.3,
  JPY: 1 / 0.57,   // 1 INR ≈ 1.75 JPY → inverse ~0.57
  KRW: 1 / 0.064,  // 1 INR ≈ 15.6 KRW
  BRL: 1 / 17.0,
  MXN: 1 / 5.2,
  ZAR: 1 / 4.8,
  NGN: 1 / 110.0,  // NGN highly volatile — keep configurable
  THB: 1 / 2.4,
  MYR: 1 / 18.8,
  IDR: 1 / 0.0052, // 1 INR ≈ 192 IDR
  PHP: 1 / 1.54,
  VND: 1 / 0.0036, // 1 INR ≈ 277 VND
  TRY: 1 / 2.7,
};

/** Convert an amount in INR to target currency using the static FX table above. */
export function inrToLocal(amountINR: number, currency: CurrencyCode): number {
  const rate = FX_INR_TO_LOCAL[currency] ?? FX_INR_TO_LOCAL["USD"];
  // Round to sensible minor units by currency:
  const decimals =
    currency === "JPY" ? 0 :
    currency === "KRW" ? 0 :
    currency === "VND" ? 0 :
    2;
  return parseFloat((amountINR * rate).toFixed(decimals));
}

/** Displays money with Intl; falls back gracefully if currency is unknown. */
export function formatMoney(amount: number, currency: CurrencyCode | string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}
