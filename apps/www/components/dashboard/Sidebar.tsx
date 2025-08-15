"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASH_ROUTES } from "./routes";

const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex md:flex-col md:w-64 border-r h-screen sticky top-0"
      style={{ borderColor: BRAND.border, backgroundColor: "#fff" }}
    >
      {/* Brand — logo + 'Dashboard' at top-left */}
      <div className="px-5 py-4 border-b" style={{ borderColor: BRAND.border }}>
        <Link href="/" className="inline-flex items-center gap-2">
          {/* three dots logo (locked vibe) */}
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.primary }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BRAND.accent }} />
          </span>
          <span className="font-semibold tracking-wide" style={{ color: BRAND.primary }}>
            NEVILINQ
          </span>
        </Link>
        <div className="mt-1 text-xs uppercase tracking-wider" style={{ color: "#6B7280" }}>
          Dashboard
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-auto py-3">
        <ul className="space-y-1">
          {DASH_ROUTES.map((r) => {
            const active = pathname === r.path;
            return (
              <li key={r.path}>
                <Link
                  href={r.path}
                  className={`mx-3 block rounded-xl px-3 py-2 text-sm ${
                    active ? "font-semibold" : "font-medium"
                  }`}
                  style={{
                    color: active ? BRAND.primary : BRAND.text,
                    backgroundColor: active ? "#F0F2F8" : "transparent",
                  }}
                >
                  {r.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer strip */}
      <div className="px-4 py-3 text-xs border-t" style={{ borderColor: BRAND.border, color: "#6B7280" }}>
        © {new Date().getFullYear()} NEVILINQ
      </div>
    </aside>
  );
}
