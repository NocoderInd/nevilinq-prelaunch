"use client";

import React from "react";
import Link from "next/link";

/**
 * Policy Page: Terms & Conditions
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

      {/* Offset content so it doesn't hide behind the fixed header */}
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: BRAND.primary }}>
            Terms & Conditions
          </h1>
          <p className="mt-1 text-sm text-gray-600">Effective date: 13 Aug 2025</p>

          <section className="mt-6 space-y-6 text-sm leading-6 text-gray-800">
            <p>
              NEVILINQ Technologies provides a marketplace to discover and list WhatsApp/Telegram groups & channels and WhatsApp Business numbers,
              plus optional boost placements. We are not affiliated with WhatsApp LLC/Meta Platforms or Telegram FZ-LLC.
            </p>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Eligibility & Accounts</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>You must be 18+ and legally able to contract.</li>
                <li>Provide accurate information and keep credentials secure.</li>
                <li>If you list a group/channel/number, you warrant you’re authorized to publicize it.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Plans, Fees & Payments (INR)</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>3 groups – ₹3,600; 5 groups – ₹5,400; 12 groups – ₹10,800.</li>
                <li>WhatsApp/Telegram business number listing: ₹2,499/year.</li>
                <li>Boosts: daily/weekly/15 days/30 days options.</li>
                <li>Fees are for platform services (visibility, discovery, SEO exposure, boost placement). Taxes/gateway fees may apply.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Listings & Boosts</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>You grant NEVILINQ a non-exclusive, royalty-free, worldwide license to host, index, cache, display, adapt and promote listing content.</li>
                <li>We may format/categorize/adjust placement (including SEO) at our discretion.</li>
                <li>No guarantee of impressions, clicks, members, sales or ranking.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Acceptable Use & Content</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>No illegal activity, scams, spam, impersonation, malware, or scraping.</li>
                <li>No pornography or explicit content; no child endangerment; no hate/extremist content.</li>
                <li>No personal data without consent; no doxxing/threats/incitement; no infringement.</li>
                <li>We may remove content or suspend accounts to protect users or comply with law.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Third-party Platforms</h2>
              <p>WhatsApp/Telegram usage is governed by their own terms and privacy rules. We don’t control their availability or policies.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Takedowns & Disputes</h2>
              <p>
                Report issues to <a className="underline" href="mailto:link@nevilinq.com">link@nevilinq.com</a> with proof of ownership/authorization where relevant. We act in good faith while balancing user rights and law.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">IP, Warranty & Liability</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Except for user content, all Service materials are NEVILINQ IP or licensed.</li>
                <li>The Service is provided "as is"; we disclaim implied warranties to the fullest extent permitted by law.</li>
                <li>NEVILINQ is not liable for indirect/special/consequential damages; total liability is capped at fees paid in the prior 3 months.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Indemnity</h2>
              <p>You agree to indemnify NEVILINQ for claims arising from your listings, conduct, or breach of these Terms.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Termination</h2>
              <p>We may suspend/terminate for policy breaches, risk, or legal requirement. You may delete your account; some data may be retained as required by law.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Governing Law & Venue</h2>
              <p>Indian law applies. Courts in Odisha (Koraput/Jeypore jurisdiction) have exclusive jurisdiction.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Contact</h2>
              <p>
                NEVILINQ Technologies, BTTLC ROAD, BUILDING NAME ATHITHI, P.R.PETA, JEYPORE, KORAPUT DIST-764003, ODISHA, India —
                <a className="underline" href="mailto:link@nevilinq.com">link@nevilinq.com</a>
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
