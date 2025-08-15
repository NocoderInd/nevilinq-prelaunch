// apps/www/app/pricing/page.tsx
import { headers } from "next/headers";
import PricingClient from "./PricingClient"; // no extension

export const revalidate = 0;

function detectCountryFromHeaders(): string {
  const h = headers();
  const vercel = h.get("x-vercel-ip-country");
  const cf = h.get("cf-ipcountry");
  const akamai = h.get("x-akamai-edgescape");
  let akamaiCountry: string | null = null;

  if (akamai && akamai.includes("country_code=")) {
    const m = /country_code=([A-Z]{2})/.exec(akamai);
    akamaiCountry = m ? m[1] : null;
  }
  return (vercel || cf || akamaiCountry || "IN").toUpperCase();
}

export default function PricingPage() {
  const initialCountry = detectCountryFromHeaders();
  return <PricingClient initialCountry={initialCountry} />;
}
