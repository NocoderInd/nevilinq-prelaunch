// apps/www/app/components/entity/BusinessCard.tsx
"use client";

import Link from "next/link";
import { BadgeCheck, Rocket } from "lucide-react";
import { BRAND, BusinessListing, buildContactLink } from "@/lib/types";

export default function BusinessCard({ item }: { item: BusinessListing }) {
  const preset =
    item.intent === "buy"
      ? `Hi ${item.name}, I can supply ${item.category || "the items you need"}.`
      : item.intent === "sell"
      ? `Hi ${item.name}, I found you on NEVILINQ and want to buy your ${item.category || "products"}.`
      : `Hi ${item.name}, I found you on NEVILINQ. Let's discuss business.`;

  const contactHref = buildContactLink(item.platform, item.number_or_handle, preset);

  return (
    <div
      className="rounded-2xl border p-4 flex flex-col justify-between"
      style={{
        borderColor: BRAND.border,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div>
        {/* Top badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: BRAND.bg,
              border: `1px solid ${BRAND.border}`,
              color: BRAND.text,
            }}
          >
            {item.platform === "whatsapp" ? "WhatsApp" : "Telegram"}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: BRAND.surface,
              color: BRAND.primary,
            }}
          >
            {item.intent.toUpperCase()}
          </span>
          {item.verified && (
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#E7F7ED", color: "#166534" }}
            >
              <BadgeCheck size={14} /> Verified
            </span>
          )}
          {item.boosted && item.boosted !== "none" && (
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#FFF5E6", color: "#8B5E00" }}
            >
              <Rocket size={14} /> Boosted
            </span>
          )}
        </div>

        {/* Name + pitch */}
        <h3
          className="text-base font-semibold"
          style={{ color: BRAND.text }}
        >
          {item.name}
        </h3>
        {item.pitch && (
          <p className="mt-1 text-sm" style={{ color: "#475569" }}>
            {item.pitch}
          </p>
        )}
        <p className="mt-1 text-xs" style={{ color: "#64748b" }}>
          {(item.category || "").trim()}{" "}
          {item.city ? `• ${item.city}` : ""}{" "}
          {item.country ? `• ${item.country}` : ""}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium"
          style={{ background: BRAND.accent, color: "#fff" }}
        >
          Contact
        </a>
        <Link
          href={`/business/${item.id}`}
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm"
          style={{ borderColor: BRAND.border }}
        >
          View
        </Link>
      </div>
    </div>
  );
}
