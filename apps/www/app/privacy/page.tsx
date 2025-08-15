"use client";

import React from "react";
import Link from "next/link";

/**
 * Policy Page: Privacy Policy
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b bg-white/80 backdrop-blur" style={{ borderColor: BRAND.border }}>
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

      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: BRAND.primary }}>
            Privacy Policy
          </h1>
          <p className="mt-1 text-sm text-gray-600">Effective date: 13 Aug 2025</p>

          <section className="mt-6 space-y-6 text-sm leading-6 text-gray-800">
            <p>
              NEVILINQ Technologies ("NEVILINQ", "we", "us") operates a marketplace to discover and list WhatsApp & Telegram
              groups/channels and WhatsApp Business numbers.
            </p>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Company & Contact</h2>
              <p>
                NEVILINQ Technologies, BTTLC ROAD, BUILDING NAME ATHITHI, P.R.PETA, JEYPORE, KORAPUT DIST-764003, ODISHA, India.
                Email: <a className="underline" href="mailto:link@nevilinq.com">link@nevilinq.com</a>
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Data We Collect</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Account & profile (name, email, phone if shared), saved searches.</li>
                <li>Listings data you publish (titles, descriptions, categories, locations, business numbers, hashtags, images).</li>
                <li>Transactions (plans/boosts purchased, payment status, gateway metadata).</li>
                <li>Usage & device (IP, device/browser, approximate location, cookies/SDK data, logs).</li>
                <li>Support & communications you send us.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">How We Use Data</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Provide and improve the Service: search, hashtag discovery, listing & boost management, analytics.</li>
                <li>Payments and fraud prevention with our processors.</li>
                <li>Safety & moderation; legal compliance and enforcement of Terms.</li>
                <li>Marketing with opt‑out controls.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Cookies</h2>
              <p>Used for authentication, preferences, analytics and fraud prevention. You can control cookies in your browser.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Sharing</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Vendors/processors (hosting, analytics, payments, support, moderation).</li>
                <li>Public listings are visible to others and may be indexed by search engines.</li>
                <li>Legal/safety requests and business transfers with safeguards.</li>
              </ul>
              <p className="mt-2">We do <strong>not</strong> sell personal data.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">International Transfers</h2>
              <p>We use appropriate safeguards when data moves outside India.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Retention</h2>
              <p>We keep data as needed for the purposes above, legal obligations, and security/audit. Some data may be anonymized.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Your Rights</h2>
              <p>
                Subject to law (including India’s Digital Personal Data Protection Act, 2023), you may request access, correction, deletion,
                or opt‑out of marketing. Contact: <a className="underline" href="mailto:link@nevilinq.com">link@nevilinq.com</a>.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Security</h2>
              <p>We use reasonable technical and organizational measures; no system is 100% secure.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Children</h2>
              <p>The Service is for users 18+. We do not knowingly collect data from children.</p>
            </div>

            <div>
              <h2 className="font-semibold text-[#0E1324]">Changes</h2>
              <p>We may update this Policy. Material changes will be posted with a new effective date.</p>
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
