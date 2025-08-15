"use client";

import React from "react";
import Link from "next/link";

/**
 * Policy Page: Refund Policy
 * Uses the same locked brand styles/header/footer as the landing page.
 */

type Brand = {
  primary: string;
  accent: string;
  border: string;
  bg: string;
  text: string;
};

const BRAND: Readonly<Brand> = Object.freeze({
  primary: "#030027",
  accent: "#C16E70",
  border: "#E6E9F1",
  bg: "#F7F8FA",
  text: "#0E1324",
});

function Wordmark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 select-none" aria-label="NEVILINQ home">
      <span className="inline-flex items-center gap-1 -translate-y-0.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND.accent }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND.primary }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND.accent }} />
      </span>
      <span className="text-lg font-extrabold tracking-tight" style={{ color: BRAND.primary }}>
        NEVILINQ
      </span>
    </Link>
  );
}

export default function Page() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      {/* Header — fixed while scrolling */}
      <header
        className="fixed top-0 left-0 right-0 z-40 border-b bg-white/80 backdrop-blur"
        style={{ borderColor: BRAND.border }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Wordmark />
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 hover:opacity-95 active:opacity-90"
              style={{ backgroundColor: BRAND.accent }}
            >
              List here boss
            </Link>
          </div>
        </div>
      </header>

      {/* Add top padding so content isn't hidden behind fixed header */}
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: BRAND.primary }}>
            Refund Policy
          </h1>
          <p className="mt-1 text-sm text-gray-600">Effective date: 13 Aug 2025</p>

          <section className="mt-6 space-y-6 text-sm leading-6 text-gray-800">
            <p>
              We sell digital platform services (listings, boosts, and platform fees). Because delivery begins immediately, most purchases are
              non-refundable, with the fair-use exceptions below.
            </p>

            <div>
              <h2 className="font-semibold text-[#0E1324]">When Refunds Are Provided</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Duplicate/accidental charge for the same order.</li>
                <li>Technical failure on our side where a paid listing/boost was not published or not delivered for the purchased period.</li>
                <li>Payment succeeded but the order was not created.</li>
              </ul>
              <p className="mt-2">
                For partial delivery of boosts, refunds may be issued <em>pro-rata</em> or we may re-run the service at your choice.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Non-refundable Cases</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Change of mind, wrong category/hashtags supplied by you, or edits after publication.</li>
                <li>Suspension/removal for policy or legal violations.</li>
                <li>Platform actions outside our control (e.g., WhatsApp/Telegram bans, outages, link invalidation).</li>
                <li>SEO or traffic fluctuations; no guarantees of clicks/members/reach.</li>
                <li>Expired plans or unused time after successful publication.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">How To Request a Refund</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Email <a className="underline" href="mailto:link@nevilinq.com">link@nevilinq.com</a> within 7 days of the transaction (or within 24 hours of discovering a delivery issue).
                </li>
                <li>Include order ID, payment reference, listing/boost link, and a brief description.</li>
                <li>We respond within 3–5 business days. If approved, refunds are processed to the original payment method within 5–10 business days (gateway/bank timelines apply).</li>
              </ul>
              <p className="mt-2 text-gray-700">Gateway/processing fees may be non-refundable if not returned to us by the provider.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Chargebacks</h2>
              <p>
                Please contact us first. Unfounded chargebacks may result in account suspension; we may contest chargebacks with evidence of delivery.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Contact</h2>
              <p>
                NEVILINQ Technologies — <a className="underline" href="mailto:link@nevilinq.com">link@nevilinq.com</a>
                <br />
                BTTLC ROAD, BUILDING NAME ATHITHI, P.R.PETA, JEYPORE, KORAPUT DIST-764003, ODISHA, India
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto w-full border-t" style={{ borderColor: BRAND.border }}>
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-gray-600">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span> • </span>
          <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
          <span> • </span>
          <Link href="/refund" className="hover:underline">Refund Policy</Link>
          <div className="mt-1">© {year} NEVILINQ Technologies</div>
        </div>
      </footer>
    </div>
  );
}
