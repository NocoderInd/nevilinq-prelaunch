// apps/www/app/api/billing/invoices/route.ts
import { NextResponse } from "next/server";

// Mock invoices; replace by FastAPI fetch
export async function GET() {
  const invoices = [
    {
      id: "inv_1001",
      number: "NEV-2025-0001",
      amount_inr: 5400, // rupees
      created_at: "2025-07-20T10:00:00Z",
      status: "paid",
      provider: "razorpay",
      pdf_url: "/invoices/NEV-2025-0001.pdf",
    },
    {
      id: "inv_1002",
      number: "NEV-2025-0002",
      amount_inr: 10800,
      created_at: "2025-08-01T09:25:00Z",
      status: "paid",
      provider: "stripe",
      pdf_url: "/invoices/NEV-2025-0002.pdf",
    },
  ];
  return NextResponse.json({ ok: true, invoices });
}
