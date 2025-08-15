// apps/admin/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // ← ensure this exists and includes Tailwind base/components/utilities
import React from "react";

/** NEVILINQ Brand (LOCKED) */
const BRAND = {
  primary: "#030027",
  accent: "#C16E70",
  surface: "#F2F3D9",
  text: "#0E1324",
  bg: "#F7F8FA",
  border: "#E6E9F1",
} as const;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEVILINQ — Admin",
  description: "Internal admin panel for NEVILINQ staff",
  applicationName: "NEVILINQ Admin",
  manifest: "/site.webmanifest",
  icons: { icon: "/favicon.ico" },
  other: { "theme-color": BRAND.primary },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: BRAND.primary,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const styleVars: CSSVars = {
    "--bg": BRAND.bg,
    "--text": BRAND.text,
    "--accent": BRAND.accent,
    "--primary": BRAND.primary,
    "--border": BRAND.border,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-[var(--bg)] text-[var(--text)]`}
        style={styleVars}
      >
        {children}
      </body>
    </html>
  );
}
