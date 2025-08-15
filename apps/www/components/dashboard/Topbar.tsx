"use client";

import Link from "next/link";

const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

export default function Topbar() {
  return (
    <header
      className="md:hidden sticky top-0 z-40 border-b bg-white/90 backdrop-blur"
      style={{ borderColor: BRAND.border }}
    >
      <div className="h-14 flex items-center justify-between px-4">
        {/* Left: Brand + Dashboard (matches “move logo+dashboard to left top corner”) */}
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
          </span>
          <span className="font-semibold tracking-wide" style={{ color: BRAND.primary }}>
            NEVILINQ
          </span>
        </Link>
        <span className="text-xs uppercase tracking-wide" style={{ color: "#6B7280" }}>
          Dashboard
        </span>
      </div>
    </header>
  );
}
