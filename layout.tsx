// apps/www/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

/**
 * NEVILINQ — Root Layout
 * Brand palette is LOCKED.
 * Global typography + background applied here.
 */

export const metadata: Metadata = {
  title: "NEVILINQ",
  description: "Find communities that match your world — WhatsApp & Telegram Groups, Channels, and Business Listings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F7F8FA] text-[#0E1324] antialiased">
        {children}
      </body>
    </html>
  );
}
