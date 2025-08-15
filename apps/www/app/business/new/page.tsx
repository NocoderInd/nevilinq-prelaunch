// apps/www/app/business/new/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { BRAND, type Platform, type BizIntent } from "@/lib/types";

const CATEGORIES = [
  "Services",
  "Coaching / Courses",
  "Local Business",
  "E‑commerce",
  "Freelancer",
  "Agency",
  "Dating",
  "Other",
] as const;

/* ---------------- Validators ----------------- */
function sanitizePhone(s?: string) {
  return (s ?? "").replace(/[^\d+]/g, "");
}
function sanitizeHandle(s?: string) {
  return (s ?? "").trim().replace(/\s+/g, "");
}
function isWhatsAppNumber(s?: string) {
  if (!s) return false;
  const only = s.replace(/[^\d+]/g, "");
  return /^\+?\d{8,15}$/.test(only);
}
function isTelegramHandleOrPhone(s?: string) {
  if (!s) return false;
  const t = s.trim();
  return /^@?[A-Za-z0-9_]{4,32}$/.test(t) || isWhatsAppNumber(t);
}

export default function NewBusinessListingPage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    pitch: "",
    description: "",
    city: "",
    country: "",
    platform: "whatsapp" as Platform,
    number_or_handle: "",
    intent: "sell" as BizIntent,
    acceptGovNorms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!form.acceptGovNorms) {
      setMsg("Please confirm you agree to provide verification if requested (gov norms).");
      return;
    }
    if (!form.name || form.name.trim().length < 3) {
      setMsg("Business name is required (min 3 chars).");
      return;
    }
    if (!form.category) {
      setMsg("Category is required.");
      return;
    }
    if (!form.number_or_handle) {
      setMsg("WhatsApp number or Telegram handle is required.");
      return;
    }

    const value =
      form.platform === "whatsapp"
        ? sanitizePhone(form.number_or_handle)
        : sanitizeHandle(form.number_or_handle);

    if (form.platform === "whatsapp" && !isWhatsAppNumber(value)) {
      setMsg("Invalid WhatsApp number. Use +CCXXXXXXXXXX (8–15 digits).");
      return;
    }
    if (form.platform === "telegram" && !isTelegramHandleOrPhone(value)) {
      setMsg("Invalid Telegram handle. Use @handle (4–32 chars) or a phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: form.platform,
          name: form.name.trim(),
          number_or_handle: value,
          intent: form.intent,
          category: form.category ? `#${form.category.toLowerCase().replace(/\s+/g, "-")}` : undefined,
          pitch: form.pitch?.trim() || form.description?.trim(),
          description: form.description?.trim(),
          city: form.city?.trim() || undefined,
          country: form.country?.trim().toUpperCase() || undefined,
          boosted: "none",
          verified: false,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMsg(data?.error || "Failed to create listing.");
        setSubmitting(false);
        return;
      }
      setMsg("Listing created. It will be visible on the marketplace shortly.");
      // reset
      setForm({
        name: "",
        category: "",
        pitch: "",
        description: "",
        city: "",
        country: "",
        platform: "whatsapp",
        number_or_handle: "",
        intent: "sell",
        acceptGovNorms: false,
      });
    } catch (e: any) {
      setMsg(e?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: BRAND.bg }}>
      <header
        className="sticky top-0 z-30 border-b"
        style={{ background: BRAND.bg, borderColor: BRAND.border }}
      >
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
            </span>
            <Link href="/business" className="font-semibold" style={{ color: BRAND.text }}>
              Business Listings
            </Link>
          </div>
          <Link href="/" className="text-sm underline" style={{ color: BRAND.primary }}>
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border p-4 md:p-5"
          style={{ background: "#fff", borderColor: BRAND.border }}
        >
          <h1 className="text-lg font-semibold" style={{ color: BRAND.text }}>
            List your business number
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#475569" }}>
            Let customers reach you instantly on WhatsApp or Telegram.
          </p>

          {/* Gov norms notice */}
          <div
            className="mt-4 rounded-xl p-3 text-sm"
            style={{ background: "#FFF7ED", border: `1px solid ${BRAND.border}`, color: "#8B5E00" }}
          >
            Before customers can contact you, we may require identity/business proof per local regulations.
            By listing, you agree to provide verification documents if asked.
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <div className="mb-1">Business name *</div>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g., GlobalSpareParts Co."
                className="w-full rounded-xl border px-3 py-2"
                style={{ borderColor: BRAND.border }}
              />
            </label>

            <label className="text-sm">
              <div className="mb-1">Category *</div>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl px-3 border outline-none pr-8"
                  style={{ borderColor: BRAND.border, background: "#fff" }}
                >
                  <option value="" disabled>Choose a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
              </div>
            </label>

            <label className="text-sm sm:col-span-2">
              <div className="mb-1">One‑liner (pitch)</div>
              <input
                value={form.pitch}
                onChange={(e) => set("pitch", e.target.value)}
                placeholder="90–140 chars — what should buyers know first?"
                className="w-full rounded-xl border px-3 py-2"
                style={{ borderColor: BRAND.border }}
              />
            </label>

            <label className="text-sm sm:col-span-2">
              <div className="mb-1">Detailed description</div>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What you sell/buy, brands, MOQ, regions, languages, shipping terms…"
                className="w-full rounded-xl border px-3 py-2"
                rows={4}
                style={{ borderColor: BRAND.border }}
              />
            </label>

            <label className="text-sm">
              <div className="mb-1">City</div>
              <input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Hyderabad"
                className="w-full rounded-xl border px-3 py-2"
                style={{ borderColor: BRAND.border }}
              />
            </label>

            <label className="text-sm">
              <div className="mb-1">Country (ISO‑2)</div>
              <input
                value={form.country}
                onChange={(e) => set("country", e.target.value.toUpperCase())}
                placeholder="IN / US / AE"
                className="w-full rounded-xl border px-3 py-2"
                style={{ borderColor: BRAND.border }}
              />
            </label>

            <label className="text-sm">
              <div className="mb-1">Platform *</div>
              <div className="relative">
                <select
                  value={form.platform}
                  onChange={(e) => set("platform", e.target.value as Platform)}
                  className="w-full h-10 appearance-none rounded-xl px-3 border outline-none pr-8"
                  style={{ borderColor: BRAND.border, background: "#fff" }}
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
              </div>
            </label>

            <label className="text-sm">
              <div className="mb-1">WhatsApp number or Telegram handle *</div>
              <input
                value={form.number_or_handle}
                onChange={(e) => set("number_or_handle", e.target.value)}
                placeholder={form.platform === "whatsapp" ? "+918917444396" : "@yourtelegram"}
                className="w-full rounded-xl border px-3 py-2"
                style={{ borderColor: BRAND.border }}
              />
              <div className="text-[11px] mt-1 opacity-70">
                {form.platform === "whatsapp"
                  ? "Use your official business number with country code."
                  : "Type your Telegram handle like @globalspares (4–32 chars)."}
              </div>
            </label>

            <label className="text-sm">
              <div className="mb-1">Intent *</div>
              <div className="relative">
                <select
                  value={form.intent}
                  onChange={(e) => set("intent", e.target.value as BizIntent)}
                  className="w-full h-10 appearance-none rounded-xl px-3 border outline-none pr-8"
                  style={{ borderColor: BRAND.border, background: "#fff" }}
                >
                  <option value="sell">Sell</option>
                  <option value="buy">Buy</option>
                  <option value="both">Buy & Sell</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
              </div>
            </label>

            <label className="text-sm inline-flex items-center gap-2 sm:col-span-2 mt-1">
              <input
                type="checkbox"
                checked={form.acceptGovNorms}
                onChange={(e) => set("acceptGovNorms", e.target.checked)}
              />
              I agree to provide verification documents if requested (gov norms).
            </label>
          </div>

          {msg && (
            <div
              className="mt-3 text-sm"
              style={{ color: msg.startsWith("Listing created") ? "#166534" : "#b91c1c" }}
            >
              {msg}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl px-4 py-2 font-medium"
              style={{ background: BRAND.primary, color: "#fff" }}
            >
              {submitting ? "Submitting…" : "Publish listing"}
            </button>
            <Link
              href="/business"
              className="rounded-xl border px-4 py-2 text-sm"
              style={{ borderColor: BRAND.border }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
