// apps/www/app/business/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, MapPin, ShieldCheck, Rocket, ChevronDown } from "lucide-react";
import BusinessCard from "@/app/components/entity/BusinessCard";
import { BRAND, type BusinessListing, type Platform, type BizIntent } from "@/lib/types";

type Draft = {
  name: string;
  category: string;
  city?: string;
  description?: string;
  platform: Platform;             // "whatsapp" | "telegram"
  number_or_handle: string;       // +CCXXXXXXXXXX or @handle
  intent: BizIntent;              // "sell" | "buy" | "both"
  agree?: boolean;
};

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

/* ------------- Seed (fallback only) ---------- */
const seed: BusinessListing[] = [
  {
    id: "b1",
    platform: "whatsapp",
    name: "PixelCraft Studio",
    number_or_handle: "+919876543210",
    intent: "sell",
    category: "#agency",
    pitch: "UI/UX, branding, and growth design sprints for startups.",
    description: "Design partner for early-stage startups. Fast cycles.",
    city: "Hyderabad",
    country: "IN",
    verified: true,
    boosted: "weekly",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "b2",
    platform: "telegram",
    name: "Healthy Bites",
    number_or_handle: "@healthybites_support",
    intent: "sell",
    category: "#local-business",
    pitch: "Homestyle meals with weekly subscription. COD nearby.",
    description: "Meals, tiffins, custom diet plans. Hygienic kitchen.",
    city: "Bengaluru",
    country: "IN",
    verified: false,
    boosted: "none",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/* ============================================= */

export default function BusinessPage() {
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const [draft, setDraft] = useState<Draft>({
    name: "",
    category: "",
    city: "",
    description: "",
    platform: "whatsapp",
    number_or_handle: "",
    intent: "sell",
    agree: false,
  });

  // Initial fetch from /api/business (falls back to seed on error)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/business");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setListings(Array.isArray(data?.rows) ? data.rows : []);
      } catch {
        setListings(seed);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((l) =>
      [
        l.name,
        l.category,
        l.pitch,
        l.description,
        l.city,
        l.country,
        l.sub_categories,
      ]
        .filter(Boolean)
        .some((x) => (x as string).toLowerCase().includes(q))
    );
  }, [filter, listings]);

  async function addListing() {
    // Basic validation
    if (!draft.name || !draft.category) {
      alert("Please enter Business Name and Category.");
      return;
    }
    if (!draft.agree) {
      alert("Please confirm you agree to verify ownership and follow norms.");
      return;
    }
    const value =
      draft.platform === "whatsapp"
        ? sanitizePhone(draft.number_or_handle)
        : sanitizeHandle(draft.number_or_handle);

    if (draft.platform === "whatsapp" && !isWhatsAppNumber(value)) {
      alert("WhatsApp number looks invalid. Use +CCXXXXXXXXXX (8–15 digits).");
      return;
    }
    if (draft.platform === "telegram" && !isTelegramHandleOrPhone(value)) {
      alert("Telegram handle looks invalid. Use @handle (4–32 chars) or a phone number.");
      return;
    }

    const payload = {
      platform: draft.platform,
      name: draft.name.trim(),
      number_or_handle: value,
      intent: draft.intent,
      category: draft.category ? `#${draft.category.toLowerCase().replace(/\s+/g, "-")}` : undefined,
      pitch: draft.description?.trim(), // reuse your short description as pitch
      description: draft.description?.trim(),
      city: draft.city?.trim(),
      country: undefined as string | undefined, // optional for now
      verified: false,
      boosted: "none" as const,
    };

    // POST to /api/business
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        alert(data?.error || "Failed to create listing.");
        return;
      }
      // Prepend locally
      setListings((prev) => [data.row as BusinessListing, ...prev]);
      // Reset draft
      setDraft({
        name: "",
        category: "",
        city: "",
        description: "",
        platform: "whatsapp",
        number_or_handle: "",
        intent: "sell",
        agree: false,
      });
    } catch (e: any) {
      alert(e?.message || "Network error");
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.bg }}>
      {/* Sticky header (logo + title) */}
      <header
        className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/75 bg-white"
        style={{ borderBottom: `1px solid ${BRAND.border}` }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* Mini logo (matches landing: three dots + wordmark) */}
          <Link href="/" className="inline-flex items-center">
            <span className="mr-2 inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
            </span>
            <span className="font-semibold tracking-tight" style={{ color: BRAND.text }}>
              NEVILINQ
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className="hidden sm:inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full"
              style={{ backgroundColor: BRAND.surface, border: `1px solid ${BRAND.border}`, color: BRAND.text }}
            >
              <ShieldCheck className="w-4 h-4" />
              Verified listings get better reach
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Title + search */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: BRAND.text }}>
              WhatsApp & Telegram Business Listings
            </h1>
            <p className="text-sm mt-1" style={{ color: "#556070" }}>
              Let customers reach you on your business number the moment they’re ready.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by name, category, city…"
                className="w-full h-10 rounded-xl pl-3 pr-10 border outline-none"
                style={{ borderColor: BRAND.border, color: BRAND.text, backgroundColor: "#fff" }}
              />
              <MapPin className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
            </div>
          </div>
        </div>

        {/* Form */}
        <section
          className="rounded-2xl p-4 md:p-5 mb-8 border"
          style={{ backgroundColor: "#fff", borderColor: BRAND.border }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: BRAND.surface, border: `1px solid ${BRAND.border}` }}
            >
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: BRAND.text }}>
              Add your business number
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-xs mb-1" style={{ color: "#556070" }}>
                Business Name *
              </label>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="h-10 rounded-xl px-3 border outline-none"
                style={{ borderColor: BRAND.border }}
                placeholder="e.g., WonderWave Toys"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1" style={{ color: "#556070" }}>
                Category *
              </label>
              <div className="relative">
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  className="h-10 w-full appearance-none rounded-xl px-3 border outline-none pr-8"
                  style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1" style={{ color: "#556070" }}>
                City
              </label>
              <input
                value={draft.city}
                onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
                className="h-10 rounded-xl px-3 border outline-none"
                style={{ borderColor: BRAND.border }}
                placeholder="e.g., Hyderabad"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1" style={{ color: "#556070" }}>
                Short Description (shown on card)
              </label>
              <input
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                className="h-10 rounded-xl px-3 border outline-none"
                style={{ borderColor: BRAND.border }}
                placeholder="e.g., Handcrafted wooden toys with LED fun"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1" style={{ color: "#556070" }}>
                Platform *
              </label>
              <div className="relative">
                <select
                  value={draft.platform}
                  onChange={(e) => setDraft((d) => ({ ...d, platform: e.target.value as Platform }))}
                  className="h-10 w-full appearance-none rounded-xl px-3 border outline-none pr-8"
                  style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1" style={{ color: "#556070" }}>
                WhatsApp Number or Telegram Handle *
              </label>
              <input
                value={draft.number_or_handle}
                onChange={(e) => setDraft((d) => ({ ...d, number_or_handle: e.target.value }))}
                className="h-10 rounded-xl px-3 border outline-none"
                style={{ borderColor: BRAND.border }}
                placeholder={draft.platform === "whatsapp" ? "+91 98765 43210" : "@your_handle"}
              />
              <span className="text-[11px] mt-1 opacity-70">
                {draft.platform === "whatsapp"
                  ? "Include country code (e.g., +918917444396)"
                  : "Use @handle (4–32 chars) or phone number"}
              </span>
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1" style={{ color: "#556070" }}>
                Intent *
              </label>
              <div className="relative">
                <select
                  value={draft.intent}
                  onChange={(e) => setDraft((d) => ({ ...d, intent: e.target.value as BizIntent }))}
                  className="h-10 w-full appearance-none rounded-xl px-3 border outline-none pr-8"
                  style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
                >
                  <option value="sell">Sell</option>
                  <option value="buy">Buy</option>
                  <option value="both">Buy & Sell</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              id="agree"
              type="checkbox"
              checked={!!draft.agree}
              onChange={(e) => setDraft((d) => ({ ...d, agree: e.target.checked }))}
              className="h-4 w-4 rounded border"
              style={{ borderColor: BRAND.border }}
            />
            <label htmlFor="agree" className="text-sm" style={{ color: "#2C3240" }}>
              I confirm this is my business number and I will verify as per govt norms.
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={addListing}
              className="h-10 px-4 rounded-xl font-medium border"
              style={{ backgroundColor: BRAND.primary, color: "#fff", borderColor: BRAND.primary }}
            >
              Save Listing
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center h-10 px-4 rounded-xl font-medium border"
              style={{ backgroundColor: BRAND.surface, color: BRAND.text, borderColor: BRAND.border }}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Boost (Daily / Weekly / 15 Days / 30 Days)
            </Link>
          </div>
        </section>

        {/* Results */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && (
            <div
              className="col-span-full rounded-2xl p-6 border text-center"
              style={{ borderColor: BRAND.border, backgroundColor: "#fff", color: BRAND.text }}
            >
              Loading…
            </div>
          )}
          {!loading &&
            filtered.map((b) => <BusinessCard key={b.id} item={b} />)}
          {!loading && filtered.length === 0 && (
            <div
              className="col-span-full rounded-2xl p-6 border text-center"
              style={{ borderColor: BRAND.border, backgroundColor: "#fff", color: BRAND.text }}
            >
              No results. Add your first business above.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
